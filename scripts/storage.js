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
   * Removes a specified scorecard from local storage.
   *
   * @param {Number} id The id of the scorecard to remove
   */
  const removeScorecardFromStorage = id => {
    let scorecards = getScorecardsFromStorage();

    scorecards = scorecards.filter(scorecard => scorecard.id !== id);
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
        lowest18: 0,
        practicesPosted: 0
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

  /**
   * Get practice sessions from local storage.
   *
   * @return An array of practice objects or an empty array if there are no
   *         practice sessions.
   */
  const getPracticesFromStorage = () => {
    const practices = JSON.parse(localStorage.getItem("practices"));

    if (practices) {
      return practices;
    } else {
      return [];
    }
  };

  /**
   * Add a new practice session to local storage.
   */
  const addPracticeToStorage = practice => {
    const practices = getPracticesFromStorage();

    practices.push(practice);
    localStorage.setItem("practices", JSON.stringify(practices));
  };

  /**
   *
   * @param {Number} id The id of the practice to edit
   */
  const editPracticeInStorage = id => {
    let practices = getPracticesFromStorage();
    let practiceToUpdate;

    practices.forEach(practice => {
      if (practice.id === id) {
        practiceToUpdate = practice;
      }
    });
  };

  /**
   * Removes a specified practice session from local storage.
   *
   * @param {Number} id The id of the practice to remove
   */
  const removePracticeFromStorage = id => {
    let practices = getPracticesFromStorage();

    practices = practices.filter(practice => practice.id !== id);
    localStorage.setItem("practices", JSON.stringify(practices));
  };

  /**
   * Clear practice sessions from local storage.
   */
  const clearPracticesFromStorage = () => {
    localStorage.removeItem("practices");
  };

  return {
    getScorecardsFromStorage,
    addScorecardToStorage,
    removeScorecardFromStorage,
    clearScorecardsFromStorage,
    getTrophiesFromStorage,
    addTrophiesToStorage,
    getPracticesFromStorage,
    addPracticeToStorage,
    removePracticeFromStorage
  };
})();
