const stripe = require('stripe')(process.env.STRIPE_SECRET);

const productPrices = {
  POSTER_A: parseInt(process.env.PRODUCT_POSTER_A),
  POSTER_B: parseInt(process.env.PRODUCT_POSTER_B),
  POSTER_C: parseInt(process.env.PRODUCT_POSTER_C),
};

exports.handler = async (event) => {
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const data = JSON.parse(event.body);

    // Příklad: načti produkt z dat
    const productId = data.productId;
    if (!productId) throw new Error("Missing productId");

    // třeba map produktů, ceny v centech
    const products = {
      POSTER_A: 1000,
      POSTER_B: 1500,
      POSTER_C: 2500,
    };

    const amount = products[productId];
    if (!amount) throw new Error("Invalid productId");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
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