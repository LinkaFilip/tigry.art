document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".Header_cartIndicator__ti8f6, .CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
  if (!element) return;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");

  
  const crossPath = `<svg fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linejoin="round" d="M13 1L1 13M1 1l12 12"></path></svg>`;

  const originalPath = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <g clip-path="url(#a)">
                  <path stroke="currentColor" stroke-width="1.5" d="M5.5 6.25v-2a3.5 3.5 0 1 1 7 0v2m-11.75.5h16.5v10.5H.75V6.75Z"></path>
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h18v18H0z"></path>
                  </clipPath>
                </defs>
              </svg>`;

  let showingCross = false;

  svg.innerHTML = originalPath;
  element.appendChild(svg);

  element.addEventListener('click', () => {
    if (element.classList.contains("CartIndicator_closeBtn___fEN6")) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
      svg.innerHTML = originalPath;
      showingCross = false;
    } else {
      element.classList.replace("CartIndicator_icon__AFivB", "CartIndicator_closeBtn___fEN6");
      svg.innerHTML = crossPath;
      showingCross = true;
    }
  });
});