if (new URL(window.location.href).pathname === "/posters/" && new URL(window.location.href).searchParams.get("success") === "true") {
  localStorage.clear();
  window.history.replaceState({}, document.title, "/posters/");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.img,
      };
      addToCart(product);

      const element = document.querySelector(".CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
      const overlay = document.querySelector(".Overlay_overlay__hwjQ3");
      const cartPanel = document.querySelector(".Cart_cart__yGsQk");

      if (element && overlay && cartPanel) {
        const isMobile = window.matchMedia("(max-width: 1024px)").matches;

        element.classList.remove("CartIndicator_icon__AFivB");
        element.classList.add("CartIndicator_closeBtn___fEN6");
        element.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linejoin="round" d="M13 1L1 13M1 1l12 12"/>
          </svg>`;

        overlay.style.opacity = "1";
        overlay.style.visibility = "inherit";
        overlay.style.pointerEvents = "auto";
        cartPanel.style.transform = "translate(0, 0)";
        cartPanel.classList.add("Cart_open__Hlx3_");

        renderCart();
      }
    });
  });

  const element = document.querySelector(".CartIndicator_icon__AFivB");
  const cartPanel = document.querySelector(".Cart_cart__yGsQk");
  const panel = document.querySelector(".Cart_cartContent__TEVzy");

  if (!element || !cartPanel || !panel) return;

  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  cartPanel.style.transform = isMobile ? "translate(0, -100%)" : "translate(100%, 0)";
  cartPanel.style.transition = "transform 0.5s ease";

  const bagSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
  <g clip-path="url(#a)">
    <path stroke="currentColor" stroke-width="1.5"
      d="M5.5 6.25v-2a3.5 3.5 0 1 1 7 0v2m-11.75.5h16.5v10.5H.75V6.75Z" />
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h18v18H0z"></path>
    </clipPath>
  </defs>
</svg>`;

  const crossSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
  <path stroke="currentColor" stroke-linejoin="round" d="M13 1L1 13M1 1l12 12"/>
</svg>`;

  element.innerHTML = bagSVG;

  element.addEventListener("click", () => {
    const overlay = document.querySelector(".Overlay_overlay__hwjQ3");
    const isOpen = element.classList.contains("CartIndicator_closeBtn___fEN6");

    if (isOpen) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
      element.innerHTML = bagSVG;

      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
      cartPanel.style.transform = isMobile ? "translate(0, -100%)" : "translate(100%, 0)";
    } else {
      element.classList.replace("CartIndicator_icon__AFivB", "CartIndicator_closeBtn___fEN6");
      element.innerHTML = crossSVG;

      overlay.style.opacity = "1";
      overlay.style.visibility = "inherit";
      overlay.style.pointerEvents = "auto";
      cartPanel.style.transform = "translate(0, 0)";
    }

    cartPanel.classList.toggle("Cart_open__Hlx3_");
    renderCart();
  });

  panel.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item")) {
      event.preventDefault();
      const idToRemove = event.target.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(item => item.id !== idToRemove);
      localStorage.setItem("cart", JSON.stringify(cart));
      document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + "; path=/";
      renderCart();
    }
  });
  const overlay = document.querySelector(".Overlay_overlay__hwjQ3");
  overlay.addEventListener("click", () => {
    const element = document.querySelector(".CartIndicator_closeBtn___fEN6");
    const cartPanel = document.querySelector(".Cart_cart__yGsQk");

    if (element && cartPanel) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
      element.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
          <g clip-path="url(#a)">
            <path stroke="currentColor" stroke-width="1.5"
              d="M5.5 6.25v-2a3.5 3.5 0 1 1 7 0v2m-11.75.5h16.5v10.5H.75V6.75Z" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h18v18H0z"></path>
            </clipPath>
          </defs>
        </svg>`;

      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;
      cartPanel.style.transform = isMobile ? "translate(0, -100%)" : "translate(100%, 0)";
      cartPanel.classList.remove("Cart_open__Hlx3_");
    }
  });
});

function addToCart(product) {
  if (!product.id || !product.name || isNaN(product.price)) {
    console.warn("Neplatný produkt:", product);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + "; path=/";
  renderCart();
}

function renderCart() {
  const panel = document.querySelector(".Cart_cartContent__TEVzy");
  const footerWrapper = document.querySelector(".Cart_cartFooter__owP1q");
  panel.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countDisplay = document.querySelector(".Cart_cartCount__dchXe");

  let total = 0;
  let itemCount = 0;

  if (cart.length === 0) {
    panel.innerHTML = "<p>The cart is empty</p>";
    footerWrapper.style.display = "none";
    countDisplay.textContent = "Cart (0)";
    return;
  }

  cart.forEach(item => {
    const quantity = item.quantity || 1;
    const lineTotal = item.price * quantity;
    total += lineTotal;
    itemCount += quantity;

    const div = document.createElement("div");
    div.className = "LineItems_lineItems__9aSyR";
    div.innerHTML = `
  <div class="LineItem_lineItem__ZK2EH">
    <div class="LineItem_imageContainer__gDc0v">
      <div class="ShopifyImage_shopifyImage__FC9OT" style="padding-top: 125%;">
        <img>
      </div>
    </div>
    <div class="LineItem_lineItemInfo__4tov_">
      <div class="LineItem_topRow__FjuFV">
        <div class="LineItem_top__4SbKk">
          <span class="LineItem_title__FgmYr">${item.name}</span>
          <span class="LineItem_totalPrice__KJ57U"><strong>${lineTotal.toFixed(2)} €</strong></span>
        </div>
      </div>
<div class="LineItem_bottomRow__auvwE" style="">
  <div class="LineItem_quantitySelector__nUMsi QuantitySelector_quantitySelector__aZh48">
    <div class="QuantitySelector_quantity__4sUhH"><span class="QuantitySelector_qtyLabel___kOy2">Qty</span>
    <span>${quantity}</span>
    </div>
    <button class="qty-btn decrease QuantitySelector_adjustButton__B31Mr" data-id="${item.id}">-</button>

        <button class="qty-btn increase QuantitySelector_adjustButton__B31Mr" data-id="${item.id}">+</button>
</div>
      <span class="remove-item" data-id="${item.id}" style="cursor:pointer; color:#000000; text-transform: uppercase; text-decoration:underline;">Remove</span>

</div>
    </div>
  </div>
    `;
    panel.appendChild(div);
  });
panel.querySelectorAll(".qty-btn").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (button.classList.contains("increase")) {
      item.quantity += 1;
    } else if (button.classList.contains("decrease")) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + "; path=/";
    renderCart();
  });
});
  renderFooter(total, itemCount);
}

function renderFooter(total, itemCount) {
  const footerWrapper = document.querySelector(".Cart_cartFooter__owP1q");
  footerWrapper.innerHTML = "";
  footerWrapper.style.display = "block";

  const footer = document.createElement("div");
  footer.className = "Cart_details__GrxzO";

  footer.innerHTML = `
    <div class="Cart_detail__9iko0">
      <div class="Cart_detailKey__bNTK_">
        <span>Subtotal</span>
        <span class="Cart_itemCount__FrJbS Cart_greyText__LM8q6">(${itemCount} items)</span>
      </div>
      <div class="Cart_detailValue__JJpkB">
        <span>${total.toFixed(2)} €</span>
      </div>
    </div>
    <div class="Cart_detail__9iko0">
      <div class="Cart_detailKey__bNTK_">Shipping</div>
      <div class="Cart_detailValue__JJpkB Cart_greyText__LM8q6">Free Standard Shipping</div>
    </div>
    <button type="button" class="CheckoutButton_checkoutButton__WVgGK Button_button__OFOdO Button_styled__xGVes">
      <span>Checkout</span>
      <span>${total.toFixed(2)} €</span>
    </button>
  `;

  footerWrapper.appendChild(footer);
  const checkoutButton = footer.querySelector(".CheckoutButton_checkoutButton__WVgGK");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      window.location.href = "/checkout/";
    });
  }

  const countDisplay = document.querySelector(".Cart_cartCount__dchXe");
  countDisplay.textContent = `Cart (${itemCount})`;
}