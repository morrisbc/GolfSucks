const utilities = (() => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeForm = document.getElementById("close-form");
  const userForms = document.querySelector(".user-forms");
  const getStarted = document.getElementById("get-started");
  const signUpSubmit = document.getElementById("signup-btn");
  const logInSubmit = document.getElementById("login-btn");

  const showGetStarted = () => {
    const getStarted = document.getElementById("get-started");

    getStarted.style.display =
      getStarted.style.display === ""
        ? (getStarted.style.display = "block")
        : (getStarted.style.display = "");
  };

  mobileMenu.addEventListener("click", showGetStarted);
  getStarted.addEventListener("click", () => {
    userForms.style.display = "flex";
    showGetStarted();
  });
  closeForm.addEventListener("click", () => {
    userForms.style.display = "none";
  });
})();
