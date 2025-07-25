const stripe = require('stripe')(process.env.STRIPE_SECRET);

const productPrices = {
  POSTER_A: parseInt(process.env.PRODUCT_POSTER_A),
  POSTER_B: parseInt(process.env.PRODUCT_POSTER_B),
  POSTER_C: parseInt(process.env.PRODUCT_POSTER_C),
};

exports.handler = async (event) => {
    try {
    const data = JSON.parse(event.body);
    const productId = data.productId;

    const amount = productPrices[productId];
    if (!amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Neplatný produkt." }),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true,},
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Stripe PaymentIntent Error:', error.message);

    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};