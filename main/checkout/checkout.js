const stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");

let elements;
let card;
const SHIPPING_COST = {
  AU: 12, AT: 9, BE: 9, CA: 14, CZ: 5, DK: 10, FI: 10, FR: 9, DE: 8,
  HK: 15, IE: 10, IL: 13, IT: 9, JP: 15, MY: 15, NL: 9, NZ: 14, NO: 12,
  PL: 8, PT: 9, SG: 15, KR: 15, ES: 9, SE: 10, CH: 10, AE: 15, GB: 10, US: 12,
};

const DELIVERY_INFO = {
  CZ: { type: "Domestic shipping", eta: "2–4 days" },
  SK: { type: "Borderline shipping", eta: "5–10 days" },
  default: { type: "International shipping", eta: "6–26 days" },
};

const PRODUCTS = {
  'poster001': { name: 'Japan – poster', price: 10 },
  'poster002': { name: 'Mexico – poster', price: 10 },
  'poster003': { name: 'Czechia – poster', price: 10 },
  'poster004': { name: 'Middle East – poster', price: 10 },
  'poster005': { name: 'Uganda – poster', price: 10 },
};

function getCartFromCookie() {
  const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
  return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
}

function renderProductFromCart() {
  const cart = getCartFromCookie();
  const container = document.querySelector("._1ip0g651._1ip0g650._1fragemms._1fragem41._1fragem5a._1fragem73");
  container.innerHTML = ""; // Clear previous

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

function updateDisplayedQuantity() {
  const cart = getCartFromCookie();
  let totalQuantity = 0;
  for (const item of cart) {
    totalQuantity += item.quantity;
  }

  const container = document.querySelector('._1m6j2n3m ._99ss3s1');
  if (container) {
    const spans = container.querySelectorAll('span');
    if (spans.length >= 2) {
      spans[1].textContent = totalQuantity;
    }
  }
}

function updateCartItemCount() {
  const cart = getCartFromCookie();
  const itemCount = cart.length;

  const container = document.querySelector('._1m6j2n3m ._99ss3s1');
  if (container) {
    const spans = container.querySelectorAll('span');
    if (spans.length >= 1) {
      spans[0].textContent = itemCount;
    }
  }
}
function calculateSubtotal() {
  const cartCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("cart="));
  const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];

  let subtotal = 0;
  for (const { id, quantity } of cart) {
    const product = PRODUCTS[id];
    if (product) {
      subtotal += product.price * quantity;
    }
  }

  return subtotal;
}
function updatePrices() {
  const subtotal = calculateSubtotal();
  const selectedCountry = document.getElementById("Select0").value; // get it fresh
  const shippingPrice = SHIPPING_COST[selectedCountry] ?? 0;
  const total = subtotal + shippingPrice;
  const subtotalDisplay = document.getElementById("subtotal-price");
  const shippingDisplay = document.getElementById("shipping-price");
  const totalDisplay = document.getElementById("total-price");
  const shippingSummary = document.querySelector("._1tx8jg70._1fragemms._1tx8jg715._1tx8jg71e._1tx8jg71f")

  const delivery = DELIVERY_INFO[selectedCountry] ?? DELIVERY_INFO.default;
  const countryLabel = document.getElementById("Select0").selectedOptions[0].text;

  subtotalDisplay.textContent = `€ ${subtotal.toFixed(2)}`;
  shippingDisplay.textContent = `€ ${shippingPrice.toFixed(2)}`;
  totalDisplay.textContent = `€ ${total.toFixed(2)}`;

  shippingSummary.textContent =
    `${delivery.type} (${countryLabel}): €${shippingPrice.toFixed(2)} – delivery in ${delivery.eta}`;

  return shippingPrice * 100;
}

async function initializeStripe(shippingFeeCents) {
  const cart = getCartFromCookie();

  const items = cart.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));

  try {
    const res = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shippingFee: shippingFeeCents }),
    });
    const data = await res.json();

    if (!data.clientSecret) {
      throw new Error('No client secret returned');
    }

    if (card) {
      card.unmount();
    }

    elements = stripe.elements();
    card = elements.create("card");
    card.mount("#card-element");

    stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: card,
      },
    }).then((result) => {
      if (result.error) {
        console.error("Payment failed", result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Payment succeeded!");
        }
      }
    });

  } catch (err) {
    console.error('Error initializing Stripe:', err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductFromCart();
  updateDisplayedQuantity();
  updateCartItemCount();

  const selectElement = document.getElementById("Select0");
  if (selectElement) {
    selectElement.addEventListener("change", async () => {
      console.log("Changed country to:", selectElement.value);
      const shippingFeeCents = updatePrices();
      await initializeStripe(shippingFeeCents);
    });
  }

  // Initial load
  const initialShippingFeeCents = updatePrices();
  initializeStripe(initialShippingFeeCents);
});
