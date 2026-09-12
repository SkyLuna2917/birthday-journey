export function setupCongratulatoryMessage() {
  const button = document.querySelector('[data-action="congratulatory"]');
  if (!button) return;

  let overlay = null;

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("congratulatory-open");
    setTimeout(() => {
      overlay?.remove();
      overlay = null;
    }, 220);
  };

  button.addEventListener("click", () => {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.id = "congratulatory-overlay";
    overlay.className = "congratulatory-overlay";

    overlay.innerHTML = `
      <div class="congratulatory-backdrop"></div>
      <div class="congratulatory-window" role="dialog" aria-modal="true" aria-label="Congratulatory Message">
        <button class="congratulatory-close" type="button" aria-label="Close Congratulatory Message">×</button>
        <iframe
          class="congratulatory-frame"
          src="/congratulatory-message/ancient-book.html"
          title="Congratulatory Message"
        ></iframe>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("congratulatory-open");

    overlay.querySelector(".congratulatory-backdrop").addEventListener("click", close);
    overlay.querySelector(".congratulatory-close").addEventListener("click", close);

    requestAnimationFrame(() => overlay.classList.add("is-open"));
  });

  window.addEventListener("message", (event) => {
    if (event.data?.type === "close-congratulatory") close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay) close();
  });
}
