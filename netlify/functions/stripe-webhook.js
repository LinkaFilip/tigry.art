const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Podpis Stripe webhook secret z nastavení webhooku
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  // Netlify předává tělo jako string v event.body (nikoli JSON objekt!)
  const sig = event.headers['stripe-signature'];

  let eventStripe;

  try {
    // IMPORTANT: Musíme použít stripe.webhooks.constructEvent, 
    // kde předáme právě surový text těla (event.body), nikoli JSON objekt
    eventStripe = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Zpracování různých eventů
  if (eventStripe.type === 'charge.succeeded') {
    const charge = eventStripe.data.object;
    console.log(`Charge succeeded for amount: ${charge.amount}`);
    // Tady můžeš aktualizovat DB, odeslat email, atd.
  }

  if (eventStripe.type === 'payment_intent.succeeded') {
    const paymentIntent = eventStripe.data.object;
    console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
  }

  return {
    statusCode: 200,
    body: 'Webhook received successfully',
  };
};