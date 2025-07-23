function addToCart(product) {
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
  panel.innerHTML = "";


  cartPanel.classList.remove("Cart_open__Hlx3_");
  element.classList.remove("CartIndicator_closeBtn___fEN6");
  element.classList.add("CartIndicator_icon__AFivB");

  if (!element || !cartPanel || !panel) return;

  panel.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item")) {
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

  if (cart.length === 0) {
    panel.innerHTML = "<p>Košík je prázdný.</p>";
    return;
  }


  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "Cart_item";

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${item.name}</strong><br>
          ${item.quantity} × ${item.price.toFixed(2)} € = <strong>${(item.price * item.quantity).toFixed(2)} €</strong>
        </div>
        <span class="remove-item" data-id="${item.id}" style="cursor: pointer; color: #d00; text-decoration: underline;">Remove item</span>
      </div>
    `;
    panel.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "Cart_total";
  totalDiv.innerHTML = `<hr><strong>Celkem: ${total.toFixed(2)} €</strong>`;
  panel.appendChild(totalDiv);

}
