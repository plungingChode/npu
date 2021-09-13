const $ = window.jQuery;
const utils = require("../utils");

// Add shortcuts to main menu

/**
 * Designate the element with `shortcutId` as a shortcut for `targetId`.
 *
 * @param {string} shortcutId
 * @param {string} targetId
 */
function createShortcut(shortcutId, targetId) {
  const shortcut = $(shortcutId);
  const target = $(targetId);

  shortcut.on("click", () => (window.location.search = target.attr("targeturl")));

  // TODO maybe this works with toggleClass() ?
  shortcut.hover(
    () => target.addClass("menu-hover"),
    () => target.removeClass("menu-hover")
  );
}
function addShortcuts() {
  createShortcut("#mb1_Tanulmanyok", "#mb1_Tanulmanyok_Leckekonyv");
  createShortcut("#mb1_Targyak", "#mb1_Targyak_Targyfelvetel");
  createShortcut("#mb1_Vizsgak", "#mb1_Vizsgak_Vizsgajelentkezes");
}

/**
 * Move the timetable menu item from the studies submenu to the main menu.
 */
function moveTimetable() {
  const timetable = $("#mb1_Tanulmanyok_Órarend");
  $("#mb1_Targyak").before(timetable);

  timetable.on("click", () => (window.location.search = timetable.attr("targeturl")));
}

/**
 * Add a link to Meet Street / Neptun to the main menu.
 */
function addMeetStreetToggle() {
  const isNeptun = $("#upChooser_chooser_neptun").hasClass("NeptunChooserSelected");
  let menuItem = { target: null, caption: null };

  if (isNeptun) {
    menuItem = { target: "btnKollab", caption: "Meet Street" };
  } else {
    menuItem = { target: "btnNeptun", caption: "Neptun" };
  }

  // Add item to main menu
  // prettier-ignore
  $("#mb1").append($(`
    <li class="menu-item">
      <a href="javascript:__doPostBack('upChooser$${menuItem.target}','')">
        ${menuItem.caption}
      </a>
    </li>
  `));
}

function initialize() {
  addShortcuts();
  moveTimetable();
  addMeetStreetToggle();
}

module.exports = {
  shouldInitialize: () => utils.isLoggedIn(),
  initialize,
};
