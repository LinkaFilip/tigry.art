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
      "poster001": 1499,
      "poster002": 1499,
      "poster003": 1499,
      "poster004": 1499,
      "poster005": 1499,
      "poster006": 1499,
      "poster007": 1499,
      "poster008": 1499,
      "poster009": 1499,
      "poster010": 1499,
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
        PL: {
          zbox: 265,
          evening: 600,
          packeta: 200,
        },
        HU: {
          zbox: 350,
          evening: 350,
          packeta: 350,
        },
        RO: {
          zbox: 400,
          evening: 400,
          packeta: 400,
        },
      };
      const pricing = shippingTable[country];
      if (pricing) {
        shipping = pricing[deliveryMethod] || 0;
      }
    }
    if (deliveryMethod === "courier") {
      const courierShippingPrices = {
        AU: 2526,
        AT: 1350,
        BE: 3033,
        CA: 2261,
        CZ: 497,
        DK: 2033,
        FI: 2033,
        FR: 2033,
        DE: 1350,
        HK: 2171,
        IE: 2033,
        IL: 2558,
        IT: 2033,
        JP: 2171,
        MY: 2171,
        NL: 2033,
        NZ: 2558,
        NO: 2033,
        PL: 1267,
        PT: 2033,
        SG: 2261,
        KR: 2171,
        ES: 2033,
        SE: 2033,
        CH: 2033,
        AE: 2261,
        GB: 2033,
        US: 2261,
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
