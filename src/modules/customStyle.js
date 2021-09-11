const $ = window.jQuery;
const utils = require("../utils");
const css = require("../scss/index.scss").default;

function shouldActivate() {
  return true;
}

function initialize() {
  // Remove default styles
  $('link[rel=stylesheet]').prop('disabled', true);

  // Load custom stylesheet
  utils.injectCss(css);
}

module.exports = {
  shouldActivate,
  initialize,
};
