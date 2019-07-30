// Check to see if the user is on the appropriate page based on
// their login status
auth.onAuthStateChanged(user => {
  if (user) {
    if (!window.location.href.endsWith("dashboard.html")) {
      window.location.href = "./dashboard.html";
    }
  } else {
    if (!window.location.href.endsWith("index.html")) {
      window.location.href = "./index.html";
    }
  }
});
