const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.handler = async (event) => {
  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
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