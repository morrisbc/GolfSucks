import { auth } from "./firebase-config.js";

let courseNameElem = document.getElementById("course-name");
const dateElem = document.getElementById("round-date");
const outNineElem = document.getElementById("out");
const inNineElem = document.getElementById("in");
const totalElem = document.getElementById("total");
const frontNineElems = document.querySelectorAll(
  ".new-front-nine .new-hole-score"
);
const backNineElems = document.querySelectorAll(
  ".new-back-nine .new-hole-score"
);
const addScorecard = document.getElementById("add-scorecard");
const editScorecard = document.getElementById("edit-scorecard");
const cancelEditScorecard = document.getElementById("cancel-edit-scorecard");

const scorecard = {
  frontNine: {
    hole1: 0,
    hole2: 0,
    hole3: 0,
    hole4: 0,
    hole5: 0,
    hole6: 0,
    hole7: 0,
    hole8: 0,
    hole9: 0
  },
  backNine: {
    hole10: 0,
    hole11: 0,
    hole12: 0,
    hole13: 0,
    hole14: 0,
    hole15: 0,
    hole16: 0,
    hole17: 0,
    hole18: 0
  },
  out: 0,
  in: 0,
  total: 0,
  nineHoles: false,
  course: "",
  date: null,
  user: ""
};

/**
 * Updates the scorecard UI based on the values in the scorecard object.
 */
export const updateScorecardUI = () => {
  courseNameElem.value = scorecard.course || "";
  dateElem.value = scorecard.date || "";
  frontNineElems.forEach((holeInput, holeNumber) => {
    holeInput.value = scorecard.frontNine[`hole${holeNumber + 1}`] || "";
  });

  backNineElems.forEach((holeInput, holeNumber) => {
    holeInput.value = scorecard.backNine[`hole${holeNumber + 10}`] || "";
  });

  outNineElem.value = scorecard.out || "";
  inNineElem.value = scorecard.in || "";
  totalElem.value = scorecard.total || "";
};

/**
 * Calculates the front nine score and updates the scorecard object.
 */
const calculateFrontNineScore = () => {
  let outScore = 0;
  let invalidHoleScore = false;

  frontNineElems.forEach((holeInput, holeNumber) => {
    const holeScore = parseInt(holeInput.value);

    // Validate hole input and add it to the front nine total
    if (!isNaN(holeScore) && holeScore > 0) {
      outScore += holeScore;
      scorecard.frontNine[`hole${holeNumber + 1}`] = holeScore;
    } else {
      invalidHoleScore = true;
      scorecard.frontNine[`hole${holeNumber + 1}`] = 0;
    }
  });

  if (!invalidHoleScore) {
    scorecard.out = outScore;
  } else {
    scorecard.out = 0;
  }
};

/**
 * Calculates the back nine score and updates the scorecard object.
 */
const calculateBackNineScore = () => {
  let inScore = 0;
  let invalidHoleScore = false;

  backNineElems.forEach((holeInput, holeNumber) => {
    const holeScore = parseInt(holeInput.value);

    // Validate hole input and add it to the back nine total
    if (!isNaN(holeScore) && holeScore > 0) {
      inScore += holeScore;
      scorecard.backNine[`hole${holeNumber + 10}`] = holeScore;
    } else {
      invalidHoleScore = true;
      scorecard.backNine[`hole${holeNumber + 10}`] = 0;
    }
  });

  if (!invalidHoleScore) {
    scorecard.in = inScore;
  } else {
    scorecard.in = 0;
  }
};

/**
 * Calculates the total score for the scorecard and updates the scorecard
 * object.
 */
const calculateTotalScore = () => {
  scorecard.total = scorecard.out + scorecard.in || 0;
};

/**
 * Returns a boolean determining the validity of the scorecard.
 *
 * @return A boolean determining the validity of the scorecard
 */
const scorecardIsValid = () => {
  return (
    scorecard.total > 0 &&
    (scorecard.out > 0 || scorecard.in > 0) &&
    courseNameElem.value !== ""
  );
};

/**
 * Updates the fields of the scorecard object with those of the provided new
 * scorecard object.
 *
 * @param {Object} newScorecard The new scorecard object whose fields will be
 *                              used to update the scorecard object
 */
export const setScorecard = newScorecard => {
  for (let key in scorecard) {
    scorecard[key] = newScorecard[key];
  }
};

/**
 * Returns the scorecard object if the scorecard is valid, null otherwise.
 *
 * @return The scorecard object if the scorecard is valid, null otherwise.
 */
export const getScorecard = () => {
  if (scorecardIsValid()) {
    scorecard.course = courseNameElem.value;
    scorecard.date = dateElem.value;
    if (scorecard.in === 0 || scorecard.out === 0) {
      scorecard.nineHoles = true;
    }
    scorecard.user = auth.currentUser.uid;
    return scorecard;
  } else {
    return null;
  }
};

/**
 * Clears the scoreard's values and updates the scorecard UI.
 */
export const clearScorecard = () => {
  scorecard.course = scorecard.date = "";
  Object.keys(scorecard.frontNine).forEach(key => {
    scorecard.frontNine[key] = 0;
  });
  Object.keys(scorecard.backNine).forEach(key => {
    scorecard.backNine[key] = 0;
  });
  scorecard.out = scorecard.in = scorecard.total = 0;
  updateScorecardUI();
};

/**
 * Displays the 'Edit Scorecard' button within the scorecard form.
 */
export const showEditScorecardButtons = () => {
  editScorecard.style.display = "block";
  cancelEditScorecard.style.display = "block";
};

/**
 * Displays the 'Add Scorecard' button within the scorecard form.
 */
export const showAddScorecard = () => {
  addScorecard.style.display = "block";
};

/**
 * Hides the 'Edit Scorecard' button within the scorecard form.
 */
export const hideEditScorecardButtons = () => {
  editScorecard.style.display = "none";
  cancelEditScorecard.style.display = "none";
};

/**
 * Hides the 'Add Scorecard' button within the scorecard form.
 */
export const hideAddScorecard = () => {
  addScorecard.style.display = "none";
};

// Add event listeners
courseNameElem.addEventListener("keyup", e => {
  scorecard.course = e.target.value;
});
dateElem.addEventListener("change", e => {
  scorecard.date = e.target.value;
});
frontNineElems.forEach(holeInput => {
  holeInput.addEventListener("blur", calculateFrontNineScore);
});

backNineElems.forEach(holeInput => {
  holeInput.addEventListener("blur", calculateBackNineScore);
});

document.querySelectorAll(".new-hole-score").forEach(holeInput => {
  holeInput.addEventListener("blur", calculateTotalScore);
  holeInput.addEventListener("blur", updateScorecardUI);
});
