const stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");

  let elements, card;

  async function initializeStripe() {
    const cartCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("cart="));
    const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
    const simplifiedItems = cart.map(({ id, quantity }) => ({ id, quantity }));
    if (cart.length === 0) {
      return;
    }
    const items = cart.map(({ id, quantity }) => ({ id, quantity }));
    const res = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Chyba při vytvoření platby: " + errorData.error);
      return;
    }

    const data = await res.json();
    const clientSecret = data.clientSecret;

    elements = stripe.elements({
      clientSecret,
      appearance: { theme: 'flat' },
      paymentMethodCreation: 'manual',
    });

    card = elements.create("card");
    card.mount("#card-element");

    const paymentRequest = stripe.paymentRequest({
      country: "CZ",
      currency: "eur",
      total: {
        label: "Platba",
        amount: data.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const prButton = elements.create("paymentRequestButton", {
      paymentRequest: paymentRequest,
    });

    const result = await paymentRequest.canMakePayment();
    if (result && (result.googlePay || result.applePay)) {
      prButton.mount("#payment-request-button");
    } else {
      document.getElementById("payment-request-button").style.display = "none";
    }

    paymentRequest.on("paymentmethod", async (ev) => {
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: ev.paymentMethod.id,
        },
        { handleActions: false }
      );

      if (confirmError) {
        ev.complete("fail");
        alert(confirmError.message);
      } else {
        ev.complete("success");
      }
    });

    const form = document.getElementById("payment-form");
    const errorMsg = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const billingDetails = {
        name: `${document.getElementById("TextField0").value} ${document.getElementById("TextField1").value}`,
        email: document.getElementById("email").value,
        phone: document.getElementById("TextField6").value,
        address: {
          line1: document.getElementById("TextField2").value,
          line2: document.getElementById("TextField3").value,
          city: document.getElementById("TextField5").value,
          postal_code: document.getElementById("TextField4").value,
          country: document.getElementById("Select0").value.toUpperCase(),
        },
      };

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: billingDetails,
        },
      });

      if (error) {
        errorMsg.textContent = error.message;
      } else if (paymentIntent.status === "succeeded") {
        form.reset();
        card.clear();
        localStorage.removeItem('cart');
        window.location.href = '/posters/?success=true';
      }
    });
  }
function displayTotalPrice() {
  const cartCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("cart="));
  const cart = cartCookie
    ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1]))
    : [];

  const subtotal = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const SHIPPING_COST = 2;
  const shippingEl   = document.getElementById("shipping-price");
  const total = subtotal + SHIPPING_COST;

  document.getElementById("subtotal-price").textContent = `€ ${subtotal.toFixed(2)}`;
  shippingEl.textContent                                = `€ ${SHIPPING_COST.toFixed(2)}`;
  document.getElementById("total-price").textContent    = `€ ${total.toFixed(2)}`;

}

  displayTotalPrice();
  initializeStripe();


function renderProductFromCart() {
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.querySelector("._1ip0g651._1ip0g650._1fragemms._1fragem41._1fragem5a._1fragem73");

cart.forEach(item => {
    const itemDiv = document.createElement('section');
    itemDiv.className = '_1fragem32 _1fragemms uniqueChild_uniqueChildTemplate_Az6bO8';

    itemDiv.innerHTML = `
        <div class="_1mjy8kn6 _1fragemms _16s97g73k" style="--_16s97g73f: 40vh;">
        <div tabindex="0" role="group" scrollbehaviour="chain" class="_1mjy8kn1 _1mjy8kn0 _1fragemms _1fragempm _1fragem2x _1fragemdm _16s97g73k _1mjy8kn4 _1mjy8kn2 _1fragemku _1frageml9 vyybB" style="--_16s97g73f: 40vh;">
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
                            <img src="${item.image}" alt="${item.image}">
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
                <span translate="no" class="_19gi7yt0 _19gi7yt12 _19gi7yt1a _19gi7yt1g notranslate">${item.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div aria-hidden="true" class="_1r4exbt7 _1r4exbt6 _1fragemfu _1frageme1 _1fragemjq _1fragemhx _1fragemmi _1fragem3c _1fragemni _1fragemri _1fragemtg _1r4exbta _1r4exbt8 _1fragemsi _1r4exbt5">Scroll for more items
      <span class="a8x1wu2 a8x1wu1 _1fragempm _1fragem2x _1fragemlo _1fragemle a8x1wu9 a8x1wui a8x1wum a8x1wuk _1fragem32 a8x1wuq a8x1wuo a8x1wuw">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" focusable="false" aria-hidden="true" class="a8x1wuy a8x1wux _1fragem32 _1fragempm _1fragemlo _1fragemle _1fragemot">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 1.5v11m0 0 4.75-3.826M7 12.5 2.25 8.674"></path>
        </svg>
      </span>
    </div>
  </div>
    `;

    container.appendChild(itemDiv);
    });
}
window.addEventListener("DOMContentLoaded", renderProductFromCart);

function updateDisplayedQuantity() {
  const cartCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("cart="));
  const cart = cartCookie
    ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1]))
    : [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const container = document.querySelector('._1m6j2n3m ._99ss3s1');
  const firstPrice = document.querySelector("._19gi7yt0._19gi7yt12._19gi7yt1a._19gi7yt1g.notranslate");
  if (container) {
    const spans = container.querySelectorAll('span');
    if (spans.length >= 2) {
      spans[1].textContent = totalQuantity;
    }
  }
}
function updateCartItemCount() {
  const cartCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("cart="));
  const cart = cartCookie
    ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1]))
    : [];

  const itemCount = cart.length;
  
  const container = document.querySelector('._1m6j2n3m ._99ss3s1');
  if (container) {
    const spans = container.querySelectorAll('span');
    if (spans.length >= 2) {
      spans[1].textContent = itemCount;
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateDisplayedQuantity();
  updateCartItemCount();
});