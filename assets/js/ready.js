"use strict";

function changeLanguage(element) {
  if (!element) return;

  element.addEventListener("change", function (event) {
    var location = window.location.pathname + window.location.hash;
    var userLang = event.target.value;
    document.cookie = "nf_lang=" + userLang;
    window.location.assign(location.replace(/^\/\w{2}/, "/" + userLang));
  });
}

function setHeader(header) {
  if (!header) return;

  if (screen.orientation.type.startsWith("portrait")) {
    var slide = header.querySelector("link.portrait");
  } else {
    var slide = header.querySelector("link.landscape");
  }

  if (slide) {
    header.style.backgroundImage = "url(" + slide.href + ")";
    header.classList.add('header-loaded');
  }
}

/*
 * Create cookie to get the Browser Language.
 * This should always run for CDN optimisation.
 */
function persistLanguage(cookies) {
  if (!cookies.includes("nf_lang")) {
    var userLang = getFirstBrowserLanguage();
    document.cookie = "nf_lang=" + userLang;
  }
}

function getFirstBrowserLanguage() {
  var defaultLanguage = "nl";

  var nav = window.navigator,
    browserLanguagePropertyKeys = [
      "language",
      "browserLanguage",
      "systemLanguage",
      "userLanguage",
    ],
    i,
    language;

  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }
  return defaultLanguage;
}

function run() {
  feather.replace({ width: "1em", height: "1em" });

  persistLanguage(document.cookie);
  changeLanguage(document.querySelector("#changeLanguage"));
  setHeader(document.querySelector("#site-head"));

  let carousels = document.querySelectorAll(".carousel");
  carousels.forEach(function (element) {
    new Flickity(element, {
      percentPosition: false,
      cellAlign: "left",
      lazyLoad: 3,
      imagesLoaded: true,
    });
  });

  document.body.classList.add("data-js-loaded");
}

if (document.readyState !== 'loading') {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run);
}
