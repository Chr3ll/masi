// assets/js/partners.js
// Partners click-to-flip (scoped to #partners)
// - Click card toggles flip
// - Clicking the link navigates (no toggle)
// - Only one card open at a time
// - Keyboard: Enter/Space toggles on focused card

(() => {
  function init(){
    const root = document.getElementById("partners");
    if (!root) return;

    const cards = Array.from(root.querySelectorAll("[data-partner-card]"));

    function closeAll(except){
      cards.forEach(c => {
        if (c !== except) {
          c.classList.remove("is-flipped");
          const inner = c.querySelector(".partner-card__inner");
          if (inner) inner.setAttribute("aria-expanded", "false");
        }
      });
    }

    function toggle(card){
      const inner = card.querySelector(".partner-card__inner");
      const willOpen = !card.classList.contains("is-flipped");
      closeAll(card);
      card.classList.toggle("is-flipped", willOpen);
      if (inner) inner.setAttribute("aria-expanded", willOpen ? "true" : "false");
    }

    cards.forEach(card => {
      const inner = card.querySelector(".partner-card__inner");
      if (!inner) return;

      inner.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // let link navigate
        toggle(card);
      });

      inner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " "){
          if (e.target.closest("a")) return;
          e.preventDefault();
          toggle(card);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
