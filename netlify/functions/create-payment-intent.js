const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 10 },
  'poster002': { name: 'Mexico – poster', price: 10 },
  'poster003': { name: 'Czechia – poster', price: 10 },
  'poster004': { name: 'Middle East – poster', price: 10 },
  'poster005': { name: 'Uganda – poster', price: 10 }
};

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is empty" }),
      };
    }

const { items, shippingFee = 0 } = JSON.parse(event.body);
    console.log('Přijaté položky:', items);
    console.log("event.body:", event.body);

let total = 0;
for (const { id, quantity } of items) {
  const product = PRODUCTS[id];
  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown product: ${id}` }),
    };
  }
  total += product.price * quantity;
}


const shippingFeeNum = parseFloat(shippingFee) || 0;

const amountInCents = total * 100 + shippingFeeNum;

if (amountInCents < 50) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Amount must be at least 50 cents." }),
  };
}

console.log("Final amount:", amountInCents);

const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: 'eur',
  automatic_payment_methods: { enabled: true },
  metadata: {
    order: items.map(({ id, quantity }) => {
      const product = PRODUCTS[id];
      return `${product.name} x${quantity}`;
    }).join(', ')
  }
});

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amountInCents
      }),
    };

  } catch (error) {
    console.error("Payment Intent Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};