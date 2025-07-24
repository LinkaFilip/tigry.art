const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      body: "Webhook endpoint is alive",
    };
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = event.headers['stripe-signature'];

  // Pokud tělo přijde base64 encoded, dekóduj ho
  let rawBody = event.body;
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(event.body, 'base64').toString('utf8');
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        console.log("✅ Platba proběhla:", paymentIntent.id);
        break;

      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log("✅ Checkout dokončen:", session.id);
        break;

      default:
        console.log(`ℹ️ Nezpracovaný event: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};