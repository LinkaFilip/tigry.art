const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { products } = require('./data/products');

exports.handler = async function(event, context) {
  try {
    const { productId, quantity = 1 } = JSON.parse(event.body);

    const product = products.find(p => p.id === productId);
    if (!product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produkt nenalezen.' }),
      };
    }

    const amount = product.price * quantity;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: product.currency,
      payment_method_types: ['card'],
      metadata: {
        product_id: product.id,
        quantity: String(quantity),
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};