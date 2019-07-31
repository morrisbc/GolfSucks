const firestoreModule = (() => {
  const scorecards = [];
  const trophies = [];
  const practiceSessions = [];

  const getUserScorecards = user => {
    return firebaseConfig.db
      .collection("scorecards")
      .where("user", "==", user.uid)
      .get();
    // .then(snapshot => {
    //   snapshot.forEach(doc => {
    //     scorecards.push(doc.data());
    //     return scorecards;
    //   });
    // });
  };

  const getUserTrophies = user => {
    firebaseConfig.db
      .collection("trophies")
      .where("user", "==", user.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          trophies.push(doc.data());
        });
        return trophies;
      });
  };

  const getUserPracticeSessions = user => {
    firebaseConfig.db
      .collection("practiceSessions")
      .where("user", "==", user.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          practiceSessions.push(doc.data());
        });
        return practiceSessions;
      });
  };

  return {
    getUserScorecards,
    getUserTrophies,
    getUserPracticeSessions
  };
})();
