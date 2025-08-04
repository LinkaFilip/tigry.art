const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.handler = async (event) => {
  try {
    const {  
      items,
      country,
      promoCode,
      deliveryMethod,
      shippingFee,
      packetaBranchId,
      packetaBranchName,
      packetaBranchStreet,
      packetaBranchCity,
      packetaBranchZip,
      packetaBranchType,
      selectedBranchLongitude,
      selectedBranchLatitude,
} = JSON.parse(event.body);
    console.log("Received body:", event.body);
    const cartItems = items.map((item) => `${item.name} (x${item.quantity})`).join(", ");
    const subtotal = items.reduce((sum, item) => {
      const priceInCents = Math.round(item.price * 100);
      return sum + priceInCents * item.quantity;
    }, 0);
    const SHIPPING_COST = {
    AU: 4400, AT: 1480, BE: 1630, CA: 3700, CZ: 530, DK: 1944, FI: 2630, FR: 1944,
    DE: 1200, HK: 4400, IE: 2150, IL: 4400, IT: 1944, JP: 4400, MY: 4400, NL: 1627,
    NZ: 4275, NO: 4300, PL: 1025, PT: 2152, SG: 4400, KR: 4400, ES: 2360, SE: 2632,
    CH: 4260, AE: 4275, GB: 2920, US: 3661,
    };
const fallbackShipping = SHIPPING_COST[country] || 0;
const parsedShipping = Number(shippingFee);
const shipping = !isNaN(parsedShipping) ? parsedShipping : fallbackShipping;

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
    packeta_branch_address: `${packetaBranchStreet}, ${packetaBranchCity}, ${packetaBranchZip}`,
    packeta_branch_type: packetaBranchType || "unknown",
    selectedBranchLongitude,
    selectedBranchLatitude,
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