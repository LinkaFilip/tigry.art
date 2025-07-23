document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
  if (!element) return;

  // Vytvoříme SVG jako DOM element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.innerHTML = `<path d="M3 12h18M12 3v18" stroke="currentColor" stroke-width="2" fill="none"/>`; // jednoduché plusko

  let svgInserted = false;

  element.addEventListener('click', () => {
    // Přepínání tříd
    if (element.classList.contains("CartIndicator_closeBtn___fEN6")) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
      if (svgInserted) {
        element.removeChild(svg);
        svgInserted = false;
      }
    } else {
      element.classList.replace("CartIndicator_icon__AFivB", "CartIndicator_closeBtn___fEN6");
      if (!svgInserted) {
        element.appendChild(svg);
        svgInserted = true;
      }
    }
  });
});
