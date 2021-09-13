const $ = window.jQuery;

// Verify that we are indeed on a Neptun page
function isNeptunPage() {
  return document.title.indexOf("Neptun.Net") !== -1;
}

// Returns whether we are on the login page
function isLoginPage() {
  return document.body.id === "bodyLogin";
}

// Returns whether we are authenticated
function isLoggedIn() {
  // Main form's ID is always #form1 (?)
  return !!document.querySelector("#form1");
}

// Parses and returns the Neptun code of the current user
function getNeptunCode() {
  if ($("#upTraining_topname").size() > 0) {
    const input = $("#upTraining_topname").text();
    return input.substring(input.indexOf(" - ") + 3).toUpperCase();
  }
}

// Parses and returns the first-level domain of the site
function getDomain() {
  const host = location.host.split(".");
  const tlds = "at co com edu eu gov hu hr info int mil net org ro rs sk si ua uk".split(" ");
  let domain = "";
  for (let i = host.length - 1; i >= 0; i--) {
    domain = `${host[i]}.${domain}`;
    if (!tlds.includes(host[i])) {
      return domain.substr(0, domain.length - 1);
    }
  }
}

// Parses and returns the sanitized name of the current training
function getTraining() {
  if ($("#lblTrainingName").size() > 0) {
    return $("#lblTrainingName")
      .text()
      .replace(/[^a-zA-Z0-9]/g, "");
  }
}

// Returns the ID of the current page
function getPageId() {
  const result = /ctrl=([a-zA-Z0-9_]+)/g.exec(window.location.href);
  return result ? result[1] : null;
}

// Returns whether the specified ID is the current page
function isPageId(...ctrls) {
  return ctrls.includes(getPageId());
}

// Get the current AJAX grid instance
function getAjaxInstance(element) {
  const instanceId = getAjaxInstanceId(element);
  return instanceId && unsafeWindow[getAjaxInstanceId(element)];
}

function getAjaxInstanceId(element) {
  const ajaxGrid = $(element).closest("div[type=ajaxgrid]");
  return ajaxGrid.size() > 0 && ajaxGrid.first().attr("instanceid");
}

// Runs a function asynchronously to fix problems in certain cases
function runAsync(func) {
  window.setTimeout(func, 0);
}

// Evaluates code in the page context
function runEval(source) {
  const value = typeof source === "function" ? `(${source})();` : source;
  const script = document.createElement("script");
  script.setAttribute("type", "application/javascript");
  script.textContent = value;
  document.body.appendChild(script);
  document.body.removeChild(script);
}

// Reads the value at the provided path in a deeply nested object
function deepGetProp(o, s) {
  let c = o;
  while (s.length) {
    const n = s.shift();
    if (!(c instanceof Object && n in c)) {
      return;
    }
    c = c[n];
  }
  return c;
}

// Sets a value at the provided path in a deeply nested object
function deepSetProp(o, s, v) {
  let c = o;
  while (s.length) {
    const n = s.shift();
    if (s.length === 0) {
      if (v === null) {
        delete c[n];
      } else {
        c[n] = v;
      }
      return;
    }
    if (!(typeof c === "object" && n in c)) {
      c[n] = new Object();
    }
    c = c[n];
  }
}

// Injects a style tag into the page
function injectCss(css) {
  $("<style></style>").html(css).appendTo("head");
}

// Parses a subject code that is in parentheses at the end of a string
function parseSubjectCode(source) {
  const str = source.trim();
  if (str.charAt(str.length - 1) === ")") {
    let depth = 0;
    for (let i = str.length - 2; i >= 0; i--) {
      const c = str.charAt(i);
      if (depth === 0 && c === "(") {
        return str.substring(i + 1, str.length - 1);
      }
      depth = c === ")" ? depth + 1 : depth;
      depth = c === "(" && depth > 0 ? depth - 1 : depth;
    }
  }
  return null;
}

// Returns if the given string stands for a passing grade
function isPassingGrade(str) {
  return [
    "jeles",
    "excellent",
    "jó",
    "good",
    "közepes",
    "satisfactory",
    "elégséges",
    "pass",
    "kiválóan megfelelt",
    "excellent",
    "megfelelt",
    "average",
  ].some(function (item) {
    return str.toLowerCase().indexOf(item) !== -1;
  });
}

// Returns if the given string stands for a failing grade
function isFailingGrade(str) {
  return [
    "elégtelen",
    "fail",
    "nem felelt meg",
    "unsatisfactory",
    "nem jelent meg",
    "did not attend",
    "nem vizsgázott",
    "did not attend",
  ].some(function (item) {
    return str.toLowerCase().indexOf(item) !== -1;
  });
}

const pageGroup = {
  /** Saját adatok */ personalData: /01\d\d/,
  /** Tanulmányok */ studies: /02\d[0-2|4-9]|(h_adv|h_mar).*/,
  /** Órarend */ timetable: /0203|(c_comm).*/,
  /** Tárgyak */ courses: /03\d\d|(h_add).*/,
  /** Vizsgák */ exams: /04\d\d|(h_exa|h_sig).*/,
  /** Pénzügyek */ finances: /05\d\d/,
  /** Információ */ information: /130[135]|131[346]|(c_gen|h_inst|h_fir|c_ele).*/,
  /** Ügyintézés */ administration: /1311|1307|14\d\d|(h_sca|h_sza|h_app|c_onl).*/,
};

/**
 * Check if the current location belongs to a given page group.
 * @param {RegExp} groupPattern
 */
function isPageGroup(groupPattern) {
  return groupPattern.test(window.location.search);
}

const exactPage = {
  /** Órarend */ timetable: /0203|c_common_timetable/,
  /** Leckekönyv */ markbook: /0206|h_markbook/,
  /** Előrehaladás */ advance: /0222|h_advance/,
  /** Tárgyfelvétel */ addSubjects: /0303|h_addsubjects/,
  /** Vizsgajelentkezés */ modifyExams: /0401|h_exams/,
  /** Felvett vizsgák */ signedExams: /0402|h_signedexams/,
};

/**
 * Check if the current location is a given page.
 * @param {RegExp} pagePattern
 */
function isExactPage(pagePattern) {
  return pagePattern.test(window.location.search);
}

/**
 * Repeat `fn` asynchronously a set number of times, using `window.setInterval`.
 * You can also provide the `options.test` function to check if the repeater can exit
 * early.
 *
 * @param {{count: number, interval: number, test?: () => boolean}} options 
 *    properties of the repetition   
 * @param {() => any} fn 
 *    a function to repeatedly call
 * 
 * @return {number} 
 *    the timer handle
 */
function repeat(fn, options) {
  let {count, interval, test} = options;

  --count;
  fn();

  const timer = window.setInterval(() => {
    --count;
    if (test && test()) clearInterval(timer);
    if (count <= 0) clearInterval(timer);
    fn();
  }, interval);

  return timer;
}

module.exports = {
  isNeptunPage,
  isLoginPage,
  isLoggedIn,
  getNeptunCode,
  getDomain,
  getTraining,
  getPageId,
  isPageId,
  getAjaxInstance,
  getAjaxInstanceId,
  runAsync,
  runEval,
  deepGetProp,
  deepSetProp,
  injectCss,
  parseSubjectCode,
  isPassingGrade,
  isFailingGrade,
  isExactPage,
  exactPage,
  isPageGroup,
  pageGroup,
  repeat,
};
