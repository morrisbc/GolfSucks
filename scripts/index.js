const app = (() => {
  const scorecardMod = newScorecard;
  const storageMod = storage;

  let scorecards = storageMod.getScorecardsFromStorage();
  let trophies = storageMod.getTrophiesFromStorage();

  let activeMenu = document.querySelector(".scorecards");
  let activeMenuLink = document.getElementById("scorecards-link");
  const scorecardsUI = document.querySelector(".old-scorecards");
  const trophiesUI = document.querySelector(".trophies");

  /**
   * Adds a new scorecard to the application, saving the new scorecard
   * to storage, and updating the UI.
   *
   * @param {Event} e Event to prevent default behavior of submit
   */
  const addScorecard = e => {
    e.preventDefault();

    if (scorecardMod.scorecard.isValid) {
      storageMod.addScorecardToStorage(scorecardMod.scorecard);
      scorecards = storageMod.getScorecardsFromStorage();
      showAlert(".new-scorecard", "alert-success", "Scorecard Added!");
      updateScorecardsUI();
      updateTrophies();
      scorecardMod.clearScorecard();
    } else {
      showAlert(
        ".new-scorecard",
        "alert-danger",
        "Please submit a valid scorecard."
      );
    }
  };

  /**
   * Updates the scorecards UI
   */
  const updateScorecardsUI = () => {
    scorecardsUI.innerHTML = "";
    if (scorecards.length !== 0) {
      scorecards.forEach(scorecard => {
        scorecardsUI.innerHTML += `
        <div class="old-scorecard">
          ${JSON.stringify(scorecard)}
        </div>
        `;
      });
    } else {
      scorecardsUI.innerText = "Time to hit the course!";
    }
  };

  /**
   * Updates the trophies in the application and writes them to storage.
   */
  const updateTrophies = () => {
    // Update rounds posted trophy
    trophies.scorecardsPosted = scorecards.length;

    // Update the lowest 9 trophy
    if (scorecardMod.scorecard.out > 0) {
      if (trophies.lowest9 === 0) {
        trophies.lowest9 = scorecardMod.scorecard.out;
      } else {
        trophies.lowest9 = Math.min(
          trophies.lowest9,
          scorecardMod.scorecard.out
        );
      }
    }

    if (scorecardMod.scorecard.in > 0) {
      if (trophies.lowest9 === 0) {
        trophies.lowest9 = scorecardMod.scorecard.in;
      } else {
        trophies.lowest9 = Math.min(
          trophies.lowest9,
          scorecardMod.scorecard.in
        );
      }
    }

    // Update the lowest 18 trophy
    if (scorecardMod.scorecard.out > 0 && scorecardMod.scorecard.in > 0) {
      trophies.lowest18 =
        trophies.lowest18 === 0
          ? scorecardMod.scorecard.total
          : Math.min(trophies.lowest18, scorecardMod.scorecard.total);
    }

    // Store the new trophy values back in storage
    storageMod.addTrophiesToStorage(trophies);
  };

  /**
   * Updates the UI for the trophies section of the application.
   */
  const updateTrophiesUI = () => {
    for (let trophy of trophiesUI.children) {
      // Convert the hyphen-separated data attribute to camelCase
      let trophyName = trophy.dataset.trophyName.replace(/-[a-z0-9]/, i =>
        i[1].toUpperCase()
      );
      // Set the text content of the badge element inside the trophy
      trophy.firstElementChild.textContent = trophies[trophyName] || "-";
    }
  };

  /**
   * Displays an alert before the scorecards section of the application.
   *
   * @param {String} elemSelector The selector of the UI element to insert the
   *                              alert after
   * @param {String} modifier The type of the alert affecting styling
   * @param {String} message The content of the alert
   */
  const showAlert = (elemSelector, modifier, message) => {
    const elemUI = document.querySelector(`${elemSelector}`);

    if (document.querySelector(`.alert.${modifier}`) === null) {
      const newAlert = document.createElement("div");
      newAlert.className = `alert ${modifier}`;

      const alertText = document.createTextNode(message);
      newAlert.appendChild(alertText);

      elemUI.append(newAlert);

      setTimeout(() => {
        elemUI.removeChild(newAlert);
      }, 2500);
    }
  };

  /**
   * Changes the active menu of the application.
   *
   * @param {Event} e Used to determine the selected sidebar option
   */
  const changeMenu = e => {
    const newMenu = document.querySelector(
      `.${e.target.innerText.toLowerCase()}`
    );
    const newMenuLink = e.target;

    activeMenu.style.display = "none";
    activeMenuLink.className = "sidebar-link";

    if (newMenuLink.innerText.toLowerCase() === "trophies") {
      newMenu.style.display = "grid";
      updateTrophiesUI();
    } else {
      newMenu.style.display = "flex";
    }
    newMenuLink.className = "sidebar-link active-menu";

    activeMenu = newMenu;
    activeMenuLink = newMenuLink;
  };

  /**
   * Toggles the visibility of the sidebar menu on mobile.
   */
  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");

    if (
      sidebar.className === "sidebar" ||
      sidebar.className === "sidebar slideout"
    ) {
      sidebar.className = "sidebar slidein";
    } else {
      sidebar.className = "sidebar slideout";
    }
  };

  // Add event listeners
  document.addEventListener("DOMContentLoaded", updateScorecardsUI);
  document
    .getElementById("add-scorecard")
    .addEventListener("click", addScorecard);
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", changeMenu);
  });
  document
    .querySelector(".mobile-menu")
    .addEventListener("click", toggleSidebar);
})();
