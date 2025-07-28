const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 10 },
  'poster002': { name: 'Mexico – poster', price: 10 },
  'poster003': { name: 'Czechia – poster', price: 10 },
  'poster004': { name: 'Middle East – poster', price: 10 },
  'poster005': { name: 'Uganda – poster', price: 10 }
};

const SHIPPING_FEES = {
  'CZ': 150,
  'DE': 250,
  'US': 1000,
  'default': 500
};

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is empty" }),
      };
    }

    const { items, country } = JSON.parse(event.body);
    console.log('Přijaté položky:', items);
    console.log('Země:', country);

let totalInCents = 0;
for (const { id, quantity } of items) {
  const product = PRODUCTS[id];
  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown product: ${id}` }),
    };
  }
  totalInCents += product.price * 100 * quantity; // přepočítáno na centy
}

const shippingFeeInCents = parseInt(shippingFee) || 0;
const amountInCents = totalInCents + shippingFeeInCents;

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
