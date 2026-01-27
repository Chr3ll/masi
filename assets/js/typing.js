// assets/js/typing.js
// Typing effect (no dependencies)

(() => {
  const phrases = [
    "Logistics & Distribution",
    "Engineering & Integration",
    "Media Solutions",
    "Sustainable Tech",
    "Management Services",
    "International Solutions",
  ];

  const el = document.getElementById("typing-text");
  if (!el) return;

  // Prevent duplication if fallback text exists
  el.textContent = "";

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  async function type(text, speed){
    for (const ch of text){
      el.textContent += ch;
      await wait(speed);
    }
  }

  async function erase(speed){
    while (el.textContent.length){
      el.textContent = el.textContent.slice(0, -1);
      await wait(speed);
    }
  }

  async function loop(){
    let i = 0;
    while (true){
      await type(phrases[i], 70);
      await wait(1400);
      await erase(40);
      await wait(300);
      i = (i + 1) % phrases.length;
    }
  }

  document.addEventListener("DOMContentLoaded", loop);
})();
