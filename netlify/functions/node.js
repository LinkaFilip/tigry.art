const stripe = require('stripe')("process.env.STRIPE_SECRET");

async function registerDomains() {
  try {
    const domains = ['tigry.art', 'www.tigry.art'];

    for (const domain of domains) {
      await stripe.paymentMethodDomains.create({
        domain_name: domain,
      });
    }
  } catch (error) {
  }
}

registerDomains();