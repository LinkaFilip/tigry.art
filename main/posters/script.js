var elementIsClicked = false; // declare the variable that tracks the state
var element = document.querySelector(".CartIndicator_icon__AFivB");
element.addEventListener('click', clickHandler);

function clickHandler() {
  element.classList.toggle(".CartIndicator_closeBtn___fEN6");
}