const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { promoCode } = JSON.parse(event.body);

  try {
    const coupons = await stripe.coupons.list({ limit: 100 });

    const matched = coupons.data.find(
      (c) => c.name === promoCode && c.valid
    );

    if (matched) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: true,
          percent_off: matched.percent_off,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: false }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};