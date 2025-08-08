import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handler = async (event) => {
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
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object;

    // Najdi objednávku podle payment_intent_id v Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_intent_id', paymentIntent.id)
      .limit(1);

    if (error) {
      console.error('Chyba při hledání objednávky:', error);
      return { statusCode: 500, body: 'Database error' };
    }

    if (!orders || orders.length === 0) {
      console.error('Objednávka nenalezena pro PaymentIntent ID:', paymentIntent.id);
      return { statusCode: 400, body: 'Order not found' };
    }
    const order = orders[0];
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', order.id);

    if (updateError) {
      console.error('Chyba při aktualizaci statusu:', updateError);
      return { statusCode: 500, body: 'Update error' };
    }

    console.log(`Objednávka ${order.id} byla označena jako zaplacená.`);
  }

  return {
    statusCode: 200,
    body: 'Webhook processed',
  };
};
