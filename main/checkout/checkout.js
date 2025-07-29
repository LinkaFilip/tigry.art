document.addEventListener("DOMContentLoaded", async () => {
  const SHIPPING_COST = {
    AU: 300, AT: 300, BE: 300, CA: 300, CZ: 300, DK: 300, FI: 300, FR: 300,
    DE: 300, HK: 300, IE: 300, IL: 300, IT: 300, JP: 1500, MY: 300, NL: 300,
    NZ: 300, NO: 300, PL: 300, PT: 300, SG: 300, KR: 300, ES: 300, SE: 300,
    CH: 300, AE: 300, GB: 300, US: 300,
  };

  let stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");
    const getCartFromCookie = () => {
    const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
    return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
  };  
  const calculateSubtotal = () => {
    const cart = getCartFromCookie();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  const selectElement = document.getElementById("Select0");
  const payButton = document.getElementById("pay-button");

  const getSelectedCountry = () => selectElement.value;

  const getSelectedShipping = () => {
    const country = getSelectedCountry();
    return SHIPPING_COST[country] || 0;  // v centech
  };
  const paymentRequest = stripe.paymentRequest({
  country: getSelectedCountry(), // Nebo CZ, pokud chceš testovat z ČR
  currency: 'eur',
  total: {
    label: 'Celková cena',
    amount: Math.round((calculateSubtotal() + getSelectedShipping()) * 100), // v centech
  },
  requestPayerName: true,
  requestPayerEmail: true,
});
const style = {
  base: {
    fontSize: '16px',
    color: '#000000',
    '::placeholder': { color: '#aaa' },
    backgroundColor: "white",
  },
  invalid: {
    color: '#e5424d'
  }
};
  let elements = stripe.elements();
  let cardNumber = elements.create('cardNumber', {style});
  let cardExpiry = elements.create('cardExpiry', {style});
  let cardCvc = elements.create('cardCvc', {style});

  cardNumber.mount('#card-number-element');
  cardExpiry.mount('#card-expiry-element');
  cardCvc.mount('#card-cvc-element');

const prButton = elements.create('paymentRequestButton', {
  paymentRequest: paymentRequest,
  style: {
    paymentRequestButton: {
      type: 'default',
      theme: 'dark',
      height: '44px',
    },
  },
});

paymentRequest.canMakePayment().then(function(result) {
  if (result) {
    prButton.mount('#payment_request_button');
  } else {
    document.getElementById('payment_request_button').style.display = 'none';
  }
});






  const subtotalDisplay = document.getElementById("subtotal-price");
  const shippingDisplay = document.getElementById("shipping-price");
  const totalDisplay = document.getElementById("total-price");
  const shippingSummary = document.getElementById("shipping-summary");

  const updatePrices = () => {
    const subtotalEUR = calculateSubtotal(); // v EUR
    const shippingFeeCents = getSelectedShipping(); // v centech
    const shippingFeeEUR = shippingFeeCents / 100;
    const totalEUR = subtotalEUR + shippingFeeEUR;

    subtotalDisplay.textContent = `€ ${subtotalEUR.toFixed(2)}`;
    shippingDisplay.textContent = `€ ${shippingFeeEUR.toFixed(2)}`;
    totalDisplay.textContent = `€ ${totalEUR.toFixed(2)}`;
    shippingSummary.textContent = `Shipping to ${selectElement.options[selectElement.selectedIndex].text} – € ${shippingFeeEUR.toFixed(2)}`;

    return shippingFeeCents;
  };

  const renderProductFromCart = () => {
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
              <h3 id="ResourceList0" class="n8k95w1 n8k95w0 _1fragemms n8k95w4 n8k95wg">${item.name}</h3>
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
                      <p class="_1fragem12">${item.description || ''}</p>
                    </div>
                  </div>
                  <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51w _6zbcq51t _1fragemno _6zbcq51a _6zbcq519 _1fragemox" style="--_16s97g73w: 6.4rem;">
                    <span style="display: flex; justify-content: flex-end;">€ ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(itemDiv);
    });
  };

  // Update UI prices on country change
  selectElement.addEventListener("change", () => {
    updatePrices();
  });

  // Initial render
  renderProductFromCart();
  updatePrices();

  // Handle payment submission
  payButton.addEventListener("click", async () => {
    payButton.disabled = true;
    payButton.textContent = "Processing...";

    const cart = getCartFromCookie();
    if (!cart.length) {
      alert("Cart is empty.");
      payButton.disabled = false;
      payButton.textContent = "Zaplatit";
      return;
    }

    const shippingFee = getSelectedShipping();
    const country = getSelectedCountry();

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, shippingFee, country }),
    });

    const data = await response.json();
    if (!data.clientSecret) {
      alert("Chyba při vytváření platby.");
      payButton.disabled = false;
      payButton.textContent = "Zaplatit";
      return;
    }

    const email = document.getElementById("email").value;
    const firstName = document.getElementById("TextField0").value;
    const lastName = document.getElementById("TextField1").value;
    const address1 = document.getElementById("TextField2").value;
    const postalCode = document.getElementById("TextField4").value;
    const city = document.getElementById("TextField5").value;
    const phone = document.getElementById("TextField6").value;

    const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email,
          phone,
          address: {
            line1: address1,
            postal_code: postalCode,
            city,
            country,
          },
        },
      },
      shipping: {
        name: `${firstName} ${lastName}`,
        address: {
          line1: address1,
          postal_code: postalCode,
          city,
          country,
        },
      },
    });

    if (error) {
      alert(error.message);
      payButton.disabled = false;
      payButton.textContent = "Zaplatit";
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      document.cookie = "cart=; Max-Age=0; path=/";
      location.href = "/posters/?success=true";
    }
  });
});