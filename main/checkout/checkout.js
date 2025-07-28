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

  const cartItemsContainer = document.getElementById("cart-items");

  // Načti košík z cookie
  const getCart = () => {
    const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
    return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
  };
function renderProductFromCart() {
  const cart = getCartFromCookie();
  const container = document.querySelector("._1ip0g651._1ip0g650._1fragemms._1fragem41._1fragem5a._1fragem73");
  container.innerHTML = "";

  cart.forEach(item => {
    const itemDiv = document.createElement('section');
    itemDiv.className = '_1fragem32 _1fragemms uniqueChild_uniqueChildTemplate_Az6bO8';
    itemDiv.innerHTML = `
      <div class="_1mjy8kn6 _1fragemms _16s97g73k" style="--_16s97g73f: 40vh;">
        <div tabindex="0" role="group" scrollbehaviour="chain" class="_1mjy8kn1 _1mjy8kn0 _1fragemms _1fragempm _1fragem2x _1fragemdm _16s97g73k _1mjy8kn4 _1mjy8kn2 _1fragemku _1frageml9 vyybB" style="--_16s97g73f: 40vh; overflow: hidden;">
          <div class="_6zbcq522 _1fragemth">
            <h3 id="ResourceList0" class="n8k95w1 n8k95w0 _1fragemms n8k95w4 n8k95wg">Shopping cart</h3>
          </div>
          <div role="table" aria-labelledby="ResourceList0" class="_6zbcq56 _6zbcq55 _1fragem3c _1fragemou _6zbcq5o _6zbcq5c _1fragem50 _6zbcq516">
            <div role="rowgroup" class="_6zbcq54 _6zbcq53 _1fragem3c _1fragemou _6zbcq51d _6zbcq51c _1fragemth">
              <div role="row" class="_6zbcq51f _6zbcq51e _1fragem3c _1fragemni _1fragempm _1fragem6t">
                <div role="columnheader" class="_6zbcq522 _1fragemth">Product image</div>
                <div role="columnheader" class="_6zbcq522 _1fragemth">Description</div>
                <div role="columnheader" class="_6zbcq522 _1fragemth">Quantity</div>
                <div role="columnheader" class="_6zbcq522 _1fragemth">Price</div>
              </div>
            </div>
            <div role="rowgroup" class="_6zbcq54 _6zbcq53 _1fragem3c _1fragemou">
              <div role="row" class="_6zbcq51i _6zbcq51h _1fragem3c _1fragem2x _6zbcq51l _6zbcq510 _6zbcq51k">
                <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51t _6zbcq51q _1fragem8w _6zbcq51o">
                  <div class="_1fragem32 _1fragemms _16s97g74b" style="--_16s97g746: 6.4rem;">
                    <div class="_5uqybw0 _1fragemms _1fragem3c _1fragem8h">
                      <div class="_5uqybw1 _1fragem3c _1fragemlt _1fragemp0 _1fragemu _1fragemnm _1fragem50 _1fragem6t _1fragem8h">
                        <div class="_1m6j2n34 _1m6j2n33 _1fragemms _1fragemui _1m6j2n3a _1m6j2n39 _1m6j2n35" style="--_1m6j2n30: 1;">
                          <picture>
                            <img src="${item.image}" style="width: 100%; height: 100%; object-fit: contain;" alt="${item.name}">
                          </picture>
                          <div class="_1m6j2n3m _1m6j2n3l _1fragemmi">
                            <div class="_99ss3s1 _99ss3s0 _1fragemni _1fragem87 _1fragempn _99ss3s6 _99ss3s2 _1fragem3c _99ss3sh _99ss3sc _99ss3sa _1fragemjb _1fragemhi _99ss3su _99ss3sp _1fragemq8 _1fragemqe _1fragemqq _1fragemqk">
                              <span class="_99ss3sw _1fragemth">Quantity</span>
                              <span>${item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51u _6zbcq51r _1fragem87 _6zbcq51p _6zbcq51n _1fragemno _6zbcq51x _6zbcq51w _1fragemox _16s97g741" style="--_16s97g73w: 6.4rem;">
                  <div class="_1fragem32 _1fragemms dDm6x">
                    <p class="_1tx8jg70 _1fragemms _1tx8jg7c _1tx8jg7b _1fragemp3 _1tx8jg715 _1tx8jg71d _1tx8jg71f">${item.name}</p>
                    <div class="_1ip0g651 _1ip0g650 _1fragemms _1fragem41 _1fragem5z _1fragem7s"></div>
                  </div>
                </div>
                <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51u _6zbcq51r _1fragem87 _6zbcq51o _6zbcq51y"><div class="_6zbcq522 _1fragemth">
                  <span class="_19gi7yt0 _19gi7yt12 _19gi7yt1a _19gi7yt1g"></span>
                </div>
              </div>
              <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51u _6zbcq51r _1fragem87 _6zbcq51p _6zbcq51n _1fragemno"><div class="_197l2oft _1fragemou _1fragemnk _1fragem3c _1fragemms Byb5s">
                <span translate="no" class="_19gi7yt0 _19gi7yt12 _19gi7yt1a _19gi7yt1g notranslate">€ ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    // Insert quantity inside the empty quantity span
    itemDiv.querySelector('._19gi7yt0._19gi7yt12._19gi7yt1a._19gi7yt1g').textContent = item.quantity;
    container.appendChild(itemDiv);
  });
}
const calculateSubtotal = () => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Vrátí vybranou zemi
  const getSelectedCountry = () => selectElement.value;

  // Spočítá shipping fee podle země
  const getSelectedShipping = () => {
    const country = getSelectedCountry();
    return SHIPPING_COST[country] || 0;
  };

  // Aktualizace zobrazených cen
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

  // Inicializace Stripe + vytvoření Payment Intent
  const initializeStripe = async () => {
    const cart = getCart();
    const items = cart.map(({ id, quantity }) => ({ id, quantity }));
    const shippingFee = getSelectedShipping();
    const country = getSelectedCountry();

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shippingFee, country }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert("Chyba při vytváření platby: " + error.error);
      return;
    }

    const data = await response.json();
    clientSecret = data.clientSecret;

    if (!stripe) {
      stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");
    }

    if (elements) {
      elements = null;
    }
    elements = stripe.elements({ clientSecret, appearance: { theme: "flat" } });

    if (card) card.unmount();
    card = elements.create("card");
    card.mount("#card-element");
  };

  // Platba
  payButton.addEventListener("click", async () => {
    if (!clientSecret) {
      alert("Platba nebyla inicializována.");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      alert("Platba selhala: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      localStorage.removeItem("cart");
      // Můžeš vymazat i cookie cart, pokud chceš
      document.cookie = "cart=; max-age=0; path=/";
      window.location.href = "/posters/?success=true";
    }
  });

  // Po změně země přepočítej ceny a znovu inicializuj Stripe
  selectElement.addEventListener("change", async () => {
    updatePrices();
    await initializeStripe();
  });

  // Start: vykresli košík, přepočítej ceny, inicializuj Stripe
  renderProductFromCart();
  updatePrices();
  await initializeStripe();
});

