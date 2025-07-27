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


function renderShopifyStyleCartFromRow() {
  const cartCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("cart="));
  const cart = cartCookie
    ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1]))
    : [];

  const parentGroup = document.querySelector('div[role="rowgroup"]');
  if (!parentGroup) {
    return;
  }


  const templateRow = parentGroup.querySelector('div[role="row"]');
  if (!templateRow) {
    return;
  }

 
  parentGroup.querySelectorAll('div[role="row"]').forEach((row, i) => {
    if (i > 0) row.remove();
  });

  cart.forEach(product => {
    const clone = templateRow.cloneNode(true);

    const img = clone.querySelector('img');
    if (img) {
      img.src = product.image || "";
      img.alt = product.name || "";
    }

    const name = clone.querySelector('p');
    if (name) {
      name.textContent = product.name || "Produkt";
    }

    const spans = clone.querySelectorAll('span');
    spans.forEach(span => {
      if (span.textContent.trim() !== "Quantity" && !isNaN(span.textContent)) {
        span.textContent = product.quantity;
      }
    });

    const priceSpan = clone.querySelector('div[role="cell"] span:not(:has(span))');
    if (priceSpan) {
      priceSpan.textContent = `Kč ${ (product.price * product.quantity).toFixed(2) }`;
    }

    parentGroup.appendChild(clone);
  });

  updateDisplayedQuantity();
  updateCartItemCount();
}

function waitForShopifyTemplate() {
  const parent = document.querySelector('section._1fragem32._1fragemms');
  if (!parent) {
    return;
  }

  const observer = new MutationObserver(() => {
    const rowGroups = parent.querySelectorAll('[role="rowgroup"]');
    if (rowGroups.length >= 2) {
      observer.disconnect();
      renderShopifyStyleCart();
    }
  });

  observer.observe(parent, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
  waitForShopifyTemplate();
});


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