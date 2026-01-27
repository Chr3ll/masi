/* =========================
   File: assets/js/reviews.js
   Project: MASI Static Prototype
   Purpose (demo today):
     - Render reviews on the page
     - Save/reload reviews via localStorage (client-side demo)
     - Toggle “…More” expand/collapse with clamp class

   Purpose (easy DB later):
     - The ONLY part you swap is the "adapter" (list/create).
       Everything else (validation + rendering) stays the same.

   ========================= */

(function () {
  "use strict";

  /* =========================
     EDIT HERE (Future DB Swap)
     Replace this adapter with real API calls, e.g.:
       - list():  GET  /api/reviews   -> [{...}]
       - create(): POST /api/reviews  -> {status:"pending", ...}
     ========================= */
  const ReviewsAdapter = {
    STORAGE_KEY: "masi_reviews_v2",

    async list() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        const items = raw ? JSON.parse(raw) : [];
        return Array.isArray(items) ? items : [];
      } catch {
        return [];
      }
    },

    async create(review) {
      const current = await this.list();
      current.unshift(review);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
      return review;
    },

    async seedIfEmpty(defaults) {
      const current = await this.list();
      if (current.length) return current;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
  };

  /* =========================
     DOM References (must exist)
     ========================= */
  const form = document.getElementById("reviewForm");
  const list = document.getElementById("reviewsList");
  const err = document.getElementById("reviewError");
  const note = document.getElementById("reviewNote");

  if (!form || !list || !err || !note) return;

  /* =========================
     Helpers
     ========================= */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatTime(date) {
    // Keep simple + readable. Works in all modern browsers.
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function makeId() {
    // Simple stable ID for demo. DB will replace this.
    return "rev_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  /* =========================
     Rendering (single source of truth)
     ========================= */
  function buildCard(r) {
    const fullName = `${r.fname || ""} ${r.lname || ""}`.trim();

    const article = document.createElement("article");
    article.className = "review-card";
    article.setAttribute("data-review-id", r.id || "");

    // NOTE: Maintain your required format:
    // Fname Lname / Job / Time / "Review text …More"
    article.innerHTML = `
      <div class="review-head">
        <div class="review-name">${escapeHtml(fullName)}</div>
        <div class="review-job">${escapeHtml(r.job || "")}</div>
        <div class="review-time">${escapeHtml(r.time || "")}</div>
      </div>

      <p class="review-quote is-clamped">${escapeHtml(r.text || "")}</p>

      <div class="review-actions">
        <button type="button" class="review-more">…More</button>
      </div>
    `;

    const quote = article.querySelector(".review-quote");
    const moreBtn = article.querySelector(".review-more");

    // Show “…More” only if clamping actually hides content
    requestAnimationFrame(() => {
      const needsClamp = quote.scrollHeight > quote.clientHeight + 2;
      if (!needsClamp) {
        moreBtn.style.display = "none";
      }
    });

    moreBtn.addEventListener("click", () => {
      quote.classList.toggle("is-clamped");
      moreBtn.textContent = quote.classList.contains("is-clamped") ? "…More" : "Less";
    });

    return article;
  }

  function renderAll(items) {
    list.innerHTML = "";
    const frag = document.createDocumentFragment();
    items.forEach((r) => frag.appendChild(buildCard(r)));
    list.appendChild(frag);
  }

  /* =========================
     Init
     ========================= */
  const DEFAULT_REVIEWS = [
    {
      id: makeId(),
      fname: "Sarah",
      lname: "O'Connor",
      job: "Facilities Manager",
      time: "Jan 12, 2026, 09:10",
      text: "Very professional install team. Clean cabling, clear handover, and everything tested properly."
    },
    {
      id: makeId(),
      fname: "David",
      lname: "Khan",
      job: "Operations Lead",
      time: "Dec 03, 2025, 14:25",
      text: "Fast response and good communication. The system setup was explained in a way our staff could actually use."
    },
    {
      id: makeId(),
      fname: "Amina",
      lname: "Hassan",
      job: "Site Supervisor",
      time: "Nov 18, 2025, 11:42",
      text: "Strong attention to detail. The project was delivered on time with minimal disruption to site activity."
    }
  ];

  (async function boot() {
    const reviews = await ReviewsAdapter.seedIfEmpty(DEFAULT_REVIEWS);
    renderAll(reviews);
  })();

  /* =========================
     Submit
     ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    note.textContent = "";

    const fd = new FormData(form);
    const fname = (fd.get("fname") || "").toString().trim();
    const lname = (fd.get("lname") || "").toString().trim();
    const job = (fd.get("job") || "").toString().trim();
    const text = (fd.get("text") || "").toString().trim();

    if (!fname || !lname || !job || !text) {
      err.textContent = "Please fill First name, Last name, Job, and the Review text.";
      return;
    }

    // Demo record structure (DB-ready fields)
    const record = {
      id: makeId(),
      fname,
      lname,
      job,
      text,
      createdAt: new Date().toISOString(),
      time: formatTime(new Date()),
      status: "published" // EDIT HERE (future): likely "pending"
    };

    await ReviewsAdapter.create(record);

    // Re-render from storage to keep one consistent flow
    const updated = await ReviewsAdapter.list();
    renderAll(updated);

    form.reset();
    note.textContent = "Review added (saved in this browser).";
  });
})();
