const stripe = require('stripe')("sk_test_51LpXXlEqK4P4Y8FRHxxQSGUDafn8XjwWaKHcXI7NAHRrY2MVdEOk3DH97ZjaiqcMlAqSEF9SxldmO9xPHtyRlEYT00OONh3M9p");

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