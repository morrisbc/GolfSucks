const newScorecard = (() => {
  let outNineElem = document.getElementById("out");
  let inNineElem = document.getElementById("in");
  let totalElem = document.getElementById("total");
  let frontNineElems = document.querySelectorAll(
    ".new-front-nine .new-hole-score"
  );
  let backNineElems = document.querySelectorAll(
    ".new-back-nine .new-hole-score"
  );

  const scorecard = {
    frontNine: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0
    },
    backNine: {
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0
    },
    out: 0,
    in: 0,
    total: 0,
    isValid: false,
    location: null,
    date: null
  };

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

  const calculateBackNineScore = () => {
    let inScore = 0;
    let invalidHoleScore = false;

    backNineElems.forEach((holeInput, holeNumber) => {
      const holeScore = parseInt(holeInput.value);

      // Validate hole input and add it to the front nine total
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

  const calculateTotalScore = () => {
    scorecard.total = scorecard.out + scorecard.in || 0;
  };

  const validateScorecard = () => {
    scorecard.isValid =
      scorecard.total > 0 && (scorecard.out > 0 || scorecard.in > 0);
  };

  const clearScorecard = () => {
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
    holeInput.addEventListener("blur", validateScorecard);
    holeInput.addEventListener("blur", updateScorecardUI);
  });

  return {
    scorecard,
    clearScorecard
  };
})();
