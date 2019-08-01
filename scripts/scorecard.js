import { auth } from "./firebase-config.js";

const outNineElem = document.getElementById("out");
const inNineElem = document.getElementById("in");
const totalElem = document.getElementById("total");
const frontNineElems = document.querySelectorAll(
  ".new-front-nine .new-hole-score"
);
const backNineElems = document.querySelectorAll(
  ".new-back-nine .new-hole-score"
);

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
  location: null,
  date: null,
  user: ""
};

/**
 * Updates the scorecard UI based on the values in the scorecard object.
 */
const updateScorecardUI = () => {
  frontNineElems.forEach((holeInput, holeNumber) => {
    holeInput.value = scorecard.frontNine[holeNumber + 1] || "";
  });

  backNineElems.forEach((holeInput, holeNumber) => {
    holeInput.value = scorecard.backNine[holeNumber + 10] || "";
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
      scorecard.frontNine[holeNumber + 1] = holeScore;
    } else {
      invalidHoleScore = true;
      scorecard.frontNine[holeNumber + 1] = 0;
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
      scorecard.backNine[holeNumber + 10] = holeScore;
    } else {
      invalidHoleScore = true;
      scorecard.backNine[holeNumber + 10] = 0;
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
  return scorecard.total > 0 && (scorecard.out > 0 || scorecard.in > 0);
};

/**
 * Returns the scorecard object if the scorecard is valid, null otherwise.
 *
 * @return The scorecard object if the scorecard is valid, null otherwise.
 */
export const getScorecard = () => {
  if (scorecardIsValid()) {
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
  Object.keys(scorecard.frontNine).forEach(key => {
    scorecard.frontNine[key] = 0;
  });
  Object.keys(scorecard.backNine).forEach(key => {
    scorecard.backNine[key] = 0;
  });
  scorecard.out = scorecard.in = scorecard.total = 0;
  scorecard.location = scorecard.date = null;
  updateScorecardUI();
};

// Add event listeners
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
