const stripe = require('stripe')(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const ordersFile = path.join(__dirname, 'orders.json');

async function readOrders() {
  try {
    const data = await fs.readFile(ordersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

async function addOrder(order) {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
}

async function getOrderByPaymentIntentId(paymentIntentId) {
  const orders = await readOrders();
  return orders.find(order => order.paymentIntentId === paymentIntentId) || null;
}

async function updateOrderStatus(orderId, status) {
  const orders = await readOrders();
  let updated = false;
  const newOrders = orders.map(order => {
    if (order.id === orderId) {
      updated = true;
      return { ...order, status };
    }
    return order;
  });
  if (updated) {
    await writeOrders(newOrders);
  }
  return updated;
}

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
    case 'payment_intent.succeeded': {
      const paymentIntent = stripeEvent.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

      const order = await getOrderByPaymentIntentId(paymentIntent.id);
      if (!order) {
        console.error(`Order not found for PaymentIntent ID: ${paymentIntent.id}`);
        return {
          statusCode: 400,
          body: 'Order not found'
        };
      }
      if (order.totalAmount !== paymentIntent.amount_received) {
        console.error(`Payment amount mismatch: order ${order.totalAmount} vs payment ${paymentIntent.amount_received}`);
      }
      const updated = await updateOrderStatus(order.id, 'paid');
      if (updated) {
        console.log(`Order ${order.id} status updated to paid`);
      } else {
        console.error(`Failed to update order status for order ${order.id}`);
      }
      break;
    }
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
