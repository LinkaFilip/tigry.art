document.addEventListener("DOMContentLoaded", async () => {
  const SHIPPING_COST = {
    AU: 1200, AT: 900, BE: 900, CA: 1400, CZ: 500, DK: 1000, FI: 1000, FR: 900, DE: 800,
    HK: 1500, IE: 1000, IL: 1300, IT: 900, JP: 1500, MY: 1500, NL: 900, NZ: 1400, NO: 1200,
    PL: 800, PT: 900, SG: 1500, KR: 1500, ES: 900, SE: 1000, CH: 1000, AE: 1500, GB: 1000, US: 1200,
  };

  let stripe;
  let elements;
  let card;
  let clientSecret;

  const selectElement = document.getElementById("Select0");
  const payButton = document.getElementById("pay-button");

  const subtotalDisplay = document.getElementById("subtotal-price");
  const shippingDisplay = document.getElementById("shipping-price");
  const totalDisplay = document.getElementById("total-price");
  const shippingSummary = document.getElementById("shipping-summary");

  const getCart = () => {
    const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
    return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
  };

  const getSelectedShipping = () => {
    const selected = selectElement.value;
    return SHIPPING_COST[selected] || 0;
  };

  const calculateSubtotal = () => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const updatePrices = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = getSelectedShipping();
    const total = subtotal + shippingFee;

    subtotalDisplay.textContent = `€ ${(subtotal / 100).toFixed(2)}`;
    shippingDisplay.textContent = `€ ${(shippingFee / 100).toFixed(2)}`;
    totalDisplay.textContent = `€ ${(total / 100).toFixed(2)}`;
    shippingSummary.textContent = `Shipping to ${selectElement.options[selectElement.selectedIndex].text} – € ${(shippingFee / 100).toFixed(2)}`;

    return shippingFee;
  };

  const initializeStripe = async () => {
    const cart = getCart();
    const items = cart.map(({ id, quantity }) => ({ id, quantity }));
    const shippingFee = getSelectedShipping();

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shippingFee }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert("Chyba při vytváření platby: " + error.error);
      return;
    }

    const data = await response.json();
    clientSecret = data.clientSecret;

    stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb"); // nahraď vlastním
    elements = stripe.elements({ clientSecret, appearance: { theme: "flat" } });

    if (card) card.unmount(); // aby se nemountoval znovu
    card = elements.create("card");
    card.mount("#card-element");
  };

  payButton.addEventListener("click", async () => {
    if (!clientSecret) {
      alert("Platba nebyla inicializována.");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (result.error) {
      alert("Platba selhala: " + result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        localStorage.removeItem("cart");
        window.location.href = "/posters/?success=true";
      }
    }
  });

  // Reaguje na změnu země
  selectElement.addEventListener("change", async () => {
    updatePrices();
    await initializeStripe();
  });

  // Init po načtení stránky
  updatePrices();
  await initializeStripe();
});
