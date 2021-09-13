const $ = window.jQuery;
const utils = require("../utils");

function shouldInitialize() {
  return utils.isLoggedIn();
}

// Add current page name to the window title
function initialize() {
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
  shouldInitialize,
  initialize
};
