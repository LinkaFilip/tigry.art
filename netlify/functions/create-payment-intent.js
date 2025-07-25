const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 1000 },
  'poster002': { name: 'Mexico – poster', price: 1000 },
  'poster003': { name: 'Czechia – poster', price: 1000 },
  'poster004': { name: 'Middle East – poster', price: 1000 },
  'poster005': { name: 'Uganda – poster', price: 1000 }
};

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is empty" }),
      };
    }

    const { items } = JSON.parse(event.body);
    console.log("event.body:", event.body);

    let total = 0;
    for (const { id, quantity } of items) {
      const product = PRODUCTS[id];
      if (!product) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown product: ${id}` }),
        };
      }
      total += product.price * quantity;
    }

    const amountInCents = total * 100;

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