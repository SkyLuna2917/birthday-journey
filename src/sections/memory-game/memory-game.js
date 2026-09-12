import "./memory-game.css";

export function setupMemoryGame() {
  const button = document.querySelector(".memory-game-btn");
  if (!button) return;

  const overlay = document.createElement("div");
  overlay.className = "memory-game-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="memory-game-backdrop"></div>
    <div class="memory-game-window" role="dialog" aria-modal="true" aria-label="Memory Game">
      <button class="memory-game-close" type="button" aria-label="Close Memory Game">×</button>
      <iframe class="memory-game-frame" src="/memory-game/index.html" title="Memory Game" allowtransparency="true"></iframe>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("memory-game-open");
  };

  const open = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("memory-game-open");
  };

  button.addEventListener("click", open);
  overlay.querySelector(".memory-game-close").addEventListener("click", close);
  overlay.querySelector(".memory-game-backdrop").addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  window.addEventListener("message", (event) => {
    if (event.origin === window.location.origin && event.data?.type === "memory-game-close") {
      close();
    }
  });

  overlay.querySelector(".memory-game-frame").addEventListener("load", () => {
    try {
      const frameWindow = overlay.querySelector(".memory-game-frame").contentWindow;
      const frameDocument = frameWindow.document;
      const homeButtons = frameDocument.querySelectorAll("#memory-home, #memory-home-win");
      homeButtons.forEach((homeButton) => homeButton.addEventListener("click", close));
    } catch {
      // Same-origin Vite page; keep the game usable even if the browser blocks access.
    }
  });
}
