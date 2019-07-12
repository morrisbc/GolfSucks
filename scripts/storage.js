const storage = (() => {
  /**
   * Retrieves all scorecards from local storage.
   *
   * @return An array of scorecard objects
   */
  const getScorecardsFromStorage = () => {
    const scorecards = JSON.parse(localStorage.getItem("scorecards"));

    if (scorecards) {
      return scorecards;
    } else {
      return [];
    }
  };

  /**
   * Adds a new scorecard to the array and stores the new array in local
   * storage.
   *
   * @param {Object} newScorecard The scorecard to add
   */
  const addScorecardToStorage = newScorecard => {
    let scorecards = getScorecardsFromStorage();

    scorecards.push(newScorecard);
    localStorage.setItem("scorecards", JSON.stringify(scorecards));
  };

  /**
   * Removes all scorecards from local storage.
   */
  const clearScorecardsFromStorage = () => {
    localStorage.removeItem("scorecards");
  };

  /**
   * Retrieves trophies from local storage.
   *
   * @return An object containing all trophy values
   */
  const getTrophiesFromStorage = () => {
    const trophies = JSON.parse(localStorage.getItem("trophies"));

    if (trophies) {
      return trophies;
    } else {
      return {
        scorecardsPosted: 0,
        lowest9: 0,
        lowest18: 0
      };
    }
  };

  /**
   * Updates the trophies in local storage with the new updated trophy object.
   *
   * @param {Object} trophies Object containing updated trophy information
   */
  const addTrophiesToStorage = trophies => {
    localStorage.setItem("trophies", JSON.stringify(trophies));
  };

  /**
   * Clears all trophy information from local storage.
   */
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
