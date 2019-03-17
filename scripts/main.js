function showNavMenu() {
  let btns = document.getElementsByClassName("account");

  for (let btn of btns) {
    if (btn.className === "account") {
      btn.className += " responsive";
    } else {
      btn.className = "account";
    }
  }
}

// Get the navigation menu options from the dashboard
var navOptions = document.querySelectorAll(".nav-elem");
navOptions.forEach(function(option) {
  option.addEventListener("click", highlightCurrent);
});

// Highlight the currently selected menu item from the
// dashboard navigation menu
function highlightCurrent(e) {
  let current;

  if (e.target.classList.contains("nav-elem")) {
    e.target.className += " nav-elem-current";
    current = e.target;
  } else if (e.target.parentElement.classList.contains("nav-elem")) {
    e.target.parentElement.className += " nav-elem-current";
    current = e.target.parentElement;
  }

  for (let option of navOptions) {
    if (option !== current && option.classList.contains("nav-elem-current")) {
      option.classList.remove("nav-elem-current");
      break;
    }
  }
}
