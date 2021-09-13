const $ = window.jQuery;
const utils = require("../utils");

// Add current page name to the window title
function fixTitle() {
  const pageTitle = $("#upMenuCaption_menucaption").text();
  const newTitle = `${pageTitle} - ${document.title}`;

  utils.repeat(
    () => {
      if (!!pageTitle) document.title = newTitle;
    },
    { count: 5, interval: 1000 }
  );
}

module.exports = {
  shouldInitialize: () => utils.isLoggedIn(),
  initialize: () => {
    fixTitle();
  },
};
