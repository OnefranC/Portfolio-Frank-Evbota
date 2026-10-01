(function () {
  "use strict";

  function activate(root, index) {
    var btns = root.querySelectorAll("[data-tab]");
    var panels = root.querySelectorAll("[data-panel]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-tab") === String(index);
      btns[i].classList.toggle("is-active", on);
      btns[i].setAttribute("aria-selected", on ? "true" : "false");
    }
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle(
        "is-active",
        panels[j].getAttribute("data-panel") === String(index)
      );
    }
  }

  function bind(root) {
    var btns = root.querySelectorAll("[data-tab]");
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          activate(root, btn.getAttribute("data-tab"));
        });
      })(btns[i]);
    }
  }

  function init() {
    document.querySelectorAll("[data-tabs]").forEach(bind);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
