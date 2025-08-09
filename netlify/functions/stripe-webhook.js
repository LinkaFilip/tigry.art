// stripe-webhook.js (CommonJS)
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE env vars', { supabaseUrl, supabaseKey: !!supabaseKey });
  throw new Error('Missing SUPABASE env vars');
}

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  let payload = event.body;
  if (event.isBase64Encoded) payload = Buffer.from(event.body, 'base64').toString('utf8');
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;
      console.log('Webhook payment_intent.succeeded for id:', paymentIntent.id);

      // SELECT - logněte úplnou odpověď
      const { data: orders, error: selectError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_intent_id', paymentIntent.id)
        .limit(1);

      console.log('Select result:', { orders, selectError: selectError && JSON.stringify(selectError) });

      if (selectError) {
        // vrátíme chybové info klientovi pro debugging (dočasně)
        console.error('Select error detail:', selectError);
        return { statusCode: 500, body: JSON.stringify({ error: selectError }) };
      }

      if (!orders || orders.length === 0) {
        console.error('Order not found for PaymentIntent ID:', paymentIntent.id);
        return { statusCode: 400, body: 'Order not found' };
      }

      const order = orders[0];
      console.log('Found order:', order.id);

      // UPDATE - logněte úplnou odpověď
      const { data: updated, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', order.id)
        .select();

      console.log('Update result:', { updated, updateError: updateError && JSON.stringify(updateError) });

      if (updateError) {
        console.error('Update error detail:', updateError);
        return { statusCode: 500, body: JSON.stringify({ error: updateError }) };
      }

      console.log(`Order ${order.id} marked as paid.`);
    }

    return { statusCode: 200, body: 'Webhook processed' };
  } catch (err) {
    console.error('Unhandled error in webhook:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};
