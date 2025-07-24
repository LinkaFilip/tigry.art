const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.handler = async (event) => {
  try {
    // Můžeš odkomentovat a zalogovat tělo požadavku pokud posíláš data
    // const data = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // částka v haléřích: 1000 = 10.00 CZK
      currency: 'eur',
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