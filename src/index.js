const utils = require("./utils");
const storage = require("./storage");

const modules = [
  // Styling overhaul
  require("./modules/customStyle"),

  // Login page
  // require("./modules/autoLogin"),
  require("./modules/loginRetry"),
  require("./modules/transformLogin"), // custom

  // All authenticated pages
  require("./modules/transformHeader"), // custom
  require("./modules/pageTitle"), // done
  require("./modules/termSelectorFixes"),
  require("./modules/paginationFixes"),
  require("./modules/officialMessageAlert"),
  require("./modules/hideSurveyPopup"),
  require("./modules/infiniteSession"),
  require("./modules/loadingIndicator"), // done

  // Timetable page
  require("./modules/timetableFixes"),

  // Markbook page
  require("./modules/markListFixes"),

  // Advance page
  require("./modules/advanceListFixes"),

  // Course signup page
  require("./modules/courseListFixes"),
  require("./modules/courseAutoList"),
  require("./modules/courseStore"),

  // Exams page
  require("./modules/examListFixes"),

  // Signed exams page
  require("./modules/signedExamListFixes"),
];

(async () => {
  console.log("initialize npu")
  await storage.initialize();

  modules.forEach(module => {
    if (module.shouldInitialize() && (utils.isNeptunPage() || module.runOutsideNeptun)) {
      module.initialize();
    }
  });
})();
