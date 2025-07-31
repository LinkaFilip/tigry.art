const stripe = require('stripe')(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  let payload = event.body;
  if (event.isBase64Encoded) {
    payload = Buffer.from(event.body, 'base64').toString('utf8');
  }

  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  console.log('Webhook received:', stripeEvent.type);

  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', stripeEvent.data.object.id);
      break;
    case 'charge.succeeded':
      console.log('Charge succeeded for amount:', stripeEvent.data.object.amount);
      break;
    case 'coupon.created':
      break;
    default:
      console.log('Unhandled event type:', stripeEvent.type);
  }

  return {
    statusCode: 200,
    body: 'Webhook received successfully',
  };
};