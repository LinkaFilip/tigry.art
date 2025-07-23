document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
  const cartPanel = document.querySelector(".Cart_cart__yGsQk");
  cartPanel.classList.remove("Cart_open__Hlx3_");
  element.classList.remove("CartIndicator_closeBtn___fEN6");
  element.classList.add("CartIndicator_icon__AFivB");

  if (!element || !cartPanel) return;

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
  const panel = document.querySelector(".Cart_cartContainer__QEmUs");
  panel.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    panel.innerHTML = "<p>Košík je prázdný.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      ${item.quantity} × ${item.price.toFixed(2)} € = ${(item.quantity * item.price).toFixed(2)} €
    `;
    panel.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `<hr><strong>Celkem: ${total.toFixed(2)} €</strong>`;
  panel.appendChild(totalDiv);
}
