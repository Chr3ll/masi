// assets/js/typing-bg.js
// Vanta.NET background for the typing hero.
// Uses CDN-loaded THREE + VANTA. Safe no-op if libraries not available.

(() => {
  function init() {
    const el = document.getElementById("typing-hero");
    if (!el) return;

    // Prevent double-init
    if (el.__vanta) return;

    if (window.VANTA && window.VANTA.NET) {
      el.__vanta = window.VANTA.NET({
        el,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xf7c600,
        backgroundColor: 0x044880
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
