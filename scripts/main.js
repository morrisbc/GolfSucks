function showNavMenu() {
  var btns = document.getElementsByClassName("account");

  for (let btn of btns) {
    if (btn.className === "account") {
      btn.className += " responsive";
    }
    else {
      btn.className = "account";
    }
  }
}