const $ = window.jQuery;
const utils = require("../utils");

// Add current page name to the window title
function fixTitle() {
  const pageTitle = $("#upMenuCaption_menucaption").text();

  if (!!pageTitle) {
    const newTitle = `${pageTitle} - ${document.title}`;

    // Set correct page title
    document.title = newTitle;

    // ...which somehow gets reset after ~0.5s, so we need to update
    // it at least once (periodically to be sure) 
    window.setInterval(() => (document.title = newTitle), 1000);
  }
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize: () => {
    fixTitle();
  },
};
