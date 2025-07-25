const stripe = require('stripe')(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 1000 },
  'poster002': { name: 'Mexico – poster', price: 1000 },
  // ...
};

console.log("Final amount:", amount);
exports.handler = async (event) => {
  if (amount < 50) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Amount must be at least 50 cents." })
  };
}
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