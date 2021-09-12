const $ = window.jQuery;
const utils = require("../utils");

// Use custom loading indicator for async requests
function initialize() {
  $('<progress id="npu-loading"/>').appendTo("body");

  utils.runEval(() => {
    const manager = window.Sys.WebForms.PageRequestManager.getInstance();
    manager.add_beginRequest(() => $("#npu-loading").show());
    manager.add_endRequest(() => $("#npu-loading").hide());
  });
}

module.exports = {
  shouldActivate: () => utils.isLoggedIn(),
  initialize
};
