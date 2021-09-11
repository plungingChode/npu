const utils = require("../utils");
const css = require("../scss/index.scss").default;

function shouldActivate() {
  return true;
}

function initialize() {
  utils.injectCss(css);
}

module.exports = {
  shouldActivate,
  initialize,
};
