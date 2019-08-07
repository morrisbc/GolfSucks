import { auth } from "./firebase-config.js";

// Practice form elements
const practiceForm = document.querySelector(".practice-form");
const practiceStart = document.getElementById("time-start");
const practiceEnd = document.getElementById("time-end");
const fullSwing = document.querySelectorAll("#type-range div input");
const shortGame = document.querySelectorAll("#type-green div input");
const notes = document.getElementById("practice-notes");
const addPractice = document.getElementById("add-practice");
const editPractice = document.getElementById("edit-practice");
const cancelEditPractice = document.getElementById("cancel-edit-practice");

// Private practice session object member
const practiceSession = {
  startTime: null,
  endTime: null,
  fullSwing: {
    driver: false,
    woodsHybrids: false,
    longIrons: false,
    shortIrons: false,
    wedges: false
  },
  shortGame: {
    pitching: false,
    chipping: false,
    putting: false
  },
  notes: "",
  user: ""
};

/**
 * Populates the practice form with the information from a given practice
 * session.
 *
 * @param {Object} newPractice The practice session used to populate the
 *                             form
 */
export const updatePracticeUI = () => {
  practiceStart.value = practiceSession.startTime || "";
  practiceEnd.value = practiceSession.endTime || "";

  fullSwing.forEach(formField => {
    formField.checked = practiceSession.fullSwing[formField.name];
    formField.value = practiceSession.fullSwing[formField.name];
  });

  shortGame.forEach(formField => {
    formField.checked = practiceSession.shortGame[formField.name];
    formField.value = practiceSession.shortGame[formField.name];
  });

  notes.value = practiceSession.notes;
};

/**
 * Clears the practice form UI and reinitializes the practice session member
 * object.
 */
export const clearPracticeForm = () => {
  practiceSession.startTime = null;
  practiceSession.endTime = null;
  fullSwing.forEach(clubType => {
    practiceSession.fullSwing[clubType.name] = false;
  });
  shortGame.forEach(clubType => {
    practiceSession.shortGame[clubType.name] = false;
  });
  practiceSession.notes = "";

  practiceForm.reset();
};

/**
 * Checks the practice form element values for validity and returns a boolean
 * based on the results.
 *
 * @return A boolean determining the validity of the practice session
 */
const practiceIsValid = () => {
  let startIsBeforeEnd = true;
  let datesNotInFuture = true;
  let atLeastOneCheck = false;

  if (practiceStart.value !== "" && practiceEnd.value !== "") {
    startIsBeforeEnd = practiceStart.value < practiceEnd.value;
  }

  if (practiceStart.value !== "") {
    datesNotInFuture =
      datesNotInFuture && Date.now() >= Date.parse(practiceStart.value);
  }

  if (practiceEnd.value !== "") {
    datesNotInFuture =
      datesNotInFuture && Date.now() >= Date.parse(practiceEnd.value);
  }

  fullSwing.forEach(checkbox => {
    atLeastOneCheck = atLeastOneCheck || checkbox.checked;
  });

  if (!atLeastOneCheck) {
    shortGame.forEach(checkbox => {
      atLeastOneCheck = atLeastOneCheck || checkbox.checked;
    });
  }

  return startIsBeforeEnd && datesNotInFuture && atLeastOneCheck;
};

/**
 * Returns a practice session object or null if the practice form contains
 * invalid data.
 *
 * @return The practice session object or null if it is invalid
 */
export const getPractice = () => {
  if (practiceIsValid()) {
    practiceSession.startTime = practiceStart.value;
    practiceSession.endTime = practiceEnd.value;
    fullSwing.forEach(clubType => {
      practiceSession.fullSwing[clubType.name] = clubType.checked;
    });
    shortGame.forEach(clubType => {
      practiceSession.shortGame[clubType.name] = clubType.checked;
    });
    practiceSession.notes = notes.value;
    practiceSession.user = auth.currentUser.uid;

    return practiceSession;
  } else {
    return null;
  }
};

/**
 * Updates the fields of the practice object with those of the provided new
 * practice object.
 *
 * @param {Object} newPractice The new practice object whose fields will be
 *                              used to update the practice object
 */
export const setPractice = newPractice => {
  for (let key in practiceSession) {
    practiceSession[key] = newPractice[key];
  }
};

/**
 * Displays the add practice button in the practice form.
 */
export const showAddPractice = () => {
  addPractice.style.display = "flex";
};

/**
 * Displays the edit practice and cancel edit buttons in the practice form.
 */
export const showEditPracticeButtons = () => {
  editPractice.style.display = "flex";
  cancelEditPractice.style.display = "flex";
};

/**
 * Hides the add practice button in the practice form.
 */
export const hideAddPractice = () => {
  addPractice.style.display = "none";
};

/**
 * Hides the edit practice and cancel edit buttons in the practice form.
 */
export const hideEditPracticeButtons = () => {
  editPractice.style.display = "none";
  cancelEditPractice.style.display = "none";
};
