export function setupExperiencePopup() {
  const popup = document.querySelector("#experiencePopup");
  const continueButton = document.querySelector("#experiencePopupContinue");

  if (!popup || !continueButton) {
    console.warn("Experience Popup: required elements were not found.");
    return;
  }

  /*
   * Show only on small/mobile viewport.
   */
  function isMobileView() {
    return window.matchMedia("(max-width: 700px)").matches;
  }

  /*
   * Prevent the popup from appearing repeatedly
   * during the same browser session.
   */
  const popupAlreadyShown =
    sessionStorage.getItem("birthdayExperiencePopupShown") === "true";

  if (isMobileView() && !popupAlreadyShown) {
    setTimeout(() => {
      popup.classList.add("is-visible");
      popup.setAttribute("aria-hidden", "false");

      sessionStorage.setItem(
        "birthdayExperiencePopupShown",
        "true"
      );
    }, 500);
  }

  function closePopup() {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
  }

  continueButton.addEventListener("click", closePopup);

  /*
   * Optional: tapping outside the card also closes it.
   */
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });
}