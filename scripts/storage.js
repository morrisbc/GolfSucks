const storage = (() => {
  const getScorecardsFromStorage = () => {
    const scorecards = JSON.parse(localStorage.getItem("scorecards"));

    if (scorecards) {
      return scorecards;
    } else {
      return [];
    }
  };

  const addScorecardToStorage = newScorecard => {
    let scorecards = getScorecardsFromStorage();

    scorecards.push(newScorecard);
    localStorage.setItem("scorecards", JSON.stringify(scorecards));
  };

  const clearScorecardsFromStorage = () => {
    localStorage.removeItem("scorecards");
  };

  const getTrophiesFromStorage = () => {
    const trophies = JSON.parse(localStorage.getItem("trophies"));

    if (trophies) {
      return trophies;
    } else {
      return {
        roundsPlayed: 0,
        lowest9: 0,
        lowest18: 0
      };
    }
  };

  const addTrophiesToStorage = trophies => {
    localStorage.setItem("trophies", JSON.stringify(trophies));
  };

  const clearTrophiesFromStorage = () => {
    localStorage.removeItem("trophies");
  };

  return {
    getScorecardsFromStorage,
    addScorecardToStorage,
    clearScorecardsFromStorage,
    getTrophiesFromStorage,
    addTrophiesToStorage
  };
})();
