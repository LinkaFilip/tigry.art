const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event) => {
  try {
    const {items, country, promoCode, packetaBranchId, packetaBranchName, deliveryMethod, shippingFee} = JSON.parse(event.body);
    const cartItems = items.map((item) => `${item.name} (x${item.quantity})`).join(", ");
    const subtotal = items.reduce((sum, item) => {
      const priceInCents = Math.round(item.price * 100);
      return sum + priceInCents * item.quantity;
    }, 0);
    const SHIPPING_COST = {
      AU: 300, AT: 300, BE: 300, CA: 300, CZ: 300, DK: 300, FI: 300, FR: 300,
      DE: 300, HK: 300, IE: 300, IL: 300, IT: 300, JP: 1500, MY: 300, NL: 300,
      NZ: 300, NO: 300, PL: 300, PT: 300, SG: 300, KR: 300, ES: 300, SE: 300,
      CH: 300, AE: 300, GB: 300, US: 300,
    };
const fallbackShipping = SHIPPING_COST[country] || 0;
const shipping = typeof shippingFee === "number" ? shippingFee : fallbackShipping;

let discountPercent = 0;

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

const totalBeforeDiscount = subtotal + shipping;
const discountAmount = Math.round(totalBeforeDiscount * (discountPercent / 100));
const totalAmount = totalBeforeDiscount - discountAmount;

const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount,
  currency: "eur",
  automatic_payment_methods: { enabled: true },
  metadata: {
    order_summary: JSON.stringify(cartItems), // přidej to jako string
    country: country,
    promo_code: promoCode || "none",
    discount_percent: discountPercent.toString(), // volitelné
    discount_amount: discountAmount.toString(),
    delivery_method: deliveryMethod,
    packeta_branch_id: packetaBranchId || "none",
    packeta_branch_name: packetaBranchName || "none",
  },
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