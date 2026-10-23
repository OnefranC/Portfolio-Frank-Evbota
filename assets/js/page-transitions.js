/**
 * Page transitions disabled — instant navigation.
 * Kept as a no-op pass-through so internal links navigate immediately
 * with no View Transition or fallback fade.
 */
(function () {
  "use strict";

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

  function navigate(href) {
    window.location.href = href;
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

    // Instant: default navigation, no delay, no leave animation.
    navigate(a.href);
    e.preventDefault();
  }

  function init() {
    document.addEventListener("click", onLinkClick, true);

    window.addEventListener("pageshow", function () {
      document.documentElement.classList.remove("fe-page-leaving");
      document.documentElement.classList.remove("fe-page-enter");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
