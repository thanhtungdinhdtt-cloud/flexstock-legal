/*
 * FlexStock legal site — language selection.
 *
 * Every page holds the same document in Vietnamese (vi), English (en) and Japanese (ja).
 * The language is chosen in this order:
 *   1. the URL fragment, e.g. privacy.html#ja   (the iOS app links this way, using its own language),
 *   2. the browser's preferred languages,
 *   3. English.
 * Without JavaScript the CSS shows all three languages, so the content is never hidden.
 */
(function () {
  'use strict';

  var SUPPORTED = ['vi', 'en', 'ja'];
  var root = document.documentElement;

  function fromHash() {
    var value = (window.location.hash || '').replace('#', '').toLowerCase();
    return SUPPORTED.indexOf(value) >= 0 ? value : null;
  }

  function fromBrowser() {
    var preferred = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    for (var i = 0; i < preferred.length; i++) {
      var code = String(preferred[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(code) >= 0) { return code; }
    }
    return null;
  }

  function currentLanguage() {
    return fromHash() || fromBrowser() || 'en';
  }

  // Runs once the DOM exists: highlights the active language button and makes the
  // page links (Privacy / Terms / Support) carry the chosen language along.
  function refreshControls(language) {
    var switchers = document.querySelectorAll('[data-lang-link]');
    for (var i = 0; i < switchers.length; i++) {
      var link = switchers[i];
      if (link.getAttribute('data-lang-link') === language) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
    var pages = document.querySelectorAll('a[data-page]');
    for (var j = 0; j < pages.length; j++) {
      pages[j].setAttribute('href', pages[j].getAttribute('data-page') + '#' + language);
    }
  }

  function apply(language) {
    root.setAttribute('data-lang', language);
    root.setAttribute('lang', language);
    refreshControls(language);
  }

  // Apply immediately (script is loaded in <head>) so the wrong language never flashes.
  root.classList.add('js');
  var initial = currentLanguage();
  root.setAttribute('data-lang', initial);
  root.setAttribute('lang', initial);

  document.addEventListener('DOMContentLoaded', function () { apply(currentLanguage()); });

  window.addEventListener('hashchange', function () {
    var language = fromHash();
    if (language) { apply(language); }
  });
})();
