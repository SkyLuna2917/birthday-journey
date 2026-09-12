// src/shared/audio.js
// Main-page-only Birthday Journey music system.

const SONGS = [
  "/audio/song-1.mp3",
  "/audio/song-2.mp3",
];

let player = null;
let currentSong = 0;
let muted = false;
let initialized = false;

function createControls() {
  if (document.querySelector("#birthday-music-controls")) return;

  const controls = document.createElement("div");
  controls.id = "birthday-music-controls";
  controls.innerHTML = `
    <button class="music-control" data-music-action="toggle" aria-label="Mute music" title="Mute / Unmute">🎵</button>
    <button class="music-control" data-music-action="previous" aria-label="Previous song" title="Previous song">⏮</button>
    <button class="music-control" data-music-action="next" aria-label="Next song" title="Next song">⏭</button>
  `;

  document.body.appendChild(controls);

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-music-action]");
    if (!button) return;

    const action = button.dataset.musicAction;
    if (action === "toggle") toggleMute();
    if (action === "previous") playSong(currentSong - 1);
    if (action === "next") playSong(currentSong + 1);
  });
}

function updateMuteIcon() {
  const button = document.querySelector('[data-music-action="toggle"]');
  if (!button) return;

  button.textContent = muted ? "🔇" : "🎵";
  button.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
}

function playSong(index, autoplay = true) {
  if (!player) return;

  currentSong = (index + SONGS.length) % SONGS.length;
  player.src = SONGS[currentSong];
  player.muted = muted;
  player.load();

  if (autoplay) {
    const attempt = player.play();
    if (attempt?.catch) attempt.catch(() => {
      // Browser blocked autoplay. A later user interaction will retry it.
    });
  }
}

function toggleMute() {
  muted = !muted;

  if (player) {
    player.muted = muted;
    if (!muted) {
      const attempt = player.play();
      if (attempt?.catch) attempt.catch(() => {});
    }
  }

  updateMuteIcon();
}

function startAfterInteraction() {
  if (!player || !player.paused) return;

  const attempt = player.play();
  if (attempt?.catch) attempt.catch(() => {});
}

export function initBirthdayMusic() {
  // Music is intentionally initialized only when main.js calls this.
  if (initialized) return;
  initialized = true;

  player = new Audio();
  player.preload = "auto";
  player.volume = 1;

  player.addEventListener("ended", () => {
    playSong(currentSong + 1);
  });

  createControls();
  updateMuteIcon();
  playSong(0);

  // Fallback for browsers that block audible autoplay.
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, startAfterInteraction, {
      once: true,
      passive: true,
    });
  });
}

export function stopBirthdayMusic() {
  if (!player) return;
  player.pause();
  player.currentTime = 0;
}

export function destroyBirthdayMusic() {
  stopBirthdayMusic();

  document.querySelector("#birthday-music-controls")?.remove();

  if (player) {
    player.src = "";
    player.load();
  }

  player = null;
  initialized = false;
}
