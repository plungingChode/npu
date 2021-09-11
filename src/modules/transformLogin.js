const $ = window.jQuery;
const utils = require("../utils");

/** Remove unnecessary parts (parens, exact time, whitespace) of a date string */
function formatDateString(date) {
  return date
    .replace(/[()]/g, "")
    .replace(/\d{1,2}:\d{1,2}:\d{1,2}\s*(AM|PM)?/, "")
    .trim();
}

function transformNews() {
  const newsTitle = $("#lblHirek").text();
  const news = $("#dataListNews table").get().map(parseNewsItem).map(createNewsItem).join("");

  const newsEl = `
    <div class="news login-container">
      <h3>${newsTitle}</h3>
      <ul class="news-list">${news}</ul>
    </div>
  `;

  $(".login_center").append(newsEl);
}

function parseNewsItem(newsTable) {
  const table = $(newsTable);

  return {
    subject: table.find(".login_news_subject").html(),
    content: table.find(".login_news_content p").html() || table.find(".login_news_content div").html(),
    date: table.find(".login_news_date").html(),
  };
}

function createNewsItem({ subject, content, date }) {
  return `
    <li class="news-item">
      <div class="news-header">
        <span class="news-subject">${subject}</span>
        <span class="news-date">${formatDateString(date)}</span>
      </div>
      <div class="news-content">
        ${content}
      </div>
    </li>
  `;
}

function transformDocuments() {
  const docsTitle = $("#lblDokumentumok").text();
  const docs = $("#dataListDocuments .table_left_docs").get().map(parseDocument).map(createDocumentItem).join("");

  const docsEl = `
    <div class="docs login-container">
      <h3>${docsTitle}</h3>
      <ul class="docs-list">${docs}</ul>
    </div>
  `;

  $(".login_center").append(docsEl);
}

function parseDocument(docTable) {
  const table = $(docTable);
  const link = table.find("a");

  return {
    href: link.prop("href"),
    content: link.text(),
    // date: table.find(".login_docs_date").html(),
  };
}

function createDocumentItem({ href, content }) {
  return `
    <li class="docs-item">
      <a href="${href}">${content}</a>
    </li>
  `;
}

function transformLinks() {
  const linksTitle = $("#lblLinkek").text();
  const links = $("#dataListLinks .table_left").get().map(parseLink).map(createLinkItem).join("");

  const linksEl = `
    <div class="links login-container">
      <h3>${linksTitle}</h3>
      <div class="links-list">${links}</div>
    </div>
  `;

  $(".login_center").append(linksEl);
}

function parseLink(linkTable) {
  const table = $(linkTable);
  const link = table.find("a");

  return {
    href: link.prop("href"),
    content: link.text().trim(),
  };
}

function createLinkItem({ href, content }) {
  return `<a href="${href}">${content}</a>`;
}

function transformLoginForm() {
  const loginForm = $(".login_left_side > table");
  const { moduleType, serverName, langSelect, userName, password, loginButton } = parseLoginForm(loginForm);

  const langButtons = langSelect.options
    .map(
      (lang, idx) => `
        <button name="btnLang_${idx}" onclick="${lang.action}">${lang.caption}</button>
      `
    )
    .join("");

  // Extract server name and free space
  const [_, server, space] = /(.*)\((\d*)\)/.exec(serverName);

  const loginEl = `
    <div class="login login-container">
      <div class="logo"></div>
      <div class="info">
        <span class="module-type">${moduleType} portál</span>
        <span class="server">${server}</span>
        <span class="space">${space} szabad hely</span>
      </div>
      <div class="login-fields">
        <div class="lang-select">
          ${langButtons}
        </div>
        <div class="login-field username">
          <label for="${userName.field}">${userName.caption}</label>
          <input type="text" id="${userName.field}" name="${userName.field}" />
        </div>
        <div class="login-field password">
          <label for="${password.field}">${password.caption}</label>
          <input type="password" id="${password.field}" name="${password.field}" />
        </div>
        <input type="button" id="btnSubmit" onclick="${loginButton.action}" value="${loginButton.caption}" />
      </div>
    </div>
  `;

  $(".login_center").append(loginEl);
  $(userName.validator).appendTo(".login-field.username");
  $(userName.validatorState).appendTo(".login-field.username");
}

function parseLoginForm(loginTable) {
  const table = $(loginTable);
  const langSelectOptions = table
    .find("#td_Zaszlok input")
    .get()
    .map(input => ({
      caption: input.title,
      action: $(input).attr("onclick").replace(/"/g, "'"),
      active: $(input).css("opacity") === "1"
    }));

  return {
    moduleType: table.find("#lblModuleType").text(),
    serverName: table.find("#lblServerName").text(),
    langSelect: {
      caption: table.find("#td_Zaszlok").prev(".login_label").text().trim().replace(/:/, ""),
      options: langSelectOptions,
    },
    userName: {
      field: "user",
      caption: table.find("#lblUsername").text().replace(/:/, ""),

      // Need to grab the exact element (these represent some kind of
      // component for the server)
      validator: table.find("#loginValidator"),
      validatorState: table.find("#vcelogin_ClientState"),
    },
    password: {
      field: "pwd",
      caption: table.find("#lblPwd").text().replace(/:/, ""),
    },
    loginButton: {
      caption: table.find("#btnSubmit").attr("value"),
      action: table.find("#btnSubmit").attr("onclick"),
    },
  };
}

function shouldActivate() {
  return utils.isLoginPage();
}

function initialize() {
  transformLoginForm();
  transformLinks();
  transformNews();
  transformDocuments();
  $(".info_table_center_container_td").remove();
  $(".table_center").remove();
}

module.exports = {
  shouldActivate,
  initialize,
};
