const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // Tady můžeš zpracovat vstupní data event.body, pokud je potřeba
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,        // částka v nejmenší měně, např. 1000 = 10.00 CZK
      currency: 'czk',
    });

    return {
      statusCode: 200,
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 400,
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};