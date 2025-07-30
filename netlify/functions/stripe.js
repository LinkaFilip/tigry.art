const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event, context) => {
  try {
    console.log("Starting session creation...");

    const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: 'forever', // nebo 'repeating', 'forever'
    });
    const promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'test10',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://tigry.art/posters/",
      cancel_url: "https://tigry.art/",
    });

    console.log("Session created:", session.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error("Stripe error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};