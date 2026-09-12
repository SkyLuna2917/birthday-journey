export function setupPuzzle() {
  const puzzleButton =
    document.querySelector('[data-action="puzzle"]');

  if (!puzzleButton) {
    console.warn("Puzzle button not found");
    return;
  }

  puzzleButton.addEventListener("click", () => {
    window.location.href = "/puzzle/index.html";
  });
}