import { auth, db } from "./firebase-config.js";
import {
  getPractice,
  populatePracticeSession,
  clearPracticeForm,
  showEditButton,
  showAddButton
} from "./practice.js";
import {
  clearScorecard,
  getScorecard,
  setScorecard,
  updateScorecardUI,
  showEditScorecardButtons,
  hideEditScorecardButtons,
  showAddScorecard,
  hideAddScorecard
} from "./scorecard.js";
import { showAlert } from "./utilities.js";

let activeMenu = document.querySelector(".scorecards");
let activeMenuLink = document.getElementById("scorecards-link");
const scorecardsUI = document.querySelector(".old-scorecards");
const trophiesUI = document.querySelector(".trophies");
const practicesUI = document.querySelector(".practice-sessions");

let scorecardToEdit = null;
let practiceToEdit = null;

/**
 * Adds a new scorecard to the application, saving the new scorecard
 * to storage, and updating the UI.
 *
 * @param {Event} e Event to prevent default behavior of submit
 */
const addScorecard = e => {
  e.preventDefault();

  const scorecard = getScorecard();
  try {
    db.collection("scorecards")
      .add(scorecard)
      .then(() => {
        clearScorecard();
        showAlert(".buttons", "alert-success", "Scorecard Added!");
      });
  } catch (err) {
    showAlert(".buttons", "alert-danger", "Please submit a valid scorecard.");
  }
};

/**
 * Deletes a scorecard from the application.
 */
const deleteScorecard = e => {
  let scorecardUID;

  // The target was the icon rather than the button
  if (e.target.classList.contains("fa-times")) {
    scorecardUID =
      e.target.parentElement.parentElement.parentElement.dataset.uid;
  } else {
    scorecardUID = e.target.parentElement.parentElement.dataset.uid;
  }

  if (confirm("Are you sure you want to delete this scorecard?")) {
    db.collection("scorecards")
      .doc(scorecardUID)
      .delete()
      .then(() => {
        showAlert(".buttons", "alert-success", "Scorecard Deleted!");
      })
      .catch(() => {
        showAlert(".buttons", "alert-danger", "Unable to delete scorecard.");
      });
  }
};

/**
 * Edits a scorecard in the application and stores the new values in the
 * firestore.
 *
 * @param {Event} e Used to prevent default behavior of submit
 */
const editScorecard = e => {
  e.preventDefault();

  try {
    db.collection("scorecards")
      .doc(scorecardToEdit)
      .set(getScorecard())
      .then(() => {
        clearScorecard();
        updateScorecardUI();
        hideEditScorecardButtons();
        showAddScorecard();
        showAlert(".buttons", "alert-success", "Scorecard Edited!");
      });
  } catch (err) {
    showAlert(".buttons", "alert-danger", "Unable to update scorecard.");
  }
};

/**
 * Displays the necessary buttons and populates the form fields with the data
 * from the scorecard to edit.
 */
const showEditScorecardState = e => {
  let scorecardUID;

  // The target was the icon rather than the button
  if (e.target.classList.contains("fa-pencil-alt")) {
    scorecardUID =
      e.target.parentElement.parentElement.parentElement.dataset.uid;
  } else {
    scorecardUID = e.target.parentElement.parentElement.dataset.uid;
  }

  db.collection("scorecards")
    .doc(scorecardUID)
    .get()
    .then(doc => {
      scorecardToEdit = scorecardUID;
      setScorecard(doc.data());
      updateScorecardUI();
      showEditScorecardButtons();
      hideAddScorecard();
    });
};

/**
 * Hides the necessary buttons and clears the fields of the scorecard form.
 *
 * @param {Event} e Used to prevent default behavior
 */
const hideEditState = e => {
  e.preventDefault();

  clearScorecard();
  updateScorecardUI();
  hideEditScorecardButtons();
  showAddScorecard();
};

/**
 * Updates the scorecards UI.
 *
 * @param snapshot The collection snapshot from the firestore database
 *                 containing the most recent scorecards
 */
export const updateScorecardsUI = snapshot => {
  scorecardsUI.innerHTML = "";
  if (snapshot.size > 0) {
    snapshot.forEach(doc => {
      const scorecard = doc.data();

      // Create the new scorecard element
      let newScorecard = document.createElement("div");
      newScorecard.className = "old-scorecard";
      newScorecard.dataset.uid = doc.id;
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

      editButton.addEventListener("click", showEditScorecardState);
      deleteButton.addEventListener("click", deleteScorecard);

      // Add the options div to the scorecard element
      newScorecard.appendChild(options);

      // Add the new scorecard to the UI
      scorecardsUI.prepend(newScorecard);
    });
  } else {
    scorecardsUI.innerHTML += "Time to hit the course!";
  }
};

/**
 * Updates the trophies in the application and writes them to the firestore
 * database.
 *
 * @param user The current user
 * @param snapshot The collection snapshot used to update applicable trophies
 * @param collectionName The name of the collection the snapshot is from
 */
export const updateTrophies = (user, snapshot, collectionName) => {
  db.collection("trophies")
    .where("user", "==", user.uid)
    .get()
    .then(trophySnapshot => {
      let trophiesDoc = trophySnapshot.docs[0];

      // User hasn't had a trophy document created yet. Initialize one
      // and update it.
      if (!trophiesDoc) {
        switch (collectionName) {
          case "scorecards":
            db.collection("trophies").add({
              scorecardsPosted: snapshot.size,
              practicesPosted: 0,
              lowestEighteen: 0,
              lowestNine: 0,
              user: user.uid
            });
            break;
          case "practiceSessions":
            db.collection("trophies").add({
              scorecardsPosted: 0,
              practicesPosted: snapshot.size,
              lowestEighteen: 0,
              lowestNine: 0,
              user: user.uid
            });
            break;
          default:
          // Do Nothing
        }
      } else {
        if (collectionName === "scorecards") {
          if (snapshot.size) {
            Promise.all([
              db
                .collection("scorecards")
                .where("user", "==", user.uid)
                .where("in", ">", 0)
                .orderBy("in")
                .limit(1)
                .get(),
              db
                .collection("scorecards")
                .where("user", "==", user.uid)
                .where("out", ">", 0)
                .orderBy("out")
                .limit(1)
                .get(),
              db
                .collection("scorecards")
                .where("user", "==", user.uid)
                .where("nineHoles", "==", false)
                .orderBy("total")
                .limit(1)
                .get()
            ])
              .then(promises => {
                // lowestIn and lowestOut have default MAX_VALUE values since
                // they are compared later using Math.min as a default of 0
                // will cause the lowestNine trophy to always be 0
                let lowestIn = Number.MAX_VALUE;
                let lowestOut = Number.MAX_VALUE;
                let lowestEighteen = 0;

                if (promises[0].docs[0]) {
                  lowestIn = promises[0].docs[0].data().in;
                }
                if (promises[1].docs[0]) {
                  lowestOut = promises[1].docs[0].data().out;
                }
                if (promises[2].docs[0]) {
                  lowestEighteen = promises[2].docs[0].data().total;
                }

                db.collection("trophies")
                  .doc(trophiesDoc.id)
                  .update({
                    scorecardsPosted: snapshot.size,
                    lowestNine: Math.min(lowestIn, lowestOut),
                    lowestEighteen: lowestEighteen,
                    user: user.uid
                  });
              })
              .catch(err => console.log(err.message));
          } else {
            db.collection("trophies")
              .doc(trophiesDoc.id)
              .update({
                scorecardsPosted: 0,
                lowestNine: 0,
                lowestEighteen: 0,
                user: user.uid
              });
          }
        }

        if (collectionName === "practiceSessions") {
          db.collection("trophies")
            .doc(trophiesDoc.id)
            .update({
              practicesPosted: snapshot.size,
              user: user.uid
            })
            .catch(err => console.log(err.message));
        }
      }
    });
};

/**
 * Updates the UI for the trophies section of the application.
 *
 * @param snapshot The collection snapshot containing the most up to date
 *                 firestore database values
 */
export const updateTrophiesUI = snapshot => {
  let trophies = {};

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

  try {
    db.collection("practiceSessions")
      .add(practiceSession)
      .then(() => {
        clearPracticeForm();
        showAlert(".buttons", "alert-success", "Practice session added!");
      });
  } catch (err) {
    showAlert(
      ".buttons",
      "alert-danger",
      "Please submit a valid practice session."
    );
  }
};

const deletePractice = e => {
  let practiceUID;

  // The target was the icon rather than the button
  if (e.target.classList.contains("fa-times")) {
    practiceUID =
      e.target.parentElement.parentElement.parentElement.dataset.uid;
  } else {
    practiceUID = e.target.parentElement.parentElement.dataset.uid;
  }

  if (confirm("Are you sure you want to delete this practice session?")) {
    db.collection("practiceSessions")
      .doc(practiceUID)
      .delete()
      .then(() => {
        showAlert(".buttons", "alert-success", "Practice Session Deleted!");
      })
      .catch(() => {
        showAlert(
          ".buttons",
          "alert-danger",
          "Unable to delete practice session."
        );
      });
  }
};

/**
 * Updates the list of practice sessions in the UI.
 *
 * @param snapshot The collection snapshot from the firestore database
 *                 containing the most up to date practice sessions
 */
export const updatePracticesUI = snapshot => {
  practicesUI.innerHTML = "";
  if (snapshot.size > 0) {
    snapshot.forEach(doc => {
      const practiceSession = doc.data();

      // Create the new practice session element
      let newPractice = document.createElement("div");
      newPractice.className = "practice-session";
      newPractice.dataset.uid = doc.id;
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

      deleteButton.addEventListener("click", deletePractice);

      // Add the options div to the practice session element
      newPractice.appendChild(options);

      // Add the new practice session to the UI
      practicesUI.prepend(newPractice);
    });
  } else {
    practicesUI.innerHTML += "Practice makes perfect!";
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
if (window.location.href.endsWith("dashboard.html")) {
  document
    .getElementById("add-scorecard")
    .addEventListener("click", addScorecard);
  document
    .getElementById("edit-scorecard")
    .addEventListener("click", editScorecard);
  document
    .getElementById("cancel-edit-scorecard")
    .addEventListener("click", hideEditState);
  document.querySelectorAll(".sidebar-link").forEach(link => {
    if (!link.classList.contains("logout")) {
      link.addEventListener("click", changeMenu);
    }
  });
  document
    .getElementById("add-practice")
    .addEventListener("click", addPractice);
  document
    .querySelector(".mobile-menu")
    .addEventListener("click", toggleSidebar);
  document.querySelector(".logout").addEventListener("click", () => {
    auth.signOut();
    window.location.replace("./index.html");
  });
}
