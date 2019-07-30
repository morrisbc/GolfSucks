/**
 * Displays an alert before the specified page element.
 *
 * @param {String} elemSelector The selector of the UI element to insert the
 *                              alert after
 * @param {String} modifier The type of the alert affecting styling
 * @param {String} message The content of the alert
 */
const showAlert = (elemSelector, modifier, message) => {
  const elemUI = document.querySelector(`${elemSelector}`);

  if (document.querySelector(`.alert.${modifier}`) === null) {
    const newAlert = document.createElement("div");
    newAlert.className = `alert ${modifier}`;

    const infoIcon = document.createElement("i");
    infoIcon.className = "fas fa-info-circle";
    newAlert.appendChild(infoIcon);

    const alertText = document.createTextNode(message);
    newAlert.appendChild(alertText);

    elemUI.parentElement.insertBefore(newAlert, elemUI);

    setTimeout(() => {
      elemUI.parentElement.removeChild(newAlert);
    }, 2500);
  }
};
