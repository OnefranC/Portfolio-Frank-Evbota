/**
 * Scroll animations for Frank Evbota portfolio.
 * Uses data-animate / .fe-reveal + optional data-delay / data-stagger.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qsAll(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setupReveals() {
    var nodes = qsAll("[data-animate], .fe-reveal");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    // Stagger siblings that share a data-stagger parent
    qsAll("[data-stagger]").forEach(function (parent) {
      var step = parseFloat(parent.getAttribute("data-stagger")) || 90;
      var kids = qsAll(":scope > [data-animate], :scope > .fe-reveal", parent);
      kids.forEach(function (kid, i) {
        if (!kid.style.getPropertyValue("--fe-delay")) {
          kid.style.setProperty("--fe-delay", i * step + "ms");
        }
      });
    });

    nodes.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay && !el.style.getPropertyValue("--fe-delay")) {
        el.style.setProperty("--fe-delay", delay + "ms");
      }
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function setupParallax() {
    var items = qsAll("[data-parallax]");
    if (!items.length || reduceMotion) return;

    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * speed * -1;
        el.style.setProperty("--fe-parallax-y", offset.toFixed(2) + "px");
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function setupHeader() {
    var header = document.querySelector(".fe-header");
    if (!header) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);

      // Hide on scroll down past 240px, show on scroll up (desktop feel)
      if (!reduceMotion && window.innerWidth > 900) {
        if (y > 240 && y > lastY + 4) {
          header.style.transform = "translateY(-100%)";
        } else if (y < lastY - 4 || y <= 240) {
          header.style.transform = "translateY(0)";
        }
      } else {
        header.style.transform = "";
      }

      lastY = y;
      ticking = false;
    }

    header.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease";

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function setupImageHoverLift() {
    // Subtle scale-in for project/media frames when they enter
    var media = qsAll(".fe-project__media, .fe-case-cover img, .fe-about__media, .fe-case-gallery img");
    if (!media.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    media.forEach(function (el) {
      el.classList.add("fe-media-reveal");
      io.observe(el);
    });
  }

  function setupMenu() {
    var btn = document.querySelector("[data-fe-menu]");
    var nav = document.querySelector("[data-fe-nav]");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
    qsAll("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
      });
    });
  }

  function init() {
    document.documentElement.classList.add("fe-anim-ready");
    setupMenu();
    setupReveals();
    setupParallax();
    setupHeader();
    setupImageHoverLift();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
