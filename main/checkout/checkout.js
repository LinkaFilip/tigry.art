let stripe, elements, card, clientSecret;

// --- Definice cen dopravy a doručení ---
const SHIPPING_COST = {
  AU: 1200, AT: 900, BE: 900, CA: 1400, CZ: 500, DK: 1000, FI: 1000, FR: 900, DE: 800,
  HK: 1500, IE: 1000, IL: 1300, IT: 900, JP: 1500, MY: 1500, NL: 900, NZ: 1400, NO: 1200,
  PL: 800, PT: 900, SG: 1500, KR: 1500, ES: 900, SE: 1000, CH: 1000, AE: 1500, GB: 1000, US: 1200,
};

const DELIVERY_INFO = {
  CZ: { type: "Domestic shipping", eta: "2–4 days" },
  SK: { type: "Borderline shipping", eta: "5–10 days" },
  default: { type: "International shipping", eta: "6–26 days" },
};

// --- DOM prvky ---
const selectElement = document.getElementById("Select0");
const subtotalDisplay = document.getElementById("subtotal");
const shippingDisplay = document.getElementById("shipping");
const totalDisplay = document.getElementById("total");
const shippingSummary = document.getElementById("shipping-summary");

// --- Spočítej a aktualizuj cenu ---
function updatePrices() {
  const selectedCountry = selectElement.value;
  const shippingPrice = SHIPPING_COST[selectedCountry] ?? 0;
  const delivery = DELIVERY_INFO[selectedCountry] ?? DELIVERY_INFO.default;
  const countryLabel = selectElement.options[selectElement.selectedIndex].text;

  const cart = JSON.parse(decodeURIComponent(document.cookie.split("; ").find(r => r.startsWith("cart="))?.split("=")[1] || "[]"));
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  subtotalDisplay.textContent = `€ ${(subtotal / 100).toFixed(2)}`;
  shippingDisplay.textContent = `€ ${(shippingPrice / 100).toFixed(2)}`;
  totalDisplay.textContent = `€ ${((subtotal + shippingPrice) / 100).toFixed(2)}`;
  shippingSummary.textContent = `${delivery.type} (${countryLabel}): €${(shippingPrice / 100).toFixed(2)} – delivery in ${delivery.eta}`;

  return shippingPrice;
}

// --- Inicializuj Stripe ---
async function initializeStripe(shippingFee) {
  const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
  const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
  const simplifiedItems = cart.map(({ id, quantity }) => ({ id, quantity }));
  const selectedCountry = selectElement.value;

  const res = await fetch('/.netlify/functions/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: simplifiedItems, shippingFee })
  });

  const data = await res.json();
  clientSecret = data.clientSecret;

  stripe = Stripe("TVŮJ_PUBLIC_KEY"); // nahraď vlastním
  elements = stripe.elements({ clientSecret });
  card = elements.create("card");
  card.mount("#card-element");
}

// --- Odeslání platby po submitu ---
const form = document.getElementById("payment-form");
const errorMsg = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!clientSecret) {
    alert("Platba nebyla inicializována.");
    return;
  }

  const billingDetails = {
    name: `${document.getElementById("TextField0").value} ${document.getElementById("TextField1").value}`,
    email: document.getElementById("email").value,
    phone: document.getElementById("TextField6").value,
    address: {
      line1: document.getElementById("TextField2").value,
      line2: document.getElementById("TextField3").value,
      city: document.getElementById("TextField5").value,
      postal_code: document.getElementById("TextField4").value,
      country: selectElement.value
    }
  };

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: billingDetails,
    }
  });

  if (error) {
    errorMsg.textContent = error.message;
  } else if (paymentIntent.status === "succeeded") {
    localStorage.removeItem("cart");
    alert("Payment succeeded!");
    window.location.href = "/posters/?success=true";
  }
});

// --- Inicalizační tlačítko ---
const payButton = document.getElementById("pay-button");
if (payButton) {
  payButton.addEventListener("click", async () => {
    const fee = updatePrices();
    await initializeStripe(fee);
  });
}

// --- Sleduj změnu země ---
selectElement.addEventListener("change", updatePrices);

// --- Inicializuj hned na začátku ---
updatePrices();
