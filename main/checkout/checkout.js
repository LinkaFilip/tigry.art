const stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");

  let elements, card;

  async function initializeStripe() {
    const cartCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("cart="));
    const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
    const simplifiedItems = cart.map(({ id, quantity }) => ({ id, quantity }));
    console.log(cart);
    console.log("Cookies:", document.cookie);
    console.log("cartCookie raw:", cartCookie);
    console.log("Parsed cart:", cart);
    if (cart.length === 0) {
      alert("Váš košík je prázdný. Přidejte prosím položky před platbou.");
      return;
    }
    const items = cart.map(({ id, quantity }) => ({ id, quantity }));
    console.log('Posílám položky:', items);
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

  const SHIPPING_COST = 2;        // číslo
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

  // Najdi rowgroup s produkty
  const parentGroup = document.querySelector('div[role="rowgroup"]');
  if (!parentGroup) {
    console.error("❌ Nenalezen rowgroup.");
    return;
  }

  // Najdi první row = šablonu
  const templateRow = parentGroup.querySelector('div[role="row"]');
  if (!templateRow) {
    console.error("❌ Nenalezen row jako šablona.");
    return;
  }

  // Smaž staré řádky (všechny kromě šablony)
  parentGroup.querySelectorAll('div[role="row"]').forEach((row, i) => {
    if (i > 0) row.remove();
  });

  // Pro každou položku vytvoř nový řádek
  cart.forEach(product => {
    const clone = templateRow.cloneNode(true);

    // Obrázek
    const img = clone.querySelector('img');
    if (img) {
      img.src = product.image || "";
      img.alt = product.name || "";
    }

    // Název (první <p>)
    const name = clone.querySelector('p');
    if (name) {
      name.textContent = product.name || "Produkt";
    }

    // Množství (hledáme span, který není Quantity)
    const spans = clone.querySelectorAll('span');
    spans.forEach(span => {
      if (span.textContent.trim() !== "Quantity" && !isNaN(span.textContent)) {
        span.textContent = product.quantity;
      }
    });

    // Cena (např. poslední role=cell → span)
    const priceSpan = clone.querySelector('div[role="cell"] span:not(:has(span))');
    if (priceSpan) {
      priceSpan.textContent = `Kč ${ (product.price * product.quantity).toFixed(2) }`;
    }

    parentGroup.appendChild(clone);
  });

  // Aktualizuj počty
  updateDisplayedQuantity();
  updateCartItemCount();
}

// 👉 Čekej pomocí MutationObserver na DOM, až Shopify vloží šablonu
function waitForShopifyTemplate() {
  const parent = document.querySelector('section._1fragem32._1fragemms');
  if (!parent) {
    console.error("❌ Parent sekce nebyla nalezena.");
    return;
  }

  const observer = new MutationObserver(() => {
    const rowGroups = parent.querySelectorAll('[role="rowgroup"]');
    if (rowGroups.length >= 2) {
      console.log("✅ Šablona byla detekována, spouštím render...");
      observer.disconnect(); // přestaň sledovat
      renderShopifyStyleCart();
    }
  });

  observer.observe(parent, { childList: true, subtree: true });
  console.log("👀 Sleduji DOM pomocí MutationObserver pro načtení šablony...");
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
  
  const container = document.querySelector('._1m6j2n3m ._99ss3s1'); // Přizpůsob, pokud máš jiné místo
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