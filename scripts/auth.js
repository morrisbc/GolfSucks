import {
  updateScorecardsUI,
  updateTrophiesUI,
  updatePracticesUI
} from "./index.js";
import { auth, db } from "./firebase-config.js";

// Check to see if the user is on the appropriate page based on
// their login status
auth.onAuthStateChanged(user => {
  if (user) {
    // If logged in make sure the user is at the dashboard page
    if (!window.location.href.endsWith("dashboard.html")) {
      window.location.href = "./dashboard.html";
    }

    // Update the UI with the users information from firestore
    db.collection("scorecards")
      .where("user", "==", user.uid)
      .onSnapshot(snapshot => {
        updateScorecardsUI(snapshot);
      });
    db.collection("trophies")
      .where("user", "==", user.uid)
      .onSnapshot(snapshot => {
        updateTrophiesUI(snapshot);
      });
    db.collection("practiceSessions")
      .where("user", "==", user.uid)
      .onSnapshot(snapshot => {
        updatePracticesUI(snapshot);
      });
  } else {
    // If not logged in make sure the user is at the landing page
    if (!window.location.href.endsWith("index.html")) {
      window.location.href = "./index.html";
    }
  }
});
