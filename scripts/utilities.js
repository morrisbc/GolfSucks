const utilities = (() => {
  const showGetStarted = e => {
    const getStarted = document.getElementById("get-started");

    getStarted.style.display =
      getStarted.style.display === ""
        ? (getStarted.style.display = "block")
        : (getStarted.style.display = "");
  };

  if (document.getElementById("get-started") !== null) {
    document
      .querySelector(".mobile-menu")
      .addEventListener("click", showGetStarted);
  }
})();
