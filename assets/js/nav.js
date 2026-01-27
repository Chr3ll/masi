// assets/js/nav.js
// Mobile nav toggle (vanilla JS, scoped)
// - Toggles main menu on small screens
// - Tap-to-open dropdowns on small screens
(() => {
  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  }

  function init() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.querySelectorAll(".has-dropdown.is-open").forEach(li => li.classList.remove("is-open"));
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isMobile()) return;
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) document.querySelectorAll(".has-dropdown.is-open").forEach(li => li.classList.remove("is-open"));
    });

    // Tap-to-open dropdowns on mobile
    menu.querySelectorAll(".has-dropdown > a, .dropdown > .has-dropdown > a").forEach(a => {
      a.addEventListener("click", (e) => {
        if (!isMobile()) return;
        const li = a.parentElement;
        if (!li || !li.classList.contains("has-dropdown")) return;
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle("is-open");
      });
    });

    // Close on outside click
    document.addEventListener("click", () => {
      if (!isMobile()) return;
      closeMenu();
    });

    // Close when leaving mobile breakpoint
    window.addEventListener("resize", () => {
      if (!isMobile()) closeMenu();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
