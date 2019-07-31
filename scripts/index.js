import { auth } from "./firebase-config.js";
import {
  getPractice,
  populatePracticeSession,
  clearPracticeForm,
  showEditButton,
  showAddButton
} from "./practice.js";
import { clearScorecard, getScorecard } from "./scorecard.js";
import { showAlert } from "./utilities.js";
//const storageMod = storage;

// let scorecards = storageMod.getScorecardsFromStorage();
// let trophies = storageMod.getTrophiesFromStorage();
// let practices = storageMod.getPracticesFromStorage();

// Max id for practices to avoid duplicate ids and multiple delete
// and edit operations
// let maxPracticeId = -1;
// practices.forEach(practice => {
//   if (practice.id > maxPracticeId) {
//     maxPracticeId = practice.id;
//   }
// });

// Max id for scorecards to avoid duplicate ids and multiple delete
// and edit operations
// let maxScorecardId = -1;
// scorecards.forEach(scorecard => {
//   if (scorecard.id > maxScorecardId) {
//     maxScorecardId = scorecard.id;
//   }
// });

let activeMenu = document.querySelector(".scorecards");
let activeMenuLink = document.getElementById("scorecards-link");
const scorecardsUI = document.querySelector(".old-scorecards");
const trophiesUI = document.querySelector(".trophies");
const practicesUI = document.querySelector(".practice-sessions");

/**
 * Adds a new scorecard to the application, saving the new scorecard
 * to storage, and updating the UI.
 *
 * @param {Event} e Event to prevent default behavior of submit
 */
const addScorecard = e => {
  e.preventDefault();

  const scorecard = getScorecard();
  if (scorecard) {
    scorecard.id = ++maxScorecardId;
    // storageMod.addScorecardToStorage(scorecard);
    // scorecards = storageMod.getScorecardsFromStorage();
    //updateScorecardsUI();
    updateTrophies();
    clearScorecard();
    showAlert("#add-scorecard", "alert-success", "Scorecard Added!");
  } else {
    showAlert(
      "#add-scorecard",
      "alert-danger",
      "Please submit a valid scorecard."
    );
  }
};

/**
 * Updates the scorecards UI
 */
export const updateScorecardsUI = snapshot => {
  scorecardsUI.innerHTML = "";
  if (snapshot.size > 0) {
    snapshot.forEach(doc => {
      const scorecard = doc.data();

      // Create the new scorecard element
      let newScorecard = document.createElement("div");
      newScorecard.className = "old-scorecard";
      newScorecard.id = `scorecard-${doc.id}`;
      newScorecard.appendChild(
        document.createTextNode(JSON.stringify(scorecard))
      );

      // Create the div for the edit and delete buttons
      let options = document.createElement("div");
      options.className = "item-options";

      // Create the edit button and add it to the options div
      let editButton = document.createElement("button");
      editButton.className = "edit-item";
      editButton.innerHTML = "<i class='fas fa-pencil-alt'></i>";
      options.appendChild(editButton);

      // Create the delete button and add it to the options div
      let deleteButton = document.createElement("button");
      deleteButton.className = "delete-item";
      deleteButton.innerHTML = "<i class='fas fa-times'></i>";
      options.appendChild(deleteButton);

      // Add the options div to the scorecard element
      newScorecard.appendChild(options);

      // Add the new scorecard to the UI
      scorecardsUI.prepend(newScorecard);

      // Add the event listeners for the options buttons now that they
      // are in the DOM
      editButton.addEventListener("click", editScorecard);
      deleteButton.addEventListener("click", deleteScorecard);
    });
  } else {
    scorecardsUI.innerHTML += "Time to hit the course!";
  }
};

const editScorecard = () => {};

/**
 * Removes a scorecard from the application.
 *
 * @param {Event} e Event used to target the practice session to delete
 */
const deleteScorecard = e => {};

/**
 * Updates the trophies in the application and writes them to storage.
 */
const updateTrophies = () => {
  // Update scorecards posted trophy
  trophies.scorecardsPosted = scorecards.length;

  // Update the lowest 9 trophy
  const scorecard = getScorecard();
  if (scorecard.out > 0) {
    if (trophies.lowest9 === 0) {
      trophies.lowest9 = scorecard.out;
    } else {
      trophies.lowest9 = Math.min(trophies.lowest9, scorecard.out);
    }
  }

  if (scorecard.in > 0) {
    if (trophies.lowest9 === 0) {
      trophies.lowest9 = scorecard.in;
    } else {
      trophies.lowest9 = Math.min(trophies.lowest9, scorecard.in);
    }
  }

  // Update the lowest 18 trophy
  if (scorecard.out > 0 && scorecard.in > 0) {
    trophies.lowest18 =
      trophies.lowest18 === 0
        ? scorecard.total
        : Math.min(trophies.lowest18, scorecard.total);
  }

  // Update practices posted trophy
  trophies.practicesPosted = practices.length;

  // Store the new trophy values back in storage
  // storageMod.addTrophiesToStorage(trophies);
};

/**
 * Updates the UI for the trophies section of the application.
 */
export const updateTrophiesUI = snapshot => {
  let trophies;

  snapshot.forEach(doc => {
    trophies = doc.data();
  });

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
 * Adds a new practice session to the application. Adds the session to local
 * storage, updates the practices and trophy UI's, and clears the practice
 * form fields.
 *
 * @param {Event} e Event used to prevent default behavior of submit.
 */
const addPractice = e => {
  e.preventDefault();
  const practiceSession = getPractice();

  if (practiceSession !== null) {
    practiceSession.id = ++maxPracticeId;
    // storageMod.addPracticeToStorage(practiceSession);
    // practices = storageMod.getPracticesFromStorage();
    //updatePracticesUI();
    updateTrophies();
    clearPracticeForm();
    showAlert("#add-practice", "alert-success", "Practice session added!");
  } else {
    showAlert(
      "#add-practice",
      "alert-danger",
      "Please submit a valid practice session."
    );
  }
};

/**
 * Updates the list of practice sessions in the UI.
 */
export const updatePracticesUI = snapshot => {
  snapshot.forEach(doc => {
    const practiceSession = doc.data();

    if (snapshot.size > 0) {
      // Create the new practice session element
      let newPractice = document.createElement("div");
      newPractice.className = "practice-session";
      newPractice.id = `practice-${doc.id}`;
      newPractice.appendChild(
        document.createTextNode(JSON.stringify(practiceSession))
      );

      // Create the div for the edit and delete buttons
      let options = document.createElement("div");
      options.className = "item-options";

      // Create the edit button and add it to the options div
      let editButton = document.createElement("button");
      editButton.className = "edit-item";
      editButton.innerHTML = "<i class='fas fa-pencil-alt'></i>";
      options.appendChild(editButton);

      // Create the delete button and add it to the options div
      let deleteButton = document.createElement("button");
      deleteButton.className = "delete-item";
      deleteButton.innerHTML = "<i class='fas fa-times'></i>";
      options.appendChild(deleteButton);

      // Add the options div to the practice session element
      newPractice.appendChild(options);

      // Add the new practice session to the UI
      practicesUI.prepend(newPractice);

      // Add the event listeners for the options buttons now that they
      // are in the DOM
      editButton.addEventListener("click", editPracticeSession);
      deleteButton.addEventListener("click", deletePracticeSession);
    } else {
      practicesUI.innerHTML += "Practice makes perfect!";
    }
  });
};

/**
 *
 * @param {Event} e Event used to target the practice session to edit
 */
const editPracticeSession = e => {};

/**
 *
 *
 * @param {Event} e Event used to avoid form submission default behavior
 */
const confirmPracticeEdit = e => {
  e.preventDefault();
};

/**
 * Gets the practice session that was clicked for delete and removes
 * it from the application.
 *
 * @param {Event} e Event used to target the practice session to delete
 */
const deletePracticeSession = e => {};

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
  } else {
    newMenu.style.display = "flex";
  }
  newMenuLink.className = "sidebar-link active-menu";

  activeMenu = newMenu;
  activeMenuLink = newMenuLink;

  toggleSidebar();
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
document
  .getElementById("add-scorecard")
  .addEventListener("click", addScorecard);
document.querySelectorAll(".sidebar-link").forEach(link => {
  if (!link.classList.contains("logout")) {
    link.addEventListener("click", changeMenu);
  }
});
document.getElementById("add-practice").addEventListener("click", addPractice);
document
  .getElementById("edit-practice")
  .addEventListener("click", confirmPracticeEdit);
document.querySelector(".mobile-menu").addEventListener("click", toggleSidebar);
document.querySelector(".logout").addEventListener("click", () => {
  auth.signOut();
  window.location.replace("./index.html");
});
