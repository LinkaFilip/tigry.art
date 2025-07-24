const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  let eventStripe;
  try {
    eventStripe = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  console.log('Webhook received:', eventStripe.type);

  switch (eventStripe.type) {
    case 'charge.succeeded':
      const charge = eventStripe.data.object;
      console.log(`Charge succeeded for amount: ${charge.amount}`);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = eventStripe.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
      break;

    // Přidej další eventy, které chceš zpracovat
    default:
      console.log(`Unhandled event type: ${eventStripe.type}`);
  }

  return { statusCode: 200, body: 'Webhook received successfully' };
};