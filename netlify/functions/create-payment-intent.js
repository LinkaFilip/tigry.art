const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: Number(process.env.PRODUCT_POSTER_A) || 1000 },
  'poster002': { name: 'Mexico – poster', price: Number(process.env.PRODUCT_POSTER_B) || 1000 },
  'poster003': { name: 'Czechia – poster', price: Number(process.env.PRODUCT_POSTER_C) || 1000 },
  'poster004': { name: 'Middle East – poster', price: Number(process.env.PRODUCT_POSTER_D) || 1000 },
  'poster005': { name: 'Uganda – poster', price: Number(process.env.PRODUCT_POSTER_E) || 1000 },
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
  totalInCents += product.price * quantity;  // už v centech, ne *100
}

const shippingFeeInCents = parseInt(shippingFee) || 0;

const amount = totalInCents + shippingFeeInCents; 

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    metadata: {
      items: items.map(item => item.id).join(','),
      country,
      shippingFee: shippingFee.toString()
    }
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
