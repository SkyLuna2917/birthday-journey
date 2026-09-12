import "./styles/global.css";
import "./styles/global.css";
import "./shared/audio.css";
import { initBirthdayMusic } from "./shared/audio.js";
import { setupHome } from "./sections/home/home.js";

import { setupCountdown } from "./sections/countdown/countdown.js";
import countdownHtml from "./sections/countdown/countdown.html?raw";
import { setupPuzzle } from "./sections/puzzle/puzzle.js";


import { setupMemoryGame } from "./sections/memory-game/memory-game.js";
import { setupTheme } from "./sections/theme/theme.js";
import { setupMemoryAlbum } from "./sections/memory-album/memory-album.js";
import { setupCongratulatoryMessage } from "./sections/congratulatory-message/congratulatory-message.js";
import { setupExperiencePopup } from "./sections/experience-popup/experience-popup.js";

const world = document.querySelector("#birthday-world");

world.innerHTML = `  <!-- Mobile Best Experience Popup -->
  <div id="experiencePopup" class="experience-popup" aria-hidden="true">
    <div class="experience-popup-card" role="dialog" aria-modal="true" aria-labelledby="experiencePopupTitle">

      <div class="experience-popup-icon">🖥️</div>

      <h2 id="experiencePopupTitle">✨ Best Experience</h2>

      <p>
        For a better experience, view this page in
        <strong>Desktop Mode</strong> or on a
        <strong>desktop / laptop</strong>.
      </p><button id="experiencePopupContinue" type="button">
        Continue Anyway
      </button></div></div>
  <div class="scene-background" aria-hidden="true"></div>
  <div class="scene-overlay" aria-hidden="true"></div>
  <div class="ambient-glow glow-one" aria-hidden="true"></div>
  <div class="ambient-glow glow-two" aria-hidden="true"></div>
  <div class="stars" aria-hidden="true"></div>
  <div class="wind-layer" aria-hidden="true"></div>

  <section class="hero-content" aria-labelledby="heroTitle">
    <div class="eyebrow">A LITTLE JOURNEY MADE WITH LOVE</div>
    <h1 id="heroTitle">Birthday Journey</h1>
    <p class="hero-message">
      Every button opens a different little memory, moment, or surprise.
    </p>
  </section>

  ${countdownHtml}

  <nav class="button-layer" aria-label="Birthday Journey navigation">

    <button class="journey-btn language-btn" data-action="theme" type="button">
      🎨 Theme
    </button>

    <button class="journey-btn memory-album-btn" data-action="memory-album" type="button">
      📷 Memory Album
    </button>

    <button class="journey-btn congratulatory-btn" data-action="congratulatory" type="button">
      💌 Years Back
    </button>
    
    <button class="journey-btn memory-game-btn" data-action="memory-game" type="button">
      🎮 Memory Game
    </button>

    <button
  class="journey-btn calendar-btn"
  type="button"
  onclick="window.location.href='/puzzle/index.html'"
>
  🧩 Puzzle
</button>

  
    <button
  class="journey-btn quiz-btn"
  type="button"
  onclick="window.location.href='/wishes/index.html'"
>
  💖 My Wishes for You
</button>

   <button
  class="journey-btn invite-btn" type="button" onclick="window.location.href='/feedback/index.html'">
  💬 Feedback
</button>
  </nav>
  <div class="connector-toast" role="status" aria-live="polite"></div>

  <footer class="scene-footer" aria-hidden="true">
    <span>THE JOURNEY BEGINS HERE</span>
    <span class="footer-line"></span>
    <span>01</span>
  </footer>
`;

setupHome();
setupCountdown();
setupMemoryGame();
setupTheme();
setupMemoryAlbum();
setupCongratulatoryMessage();
setupPuzzle();
initBirthdayMusic();
setupExperiencePopup();