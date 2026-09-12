// Section 05 — Congratulatory Message
// Keep this section independent from the master application's JavaScript.
console.log("Birthday Journey: Congratulatory Message loaded");


document.querySelector("[data-close-congratulatory]")?.addEventListener("click", (event) => {
  event.preventDefault();
  window.parent.postMessage({ type: "close-congratulatory" }, "*");
});
