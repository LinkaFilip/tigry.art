const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

exports.handler = async (event) => {
  try {
    const {  
      items,
      country,
      promoCode,
      deliveryMethod,
      packetaBranchId,
      packetaBranchName,
      packetaBranchStreet,
      packetaBranchCity,
      number
    } = JSON.parse(event.body);

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items in the cart");
    }

    console.log("Received body:", event.body);
    const cartItems = items.map((item) => `${item.name} (x${item.quantity})`).join(", ");
    
    const productsDB = {
      "poster001": 1000,
      "poster002": 1000,
      "poster003": 1000,
      "poster004": 1000,
      "poster005": 1000,
      "poster006": 1000,
      "poster007": 1000,
      "poster008": 1000,
      "poster009": 1000,
      "poster010": 1000,
    };

    const subtotal = items.reduce((sum, item) => {
      const priceInCents = productsDB[item.id];
      if (!priceInCents) throw new Error(`Unknown product ID: ${item.id}`);
      return sum + priceInCents * item.quantity;
    }, 0);

    let shipping = 0;

    if (deliveryMethod === "packeta" || deliveryMethod === "zbox" || deliveryMethod === "evening") {
      const shippingTable = {
        CZ: {
          zbox: 200,
          evening: 550,
          packeta: 200,
        },
        SK: {
          zbox: 200,
          evening: 600,
          packeta: 200,
        },
      };

      const pricing = shippingTable[country];
      if (pricing) {
        shipping = pricing[deliveryMethod] || 0;
      }
    }
    if (deliveryMethod === "courier") {
      const courierShippingPrices = {
        AU: 4400,
        AT: 1480,
        BE: 1630,
        CA: 3700,
        CZ: 530,
        DK: 1944,
        FI: 2630,
        FR: 1944,
        DE: 1200,
        HK: 4400,
        IE: 2150,
        IL: 4400,
        IT: 1944,
        JP: 4400,
        MY: 4400,
        NL: 1627,
        NZ: 4275,
        NO: 4300,
        PL: 1025,
        PT: 2152,
        SG: 4400,
        KR: 4400,
        ES: 2360,
        SE: 2632,
        CH: 4260,
        AE: 4275,
        GB: 2920,
        US: 3661,
      };

      shipping = courierShippingPrices[country] || 0;
    }

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
        order_summary: JSON.stringify(cartItems),
        country: country,
        promo_code: promoCode || "none",
        discount_percent: discountPercent.toString(),
        discount_amount: discountAmount.toString(),
        delivery_method: deliveryMethod,
        packeta_branch_id: packetaBranchId || "none",
        packeta_branch_name: packetaBranchName || "none",
        packeta_branch_address: `${packetaBranchStreet}, ${packetaBranchCity}`,
        number: number
      },
    });
    console.log("Using Supabase:", supabaseUrl);
    console.log("Service role key exists:", !!supabaseServiceRoleKey);
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        payment_intent_id: paymentIntent.id,
        items,
        total_amount: totalAmount,
        status: 'pending',
        country,
        delivery_method: deliveryMethod,
        created_at: new Date().toISOString(),
      }], { count: 'exact', returning: 'representation' });

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

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
