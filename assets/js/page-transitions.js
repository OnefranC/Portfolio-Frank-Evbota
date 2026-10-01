/**
 * Smooth multi-page transitions.
 * Prefer View Transitions API; fall back to leave-fade + enter animation.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var leaving = false;

  function isModifiedClick(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  }

  function isInternalLink(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    if (a.dataset.noTransition !== undefined) return false;

    var url;
    try {
      url = new URL(a.href, window.location.href);
    } catch (err) {
      return false;
    }

    if (url.origin !== window.location.origin) return false;
    // Same-page anchors: skip
    if (url.pathname === window.location.pathname && url.hash) return false;
    // Ignore pure hash on same page without path change
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    ) {
      return false;
    }
    return true;
  }

  function supportsViewTransitions() {
    return (
      !reduceMotion &&
      typeof document.startViewTransition === "function"
    );
  }

  function navigate(href) {
    window.location.href = href;
  }

  function leaveThenNavigate(href) {
    if (leaving) return;
    leaving = true;
    document.documentElement.classList.add("fe-page-leaving");

    var delay = reduceMotion ? 0 : 280;
    window.setTimeout(function () {
      navigate(href);
    }, delay);
  }

  function onLinkClick(e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !isInternalLink(a) || isModifiedClick(e)) return;

    // Same URL: ignore (or allow hash-only handled above)
    try {
      var url = new URL(a.href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
    } catch (err) {
      return;
    }

    if (supportsViewTransitions()) {
      // Let the browser do cross-document VT; still prevent double-handling
      // Default navigation proceeds — no preventDefault needed for VT navigation:auto
      return;
    }

    e.preventDefault();
    leaveThenNavigate(a.href);
  }

  function enter() {
    document.documentElement.classList.add("fe-page-enter");
    // Clean up after enter animation so scroll/header transforms stay clean
    window.setTimeout(function () {
      document.documentElement.classList.remove("fe-page-enter");
    }, 700);
  }

  function init() {
    // bfcache restore: don't replay enter
    var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    var fromBFCache = nav && nav.type === "back_forward";

    if (!reduceMotion && !fromBFCache) {
      enter();
    }

    document.addEventListener("click", onLinkClick, true);

    // If user goes back via browser chrome, reset leaving state
    window.addEventListener("pageshow", function (e) {
      leaving = false;
      document.documentElement.classList.remove("fe-page-leaving");
      if (e.persisted && !reduceMotion) {
        enter();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
