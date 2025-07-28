const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: Number(process.env.PRODUCT_POSTER_A) }, // v centech
  'poster002': { name: 'Mexico – poster', price: Number(process.env.PRODUCT_POSTER_B) },
  'poster003': { name: 'Czechia – poster', price: Number(process.env.PRODUCT_POSTER_C) },
  // ostatní produkty tady pokud chceš
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

    const { items, shippingFee, country } = JSON.parse(event.body);
    console.log('Přijaté položky:', items);
    console.log('Země:', country);

let totalInCents = 0;
for (const { id, quantity } of items) {
  const product = PRODUCTS[id];
  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown product ${id}` }),
    };
  }
  totalInCents += product.price * quantity * 100;  // Převod EUR na centy
}

const shippingFeeInCents = parseInt(shippingFee) || 0;

const amount = totalInCents * 100 + shippingFeeInCents;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };} 
  catch (error) {
    console.error("Payment Intent Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
