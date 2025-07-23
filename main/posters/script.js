var elementIsClicked = false; // declare the variable that tracks the state
document.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".CartIndicator_icon__AFivB");
  if (element) {
    element.addEventListener('click', clickHandler);
  }
});

function clickHandler() {
  this.classList.toggle("CartIndicator_closeBtn___fEN6");
}