import "./home.css";

export function setupHome() {
  const windLayer = document.querySelector(".wind-layer");
  if (windLayer) {
    const leafCount = window.matchMedia("(max-width: 600px)").matches ? 10 : 18;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < leafCount; i += 1) {
      const leaf = document.createElement("span");
      leaf.className = "wind-leaf";
      leaf.style.setProperty("--size", `${8 + Math.random() * 15}px`);
      leaf.style.setProperty("--top", `${5 + Math.random() * 85}%`);
      leaf.style.setProperty("--opacity", `${0.25 + Math.random() * 0.45}`);
      leaf.style.setProperty("--blur", `${Math.random() * 1.2}px`);
      leaf.style.setProperty("--rotation", `${Math.random() * 360}deg`);
      leaf.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
      leaf.style.setProperty("--delay", `${Math.random() * -15}s`);
      fragment.appendChild(leaf);
    }
    windLayer.appendChild(fragment);
  }

  const toast = document.querySelector(".connector-toast");
  const buttons = document.querySelectorAll(".journey-btn");
  let toastTimer;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "memory-game" || action === "memory-album" || action === "theme") return;
      if (!toast) return;
      toast.textContent = `${button.textContent.trim()} connector ready — Section ${action === "language" ? "07" : action === "theme" ? "06" : action === "memory-album" ? "04" : action === "congratulatory" ? "05" : action === "music" ? "08" : action === "memory-game" ? "03" : action === "calendar" ? "10" : action === "quiz" ? "11" : action === "invite" ? "12" : ""} will connect here.`;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    });
  });
}
