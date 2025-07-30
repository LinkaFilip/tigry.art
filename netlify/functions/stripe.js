const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event, context) => {
  try {
    console.log("Starting session creation...");

    // Nejprve zjistíme, jestli promo code "TEST10" už existuje
    const existing = await stripe.promotionCodes.list({
      code: "TEST10",
      active: true,
      limit: 1,
    });

    if (existing.data.length === 0) {
      // Vytvoř kupon
      const coupon = await stripe.coupons.create({
        percent_off: 10,
        duration: "forever",
      });

      // Vytvoř promo kód
      await stripe.promotionCodes.create({
        code: "TEST10",
        coupon: coupon.id,
      });

      console.log("✅ Promo kód TEST10 byl vytvořen.");
    } else {
      console.log("ℹ️ Promo kód TEST10 už existuje, nebude vytvořen znovu.");
    }

    // Vytvoření platby
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