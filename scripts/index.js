const app = (() => {
  const scorecardMod = newScorecard;
  const storageMod = storage;

  let scorecards = storageMod.getScorecardsFromStorage();
  let trophies = storageMod.getTrophiesFromStorage();

  let activeMenu = document.querySelector(".scorecards");
  let activeMenuLink = document.getElementById("scorecards-link");
  const scorecardsUI = document.querySelector(".old-scorecards");
  const trophiesUI = document.querySelector(".trophies");

  const addScorecard = e => {
    e.preventDefault();

    if (scorecardMod.scorecard.isValid) {
      storageMod.addScorecardToStorage(scorecardMod.scorecard);
      scorecards = storageMod.getScorecardsFromStorage();
      showAlert("alert-success", "Scorecard Added!");
      scorecardMod.clearScorecard();
      updateScorecardsUI();
      updateTrophies();
    } else {
      showAlert("alert-danger", "Please submit a valid scorecard.");
    }
  };

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

  const updateTrophies = () => {
    trophies.roundsPlayed = scorecards.length;
    storageMod.addTrophiesToStorage(trophies);
  };

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

  const showAlert = (modifier, message) => {
    const scorecards = document.querySelector(".scorecards");

    if (document.querySelector(`.alert.${modifier}`) === null) {
      const newAlert = document.createElement("div");
      newAlert.className = `alert ${modifier}`;

      const alertText = document.createTextNode(message);
      newAlert.appendChild(alertText);

      scorecards.prepend(newAlert);

      setTimeout(() => {
        scorecards.removeChild(newAlert);
      }, 2500);
    }
  };

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

  // Add event listeners
  document.addEventListener("DOMContentLoaded", updateScorecardsUI);
  document
    .querySelector(".add-scorecard")
    .addEventListener("click", addScorecard);
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", changeMenu);
  });
})();
