const stripe = require("stripe")(process.env.STRIPE_SECRET);

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: Number(process.env.PRODUCT_POSTER_A) || 1000 },
  'poster002': { name: 'Mexico – poster', price: Number(process.env.PRODUCT_POSTER_B) || 1000 },
  'poster003': { name: 'Czechia – poster', price: Number(process.env.PRODUCT_POSTER_C) || 1000 },
  'poster004': { name: 'Middle East – poster', price: Number(process.env.PRODUCT_POSTER_D) || 1000 },
  'poster005': { name: 'Uganda – poster', price: Number(process.env.PRODUCT_POSTER_E) || 1000 },
};

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Request body is empty" }) };
    }

    const { items, shippingFee, promoCode, calculatedTotal } = JSON.parse(event.body);

    // Spočítat celkovou cenu produktů
    let totalInCents = 0;
    for (const { id, quantity } of items) {
      const product = PRODUCTS[id];
      if (!product) {
        return { statusCode: 400, body: JSON.stringify({ error: `Unknown product id: ${id}` }) };
      }
      totalInCents += product.price * quantity;
    }

    // Převod shipping fee na centy
    const shippingFeeInCents = parseInt(shippingFee) || 0;

    let discount = 0;

    // Ověření a výpočet slevy z promo kódu přes Stripe API
    if (promoCode) {
      const upperCode = promoCode.toUpperCase();

      const promoList = await stripe.promotionCodes.list({
        code: upperCode,
        active: true,
        limit: 1,
      });

      if (promoList.data.length === 0) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid promo code." }) };
      }

      const promo = promoList.data[0];

      // Načíst detail kuponu
      const coupon = await stripe.coupons.retrieve(promo.coupon.id);

      if (coupon.percent_off) {
        discount = Math.round((totalInCents + shippingFeeInCents) * coupon.percent_off / 100);
      }
    }

    const expectedAmount = totalInCents + shippingFeeInCents - discount;

    // Kontrola, zda cena souhlasí s tím, co klient poslal
    if (Math.abs(expectedAmount - calculatedTotal) > 1) {
      return { statusCode: 400, body: JSON.stringify({ error: "Price mismatch between client and server." }) };
    }

    // Vytvořit payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculatedTotal,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: items.map(({ id, quantity }) => {
          const product = PRODUCTS[id];
          return `${product ? product.name : id} ×${quantity}`;
        }).join(", "),
        promoCode: promoCode || "",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error("Payment Intent Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};