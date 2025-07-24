const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  console.log('--- New webhook call ---');
  console.log('Headers:', event.headers);
  console.log('Raw body length:', event.body ? event.body.length : 'undefined');
  console.log('Raw body (first 300 chars):', event.body ? event.body.substring(0, 300) : 'undefined');
  console.log('Content-Length:', event.headers['content-length']);
  console.log('Content-Type:', event.headers['content-type']);


  if (!event.body || event.body.trim().length === 0) {
    console.error('No webhook payload was provided.');
    return {
      statusCode: 400,
      body: 'No webhook payload was provided.',
    };
  };
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!sig) {
    console.error('No stripe-signature header provided.');
    return { statusCode: 400, body: 'Missing stripe-signature header.' };
  }

  let eventStripe;
  try {
    eventStripe = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  console.log('Webhook received:', eventStripe.type);

  // zpracování eventů
  switch (eventStripe.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', eventStripe.data.object.id);
      break;
    case 'charge.succeeded':
      console.log('Charge succeeded for amount:', eventStripe.data.object.amount);
      break;
    default:
      console.log('Unhandled event type:', eventStripe.type);
  }

  return { statusCode: 200, body: 'Webhook received successfully' };
};