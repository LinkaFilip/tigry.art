const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event) => {
  try {
    const { items, country, promoCode } = JSON.parse(event.body);

    // 1. Spočítej subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const SHIPPING_COST = {
      AU: 300, AT: 300, BE: 300, CA: 300, CZ: 300, DK: 300, FI: 300, FR: 300,
      DE: 300, HK: 300, IE: 300, IL: 300, IT: 300, JP: 1500, MY: 300, NL: 300,
      NZ: 300, NO: 300, PL: 300, PT: 300, SG: 300, KR: 300, ES: 300, SE: 300,
      CH: 300, AE: 300, GB: 300, US: 300,
    };
    const shipping = SHIPPING_COST[country] || 0;

    let discountPercent = 0;

    // 2. Ověř promo kód přes Stripe
    if (promoCode) {
      const codes = await stripe.promotionCodes.list({
        code: promoCode,
        active: true,
        limit: 1,
      });

      if (codes.data.length > 0) {
        const coupon = codes.data[0].coupon;
        if (coupon.percent_off) {
          discountPercent = coupon.percent_off;
        }
      }
    }

    // 3. Spočítej výslednou částku
    const totalBeforeDiscount = subtotal + shipping;
    const discountAmount = Math.round(totalBeforeDiscount * (discountPercent / 100));
    const totalAmount = totalBeforeDiscount - discountAmount;

    // 4. Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    console.error("Stripe error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};