const stripe = require('stripe')(process.env.STRIPE_SECRET);

async function registerDomain() {
  try {
    const paymentMethodDomain = await stripe.paymentMethodDomains.create({
      domain_name: 'tigry.art',
    });

    console.log('Registered domain:', paymentMethodDomain);
  } catch (error) {
    console.error('Error registering domain:', error.message);
  }
}

registerDomain();