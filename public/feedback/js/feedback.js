document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");

  if (!form) {
    console.error("❌ Feedback form not found.");
    return;
  }

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const feedbackInput = document.getElementById("feedback");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const feedbackError = document.getElementById("feedbackError");

  const submitButton = document.getElementById("submitFeedback");
  const successMessage = document.getElementById("successMessage");

  /* =====================================================
     CLEAR ERROR
     ===================================================== */

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    feedbackError.textContent = "";

    nameInput.removeAttribute("aria-invalid");
    emailInput.removeAttribute("aria-invalid");
    feedbackInput.removeAttribute("aria-invalid");
  }


  /* =====================================================
     VALIDATION
     ===================================================== */

  function validateForm() {
    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const feedback = feedbackInput.value.trim();

    if (!name) {
      nameError.textContent = "Please enter your name.";
      nameInput.setAttribute("aria-invalid", "true");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      emailError.textContent = "Please enter your email.";
      emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    }

    if (!feedback) {
      feedbackError.textContent = "Please write your feedback.";
      feedbackInput.setAttribute("aria-invalid", "true");
      valid = false;
    }

    return valid;
  }


  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    try {
      const formData = new FormData(form);

      /*
       * Make sure Web3Forms receives the correct
       * destination configuration.
       */

      formData.set(
        "access_key",
        "7e1790ce-a43a-49be-8246-d9ec686dc539"
      );

      formData.set(
        "subject",
        "New Feedback — Birthday Journey"
      );

      formData.set(
        "from_name",
        "Birthday Journey"
      );

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      console.log("Web3Forms response:", result);

      if (result.success === true) {

        form.style.display = "none";

        if (successMessage) {
          successMessage.style.display = "block";
        }

        console.log("✅ Feedback submitted successfully.");
      } else {

        console.error(
          "❌ Web3Forms error:",
          result
        );

        alert(
          result.message ||
          "Something went wrong while sending your feedback."
        );

        submitButton.disabled = false;
        submitButton.innerHTML = "<span>✉</span> Send Feedback";
      }

    } catch (error) {

      console.error(
        "❌ Network error:",
        error
      );

      alert(
        "Unable to send feedback. Please check your internet connection and try again."
      );

      submitButton.disabled = false;
      submitButton.innerHTML = "<span>✉</span> Send Feedback";
    }
  });


  /* =====================================================
     REMOVE ERRORS WHILE TYPING
     ===================================================== */

  nameInput.addEventListener("input", () => {
    nameError.textContent = "";
    nameInput.removeAttribute("aria-invalid");
  });

  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.removeAttribute("aria-invalid");
  });

  feedbackInput.addEventListener("input", () => {
    feedbackError.textContent = "";
    feedbackInput.removeAttribute("aria-invalid");
  });


  /* =====================================================
     BACKGROUND VIDEO
     ===================================================== */

  const backgroundVideo = document.querySelector(
    ".feedback-background-video"
  );

  if (backgroundVideo) {
    backgroundVideo.muted = true;

    backgroundVideo.play().catch(() => {
      console.log("Background video autoplay was blocked.");
    });
  }
});