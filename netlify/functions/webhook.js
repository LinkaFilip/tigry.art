const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // NE testovací public key
const { buffer } = require("micro");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  let body = event.body;

  // Pokud je base64 encoded (Netlify funkce to někdy dělá automaticky)
  if (event.isBase64Encoded) {
    const buff = Buffer.from(event.body, "base64");
    body = buff.toString("utf-8");
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // ⬇️ Zde řešíš event typu
  if (stripeEvent.type === "payment_intent.succeeded") {
    const paymentIntent = stripeEvent.data.object;
    console.log("✅ Payment succeeded:", paymentIntent.id);

    // sem můžeš uložit do DB, odeslat email, atd.
  }

  return { statusCode: 200, body: "Received" };
};