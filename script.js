/* ==========================================================================
   Python Field Notes — behavior
   Mobile nav toggle · scroll-spy · back-to-top · scroll-reveal
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Mobile nav (kernel rail) ---------------- */

  var rail = document.getElementById("rail");
  var railToggle = document.getElementById("railToggle");

  if (rail && railToggle) {
    var overlay = document.createElement("div");
    overlay.className = "rail-overlay";
    document.body.appendChild(overlay);

    function openRail() {
      rail.classList.add("open");
      overlay.classList.add("show");
      railToggle.setAttribute("aria-expanded", "true");
    }
    function closeRail() {
      rail.classList.remove("open");
      overlay.classList.remove("show");
      railToggle.setAttribute("aria-expanded", "false");
    }

    railToggle.addEventListener("click", function () {
      rail.classList.contains("open") ? closeRail() : openRail();
    });
    overlay.addEventListener("click", closeRail);

    var navLinks = rail.querySelectorAll("[data-nav]");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 860) closeRail();
      });
    });
  }

  /* ---------------- Scroll-spy: highlight active section in the rail ---------------- */

  var sections = document.querySelectorAll("main section[id]");
  var links = document.querySelectorAll(".rail-link[data-nav]");

  function setActive(id) {
    links.forEach(function (l) {
      var match = l.getAttribute("href") === "#" + id;
      l.classList.toggle("active", match);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- Back-to-top button ---------------- */

  var topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener(
      "scroll",
      function () {
        topBtn.classList.toggle("show", window.scrollY > 500);
      },
      { passive: true }
    );
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------- Scroll-reveal for cards, tables, projects ---------------- */

  var revealTargets = document.querySelectorAll(
    ".concept-card, .table-wrap, .project, .real-world, .chart-gallery, .chart-card, .course-card"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.setProperty("--i", i % 6);
    });

    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { reveal.observe(el); });
  }
})();
