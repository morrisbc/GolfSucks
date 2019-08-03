import { auth, db } from "./firebase-config.js";
import {
  getPractice,
  populatePracticeSession,
  clearPracticeForm,
  showEditButton,
  showAddButton
} from "./practice.js";
import { clearScorecard, getScorecard } from "./scorecard.js";
import { showAlert } from "./utilities.js";

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
  try {
    db.collection("scorecards")
      .add(scorecard)
      .then(() => {
        clearScorecard();
        showAlert("#add-scorecard", "alert-success", "Scorecard Added!");
      });
  } catch (err) {
    showAlert(
      "#add-scorecard",
      "alert-danger",
      "Please submit a valid scorecard."
    );
  }
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
                const lowestIn = promises[0].docs[0].data().in;
                const lowestOut = promises[1].docs[0].data().out;
                const lowestScore = promises[2].docs[0].data().total;

                db.collection("trophies")
                  .doc(trophiesDoc.id)
                  .update({
                    scorecardsPosted: snapshot.size,
                    lowestNine: Math.min(lowestIn, lowestOut),
                    lowestEighteen: lowestScore,
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

  // // Update the lowest 9 trophy
  // const scorecard = getScorecard();
  // if (scorecard.out > 0) {
  //   if (trophies.lowest9 === 0) {
  //     trophies.lowest9 = scorecard.out;
  //   } else {
  //     trophies.lowest9 = Math.min(trophies.lowest9, scorecard.out);
  //   }
  // }

  // if (scorecard.in > 0) {
  //   if (trophies.lowest9 === 0) {
  //     trophies.lowest9 = scorecard.in;
  //   } else {
  //     trophies.lowest9 = Math.min(trophies.lowest9, scorecard.in);
  //   }
  // }

  // // Update the lowest 18 trophy
  // if (scorecard.out > 0 && scorecard.in > 0) {
  //   trophies.lowest18 =
  //     trophies.lowest18 === 0
  //       ? scorecard.total
  //       : Math.min(trophies.lowest18, scorecard.total);
  // }
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
        showAlert("#add-practice", "alert-success", "Practice session added!");
      });
  } catch (err) {
    showAlert(
      "#add-practice",
      "alert-danger",
      "Please submit a valid practice session."
    );
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
