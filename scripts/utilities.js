const utilities = (() => {
  const showGetStarted = () => {
    const getStarted = document.getElementById("get-started");

    getStarted.style.display =
      getStarted.style.display === ""
        ? (getStarted.style.display = "block")
        : (getStarted.style.display = "");
  };

  const showSidebar = () => {
    const sidebar = document.querySelector(".sidebar");

    console.log(sidebar.className);

    if (
      sidebar.className === "sidebar" ||
      sidebar.className === "sidebar slideout"
    ) {
      sidebar.className = "sidebar slidein";
    } else {
      sidebar.className = "sidebar slideout";
    }
  };

  if (document.getElementById("get-started") !== null) {
    document
      .querySelector(".mobile-menu")
      .addEventListener("click", showGetStarted);
  }

  if (document.querySelector(".sidebar") != null) {
    document
      .querySelector(".mobile-menu")
      .addEventListener("click", showSidebar);
  }
})();
