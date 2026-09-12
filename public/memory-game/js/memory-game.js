(() => {
  "use strict";

  const IMAGE_PATH = "./images/cards/";
  const symbols = Array.from({ length: 32 }, (_, i) => `card-${String(i + 1).padStart(2, "0")}`);

  const $ = (selector) => document.querySelector(selector);

  const startPage = $("#memory-start");
  const gamePage = $("#memory-game-page");
  const grid = $("#memory-grid");
  const pairsEl = $("#memory-pairs");
  const movesEl = $("#memory-moves");
  const timeEl = $("#memory-time");
  const progressEl = $("#memory-progress");
  const pauseModal = $("#memory-pause-modal");
  const winModal = $("#memory-win-modal");
  const toast = $("#memory-toast");

  let gridSize = 4;
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let matched = 0;
  let moves = 0;
  let elapsed = 0;
  let timerId = null;
  let paused = false;
  let toastTimer = null;

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function setGridColumns() {
    grid.style.gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;
  }

  function buildDeck() {
    const pairsNeeded = (gridSize * gridSize) / 2;
    const selected = symbols.slice(0, pairsNeeded);
    return shuffle([...selected, ...selected]).map((symbol, index) => ({
      id: index,
      symbol
    }));
  }

  function makeCard(card) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.setAttribute("aria-label", "Hidden memory card");
    button.dataset.id = String(card.id);
    button.dataset.symbol = card.symbol;

    const inner = document.createElement("span");
    inner.className = "memory-card-inner";

    const front = document.createElement("span");
    front.className = "memory-card-front";

    const back = document.createElement("span");
    back.className = "memory-card-back";

    const image = document.createElement("img");
    image.className = "memory-card-image";
    image.src = `${IMAGE_PATH}${card.symbol}.png`;
    image.alt = "Memory card artwork";
    image.draggable = false;
    image.loading = "eager";

    // If a local artwork file is ever missing, keep the card usable instead of
    // showing a browser broken-image icon.
    image.addEventListener("error", () => {
      image.remove();
      const fallback = document.createElement("span");
      fallback.textContent = "★";
      fallback.style.cssText = "font-size:clamp(28px,6vw,56px);color:#e59b16;";
      back.appendChild(fallback);
    }, { once: true });

    back.appendChild(image);
    inner.append(front, back);
    button.appendChild(inner);
    return button;
  }

  function render() {
    grid.replaceChildren();
    setGridColumns();
    cards = buildDeck();
    cards.forEach((card) => grid.appendChild(makeCard(card)));
  }

  function updateStats() {
    pairsEl.textContent = String(matched);
    movesEl.textContent = String(moves);
    timeEl.textContent = formatTime(elapsed);
    const totalPairs = (gridSize * gridSize) / 2;
    progressEl.style.width = `${(matched / totalPairs) * 100}%`;
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (!paused) {
        elapsed += 1;
        updateStats();
      }
    }, 1000);
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    locked = false;
  }

  function showToast() {
    toast.classList.remove("is-hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("is-hidden"), 900);
  }

  function finishGame() {
    stopTimer();
    $("#memory-result").textContent =
      `Completed in ${moves} moves and ${formatTime(elapsed)}.`;
    winModal.classList.remove("is-hidden");
  }

  function handleCardClick(event) {
    const cardEl = event.target.closest(".memory-card");
    if (!cardEl || locked || paused) return;
    if (cardEl.classList.contains("is-flipped") ||
        cardEl.classList.contains("is-matched")) return;

    cardEl.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = cardEl;
      return;
    }

    secondCard = cardEl;
    moves += 1;
    updateStats();

    const sameCard = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (sameCard) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      matched += 1;
      showToast();
      updateStats();

      if (matched === (gridSize * gridSize) / 2) {
        setTimeout(finishGame, 600);
      } else {
        resetTurn();
      }
      return;
    }

    locked = true;
    const oldFirst = firstCard;
    const oldSecond = secondCard;

    setTimeout(() => {
      oldFirst.classList.remove("is-flipped");
      oldSecond.classList.remove("is-flipped");
      resetTurn();
    }, 850);
  }

  function startGame() {
    const selected = Number($("#memory-grid-size").value);
    gridSize = [2, 4, 6, 8].includes(selected) ? selected : 4;

    matched = 0;
    moves = 0;
    elapsed = 0;
    paused = false;
    locked = false;
    firstCard = null;
    secondCard = null;

    pauseModal.classList.add("is-hidden");
    winModal.classList.add("is-hidden");
    toast.classList.add("is-hidden");
    startPage.classList.add("is-hidden");
    gamePage.classList.remove("is-hidden");

    render();
    updateStats();
    startTimer();
  }

  function pauseGame() {
    if (gamePage.classList.contains("is-hidden") || locked) return;
    paused = true;
    pauseModal.classList.remove("is-hidden");
  }

  function resumeGame() {
    paused = false;
    pauseModal.classList.add("is-hidden");
  }

  function returnToMainPage() {
    stopTimer();
    paused = false;
    locked = false;
    firstCard = null;
    secondCard = null;
    pauseModal.classList.add("is-hidden");
    winModal.classList.add("is-hidden");
    if (window.parent !== window) {
      window.parent.postMessage({ type: "memory-game-close" }, window.location.origin);
      return;
    }
    window.location.href = "../index.html";
  }

  function quitGame() {
    if (window.confirm("Quit the current game? Your progress will be lost.")) {
      returnToMainPage();
    }
  }

  $("#memory-play").addEventListener("click", startGame);
  grid.addEventListener("click", handleCardClick);
  $("#memory-pause").addEventListener("click", pauseGame);
  $("#memory-resume").addEventListener("click", resumeGame);
  $("#memory-restart-pause").addEventListener("click", startGame);
  $("#memory-quit-pause").addEventListener("click", quitGame);
  $("#memory-new-game").addEventListener("click", startGame);
  $("#memory-home").addEventListener("click", returnToMainPage);
  $("#memory-home-win").addEventListener("click", returnToMainPage);
})();
