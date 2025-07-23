document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".CartIndicator_icon__AFivB, .CartIndicator_closeBtn___fEN6");
  if (!element) return;

  element.addEventListener('click', () => {
    if (element.classList.contains("CartIndicator_closeBtn___fEN6")) {
      element.classList.replace("CartIndicator_closeBtn___fEN6", "CartIndicator_icon__AFivB");
    } else {
      element.classList.replace("CartIndicator_icon__AFivB", "CartIndicator_closeBtn___fEN6");
    }
  });
});
