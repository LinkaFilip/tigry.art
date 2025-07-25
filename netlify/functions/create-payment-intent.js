const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 10 },
  'poster002': { name: 'Mexico – poster', price: 10 },
  // ...
};

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body);

    // Spočítáme celkovou částku
    let total = 0;
    for (const { id, quantity } of items) {
      const product = PRODUCTS[id];
      if (!product) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown product: ${id}` })
        };
      }
      total += product.price * quantity;
    }

    const amountInCents = total * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };

  } catch (error) {
    console.error("Payment Intent Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};