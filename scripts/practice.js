const practice = (() => {
  // Practice form elements
  const practiceStart = document.getElementById("time-start");
  const practiceEnd = document.getElementById("time-end");
  const fullSwing = document.querySelectorAll("#type-range div input");
  const shortGame = document.querySelectorAll("#type-green div input");
  const notes = document.getElementById("practice-notes");

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
   * Clears the practice form UI and reinitializes the practice session member
   * object.
   */
  const clearPracticeForm = () => {
    practiceSession.startTime = null;
    practiceSession.endTime = null;
    fullSwing.forEach(clubType => {
      practiceSession.fullSwing[clubType.name] = false;
    });
    shortGame.forEach(clubType => {
      practiceSession.shortGame[clubType.name] = false;
    });
    practiceSession.notes = "";

    practiceStart.value = "";
    practiceEnd.value = "";
    fullSwing.forEach(checkbox => {
      checkbox.checked = false;
    });
    shortGame.forEach(checkbox => {
      checkbox.checked = false;
    });
    notes.value = "";
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
  const getPractice = () => {
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

  return {
    getPractice,
    clearPracticeForm
  };

  // document.getElementById("add-practice").addEventListener("click", () => {
  //   console.log(getPractice());
  // });
})();
