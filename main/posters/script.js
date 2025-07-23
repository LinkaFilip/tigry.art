document.addEventListener("DOMContentLoaded", () => {
renderCart();
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
    };
    console.log("the product has been added to the cart");
    addToCart(product);
  });
});
});
function addToCart(product) {
  if (!product.id || !product.name || isNaN(product.price)) {
    console.warn("Neplatný produkt:", product);
    return; // 🛡️ Nepřidávat neplatné položky
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
  const cartPanel = document.querySelector(".Cart_cart__yGsQk");
  const panel = document.querySelector(".Cart_cartContent__TEVzy");
  const countDisplay = document.querySelector(".Cart_cartCount__dchXe");
  panel.innerHTML = "";
  const count = panel.childElementCount;
  countDisplay.textContent = `Cart (${count})`;


  cartPanel.classList.remove("Cart_open__Hlx3_");
  element.classList.remove("CartIndicator_closeBtn___fEN6");
  element.classList.add("CartIndicator_icon__AFivB");

  if (!element || !cartPanel || !panel) return;

    panel.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item")) {
        event.stopPropagation(); // 🛑 Zastaví šíření kliknutí nahoru
        event.preventDefault();  // 🛡 Pro jistotu, pokud by tam byl <a> nebo form

        const idToRemove = event.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== idToRemove);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
    });




  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");

  const crossPath = `<path stroke="currentColor" stroke-linejoin="round" d="M13 1L1 13M1 1l12 12"></path>`;
  const originalPath = `<path stroke="currentColor" stroke-width="1.5" d="M5.5 6.25v-2a3.5 3.5 0 1 1 7 0v2m-11.75.5h16.5v10.5H.75V6.75Z"></path>`;

  svg.innerHTML = originalPath;
  element.appendChild(svg);

  let showingCross = false;

  element.addEventListener('click', () => {
    // Toggle icon class
    if (element.classList.contains("CartIndicator_closeBtn___fEN6")) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
      svg.innerHTML = originalPath;
    } else {
      element.classList.replace("CartIndicator_icon__AFivB", "CartIndicator_closeBtn___fEN6");
      svg.innerHTML = crossPath;
    }

    // Toggle cart panel
    cartPanel.classList.toggle("Cart_open__Hlx3_");
    renderCart();

  });
});

function renderCart() {
  const panel = document.querySelector(".Cart_cartContent__TEVzy");
  panel.innerHTML = "";
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countDisplay = document.querySelector(".Cart_cartCount__dchXe");
  const count = document.querySelector(".Cart_cartContent__TEVzy").childElementCount;

  countDisplay.textContent = `Cart (${count})`;

  if (cart.length === 0) {
    panel.innerHTML = "<p>The cart is empty</p>";
    document.querySelector(".Cart_cartFooter__owP1q").style.display = "none";
    return;
  }


  let total = 0;

cart.forEach(item => {
  const price = parseFloat(item.price);
  const quantity = item.quantity || 1;

  if (isNaN(price)) return;

  const lineTotal = price * quantity;
  total += lineTotal;

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
            <span class="LineItem_totalPrice__KJ57U"><span class="LineItem_displayPrice__knr4Q"><strong>${lineTotal.toFixed(2)} €</strong></span></span>
        </div>
        <div class="LineItem_variantInfo__6LGBN"></div>
    </div>
    <div class="LineItem_productNotes__Jr2UI"><p>Colour: White speckle</p><p>Envelope: Semi-translucent</p></div>
    <span class="remove-item" data-id="${item.id}" style="cursor: pointer; color: #d00; text-decoration: underline; text-transform: uppercase; text-decoration-thickness: 1.5px;">Remove</span>
    </div>
</div>
  `;
  panel.appendChild(div);
});
const totalDiv = document.createElement("div");
totalDiv.className = "Cart_total";
totalDiv.innerHTML = `<hr><strong>Celkem: ${total.toFixed(2)} €</strong>`;
panel.appendChild(totalDiv);
renderFooter(total);


}

function renderFooter(total){
    const footer = document.createElement("div");
    footer.className = "Cart_details__GrxzO";
    footer.innerHTML = `
    <div class="Cart_detail__9iko0">
        <div class="Cart_detailKey__bNTK_">
        <span>Subtotal</span>
        <span class="Cart_itemCount__FrJbS Cart_greyText__LM8q6"> (1 items)</span>
        </div>
        <div class="Cart_detailValue__JJpkB">
        <span class="">
            <span>${total.toFixed(2)} €</span>
        </span>
        </div>
    </div>
    <div class="Cart_detail__9iko0">
        <div class="Cart_detailKey__bNTK_">Shipping</div>
        <div class="Cart_detailValue__JJpkB Cart_greyText__LM8q6">Free Standard Shipping</div>
    </div>
    </div>
    <button type="button" class="CheckoutButton_checkoutButton__WVgGK Button_button__OFOdO Button_styled__xGVes">
    <span>Checkout</span>
    <span>${total.toFixed(2)} €</span>
    </button>
    `
    const checkout = document.querySelector(".Cart_cartFooter__owP1q");
    checkout.innerHTML = "";
    checkout.appendChild(footer);
};
