const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // 10 EUR v centech
    currency: 'eur',
    payment_method_types: ['card'],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };
};