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
  svh-setAttribute("fill", "none");

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
  });
});