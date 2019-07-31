import { auth } from "./firebase-config.js";

const mobileMenu = document.querySelector(".mobile-menu");
const closeForm = document.getElementById("close-form");
const userForms = document.querySelector(".user-forms");
const getStarted = document.getElementById("get-started");
const signUpToggle = document.querySelector(".signup-toggle");
const loginToggle = document.querySelector(".login-toggle");
const signUpForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signUpSubmit = document.getElementById("signup-btn");
const loginSubmit = document.getElementById("login-btn");
const signUpError = document.querySelector(".signup-err");
const loginError = document.querySelector(".login-err");

const showGetStarted = () => {
  const getStarted = document.getElementById("get-started");

  getStarted.style.display =
    getStarted.style.display === ""
      ? (getStarted.style.display = "block")
      : (getStarted.style.display = "");
};

const signUp = e => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.replace("./dashboard.html");
    })
    .catch(err => {
      signUpError.innerHTML = `<p>${err.message}</p>`;

      setTimeout(() => {
        signUpError.innerHTML = "";
      }, 2500);
    });
};

const logIn = e => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.replace("./dashboard.html");
    })
    .catch(err => {
      loginError.innerHTML = `<p>${err.message}</p>`;

      setTimeout(() => {
        loginError.innerHTML = "";
      }, 2500);
    });
};

mobileMenu.addEventListener("click", showGetStarted);
getStarted.addEventListener("click", () => {
  userForms.style.display = "flex";
  showGetStarted();
});
closeForm.addEventListener("click", () => {
  userForms.style.display = "none";
});
signUpToggle.addEventListener("click", () => {
  signUpToggle.classList.add("active-toggle");
  loginToggle.classList.remove("active-toggle");
  signUpForm.style.display = "flex";
  loginForm.style.display = "none";
});
loginToggle.addEventListener("click", () => {
  loginToggle.classList.add("active-toggle");
  signUpToggle.classList.remove("active-toggle");
  loginForm.style.display = "flex";
  signUpForm.style.display = "none";
});
signUpSubmit.addEventListener("click", signUp);
loginSubmit.addEventListener("click", logIn);
