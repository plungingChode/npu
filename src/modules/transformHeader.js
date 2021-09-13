const $ = window.jQuery;
const utils = require("../utils");

/**
 * Remove unnecessary elements from the default header and replace it with a
 * more concise one.
 */
async function replaceHeader() {
  const trainingChangeHref = "javascript:__doPostBack('SDAUpdatePanel1$lbtnChangeTraining','')";
  const logoutAction = "DoLogOut(-1);return false;";

  // Extract relevant training information (course + degree)
  let training = $("#lblTrainingName").text();
  training = training.substring(0, training.indexOf(" -"));

  const userName = $("#upTraining_topname").text();
  const logoutCaption = $("#lbtnQuit").text();

  // Specific element required to avoid errors
  const logoutTimer = $("#upTraining_lblRemainingTime");

  // TODO change #upTraining_topname to something sensible (currently needed
  // for compatibility)
  const header = $(`
    <header id="page-header">
      <span id="upTraining_topname">${userName},</span>
      <a id="training" href="${trainingChangeHref}">${training}</a>
      <a id="logout-btn" href="#" onclick="${logoutAction}">${logoutCaption}</a>
    </header>
    <nav id="main-menu"></nav>
  `);

  const oldHeader = $("#mainPageHeader");
  oldHeader.after(header);
  $("#logout-btn", header).before(logoutTimer);
  oldHeader.remove();

  // Move main menu after header
  $("#main-menu").append($("#mb1"));
}

/**
 * Designate the element with `shortcutId` as a shortcut for `targetId`.
 *
 * @param {string} shortcutId
 * @param {string} targetId
 */
function createShortcut(shortcutId, targetId) {
  const shortcut = $(`${shortcutId} > span`);
  const target = $(targetId);

  shortcut.addClass("menu-item");
  shortcut.on("click", () => (window.location.search = target.attr("targeturl")));
  shortcut.hover(() => target.toggleClass("menu-hover"));
}
function addShortcuts() {
  createShortcut("#mb1_Tanulmanyok", "#mb1_Tanulmanyok_Leckekonyv");
  createShortcut("#mb1_Targyak", "#mb1_Targyak_Targyfelvetel");
  createShortcut("#mb1_Vizsgak", "#mb1_Vizsgak_Vizsgajelentkezes");
}

/**
 * Move the timetable menu item to the main menu.
 */
function moveTimetable() {
  const timetable = $("#mb1_Tanulmanyok_Órarend");
  $("#mb1_Targyak").before(timetable);

  timetable.addClass("menu-parent");
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

  // Add item to main menu. Link is wrapped in a <span>, since styling depends
  // on an inner <span> element (see /src/scss/_header.scss)
  // prettier-ignore
  $("#mb1").append($(`
    <li class="menu-parent menu-item">
      <span>
        <a href="javascript:__doPostBack('upChooser$${menuItem.target}','')">
          ${menuItem.caption}
        </a>
      </span>
    </li>
  `));
}

/** A list of main menu item IDs with the corresponding page group regex */
const pageGroups = {
  "#mb1_Sajatadatok": utils.pageGroup.personalData,
  "#mb1_Tanulmanyok": utils.pageGroup.studies,
  "#mb1_Tanulmanyok_Órarend": utils.pageGroup.timetable,
  "#mb1_Targyak": utils.pageGroup.courses,
  "#mb1_Vizsgak": utils.pageGroup.exams,
  "#mb1_Penzugyek": utils.pageGroup.finances,
  "#mb1_Informacio": utils.pageGroup.information,
  "#mb1_Ügyintezes": utils.pageGroup.administration,
  "#mb1_Mail": /inbox|outbox|rules|directory/,
};
function setActivePage() {
  for (const id in pageGroups) {
    if (pageGroups[id].test(window.location.search)) {
      $(id).addClass("active");
      console.log(id);
      return;
    }
  }
}

/**
 * Replace the `Mail` gadget with an entry in the main menu
 */
function addMailMenu() {
  // Title of the mail gadget (no ID, but comes after its `ColorBtn`)
  const mailTitle = $("#upBoxes_upMessage_gdgMessage_gdgMessage_ColorBtn").next().text();

  // Add data attribute if there's unread mail
  const inboxLink = $("#_lnkInbox");
  const hasUnread = inboxLink.css("fontWeight") > 500 ? "data-unread" : "";

  // Extract relevant information from mail link
  function parseLink(name) {
    const link = $("#_lnk" + name);
    return {
      name: name,
      href: link.attr("href"),
      caption: link.text(),
    };
  }
  // Generate mail menu item
  function createMenuItem({ name, href, caption }) {
    return `
      <li id="Mail-${name}" class="menu-item">
        <a href="${href}">${caption}</a>
      </li>
    `;
  }

  const mailLinks = ["Inbox", "OutBox", "Options", "Directory"];
  const menuRoot = $(`
    <li id="mb1_Mail" class="menu-parent" ${hasUnread} role="menuitem" aria-haspopup="true">
      <span class="menu-item">
        ${mailTitle}
      </span>
      <ul class="menu" role="menu">
        ${mailLinks.map(parseLink).map(createMenuItem).join("")}
      </ul>
    </li>
  `);

  // Should come after personal information
  $("#mb1_Sajatadatok").after(menuRoot);
  menuRoot.hover(
    () => $("#mb1_Mail > ul").show(),
    () => $("#mb1_Mail > ul").hide()
  );
}

function shouldInitialize() {
  return utils.isLoggedIn();
}

function initialize() {
  // Start async tasks
  replaceHeader();

  // Sync tasks in sequence
  moveTimetable();

  // Wrap raw text nodes in a <span> before further
  // transformations
  $("#mb1 > li").each(function () {
    $(this).contents().first().wrap("<span></span>");
  });

  addShortcuts();
  addMeetStreetToggle();
  addMailMenu();
  setActivePage();
}

module.exports = {
  shouldInitialize,
  initialize,
};
