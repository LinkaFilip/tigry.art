const stripe = require('stripe')("sk_test_51LpXXlEqK4P4Y8FRHxxQSGUDafn8XjwWaKHcXI7NAHRrY2MVdEOk3DH97ZjaiqcMlAqSEF9SxldmO9xPHtyRlEYT00OONh3M9p");

async function registerDomains() {
  try {
    const domains = ['tigry.art', 'www.tigry.art'];

    for (const domain of domains) {
      const result = await stripe.paymentMethodDomains.create({
        domain_name: domain,
      });
    }
  } catch (error) {
  }
}

registerDomains();