// Practice form elements
const practiceForm = document.querySelector(".practice-form");
const practiceStart = document.getElementById("time-start");
const practiceEnd = document.getElementById("time-end");
const fullSwing = document.querySelectorAll("#type-range div input");
const shortGame = document.querySelectorAll("#type-green div input");
const notes = document.getElementById("practice-notes");
const addPractice = document.getElementById("add-practice");
const editPractice = document.getElementById("edit-practice");

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
  notes: ""
};

/**
 * Populates the practice form with the information from a given practice
 * session.
 *
 * @param {Object} practiceSession The practice session used to populate the
 *                                 form
 */
export const populatePracticeSession = practice => {
  fullSwing.forEach(formField => {
    formField.checked = practice.fullSwing[formField.name];
    formField.value = practice.fullSwing[formField.name];
  });

  shortGame.forEach(formField => {
    formField.checked = practice.shortGame[formField.name];
    formField.value = practice.shortGame[formField.name];
  });

  notes.value = practice.notes;
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
    practiceSession.startTime = Date.parse(practiceStart.value);
    practiceSession.endTime = Date.parse(practiceEnd.value);
    fullSwing.forEach(clubType => {
      practiceSession.fullSwing[clubType.name] = clubType.checked;
    });
    shortGame.forEach(clubType => {
      practiceSession.shortGame[clubType.name] = clubType.checked;
    });
    practiceSession.notes = notes.value;

    return practiceSession;
  } else {
    return null;
  }
};
/**
 * Displays the add practice button and hides the edit practice button in
 * the practice form.
 */
export const showAddButton = () => {
  addPractice.style.display = "flex";
  editPractice.style.display = "none";
};

/**
 * Displays the edit practice button and hides the add practice button in
 * the practice form.
 */
export const showEditButton = () => {
  editPractice.style.display = "flex";
  addPractice.style.display = "none";
};
