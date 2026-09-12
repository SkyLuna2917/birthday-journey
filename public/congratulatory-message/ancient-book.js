const overlay = document.querySelector("#congratulatoryOverlay");
const closeButton = document.querySelector("#closeCongratulatory");

const spreads = [...document.querySelectorAll(".book-spread")];

const previousButton = document.querySelector("#bookPrevious");
const nextButton = document.querySelector("#bookNext");
const pageIndicator = document.querySelector("#bookPageIndicator");


/* =========================================================
   CONGRATULATORY MESSAGES
   ========================================================= */

const pageMessages = [
  [
    "Dear,",

    "A day where I saw you for the first time. I don't know what happened, but the view felt so special without even knowing each other. I hope the charm remains the same in your life forever."
  ],

  [
    "Page two,",

    "Do you remember the day we were strangers on the same floor? It became so memorable. That day was simple, happy, and full of good vibes. Moments like these are the ones we end up missing the most. — 13/09/2023 — a memory close to my heart. ✨",

    "Always,",

    "We were not on a journey; we were simply flowing through life."
  ],

  [
    "Let me take you back to a place where you never expected to be on this day,",

    "It's your childhood, years ago, where your smile was genuine and came straight from the heart.",

    "Three pages cannot possibly hold every memory, every laugh, or every beautiful moment waiting ahead.",

    "Golden days of life."
  ]
];


/* =========================================================
   STATE
   ========================================================= */

let currentPage = 1;

let timers = [];

let runId = 0;

let touchStartX = 0;


/* =========================================================
   TIMER CONTROL
   ========================================================= */

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}


/* =========================================================
   CLOSE
   ========================================================= */

function closeMessage() {
  clearTimers();

  runId++;

  window.parent.postMessage(
    {
      type: "close-congratulatory"
    },
    "*"
  );
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function updateNav() {
  if (pageIndicator) {
    pageIndicator.textContent = `${currentPage} / 3`;
  }

  if (previousButton) {
    previousButton.disabled = currentPage === 1;
  }

  if (nextButton) {
    nextButton.disabled = currentPage === 3;
  }
}


/* =========================================================
   BUILD MESSAGE
   =========================================================
   
   IMPORTANT:
   
   Each WORD gets its own wrapper.
   
   Inside that wrapper, every LETTER gets its own
   animation span.
   
   Therefore:
   
   something
   
   stays together as one word.
   
   But the letters still appear one by one.
   ========================================================= */

function buildMessage(page) {
  const area = document.querySelector(
    `#messageWritingArea${page}`
  );

  if (!area) {
    return [];
  }

  area.innerHTML = "";

  const messages = pageMessages[page - 1];

  const characters = [];


  messages.forEach((text, index) => {

    const line = document.createElement("div");

    line.className = "message-line";


    if (index === messages.length - 1) {
      line.classList.add("message-signature");
    }


    /*
      Split the sentence into words.
    */

    const words = text.trim().split(/\s+/);


    words.forEach((word, wordIndex) => {

      /*
        This wrapper keeps the ENTIRE WORD together.
      */

      const wordWrapper = document.createElement("span");

      wordWrapper.className = "writing-word";


      /*
        Now create the animation one letter at a time.
      */

      [...word].forEach((character) => {

        const characterSpan =
          document.createElement("span");

        characterSpan.className = "writing-char";

        characterSpan.textContent = character;

        wordWrapper.appendChild(characterSpan);

        characters.push(characterSpan);
      });


      line.appendChild(wordWrapper);


      /*
        Add a real space AFTER the complete word.
      */

      if (wordIndex < words.length - 1) {

        line.appendChild(
          document.createTextNode(" ")
        );

      }

    });


    area.appendChild(line);

  });


  return characters;
}


/* =========================================================
   LETTER-BY-LETTER WRITING ANIMATION
   ========================================================= */

async function writePage(page, myRun) {

  const characters = buildMessage(page);


  /*
    Small pause before writing begins.
  */

  await new Promise((resolve) => {

    const timer = setTimeout(resolve, 280);

    timers.push(timer);

  });


  if (myRun !== runId) {
    return;
  }


  /*
    Reveal EVERY LETTER individually.
  */

  for (const character of characters) {

    if (myRun !== runId) {
      return;
    }


    character.classList.add("revealed");


    const value = character.textContent;


    let delay = 18;


    /*
      Slightly slower after punctuation.
    */

    if (value === " ") {
      delay = 5;
    }

    if (/[,.!?]/.test(value)) {
      delay = 65;
    }

    if (/—/.test(value)) {
      delay = 80;
    }


    await new Promise((resolve) => {

      const timer = setTimeout(resolve, delay);

      timers.push(timer);

    });

  }

}


/* =========================================================
   SHOW PAGE
   ========================================================= */

function showPage(page) {

  if (page < 1 || page > 3) {
    return;
  }


  currentPage = page;

  runId++;

  const myRun = runId;

  clearTimers();


  spreads.forEach((spread, index) => {

    const active = index === page - 1;

    spread.classList.toggle(
      "active",
      active
    );

    spread.setAttribute(
      "aria-hidden",
      String(!active)
    );

  });


  updateNav();

  writePage(page, myRun);
}


/* =========================================================
   NEXT
   ========================================================= */

function next() {

  if (currentPage < 3) {
    showPage(currentPage + 1);
  }

}


/* =========================================================
   PREVIOUS
   ========================================================= */

function previous() {

  if (currentPage > 1) {
    showPage(currentPage - 1);
  }

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

if (closeButton) {

  closeButton.addEventListener(
    "click",
    closeMessage
  );

}


if (nextButton) {

  nextButton.addEventListener(
    "click",
    next
  );

}


if (previousButton) {

  previousButton.addEventListener(
    "click",
    previous
  );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeMessage();
    }

    if (event.key === "ArrowRight") {
      next();
    }

    if (event.key === "ArrowLeft") {
      previous();
    }

  }
);


/* =========================================================
   TOUCH / SWIPE
   ========================================================= */

if (overlay) {

  overlay.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0]?.clientX ?? 0;

    },
    {
      passive: true
    }
  );


  overlay.addEventListener(
    "touchend",
    (event) => {

      const end =
        event.changedTouches[0]?.clientX ??
        touchStartX;

      const distance =
        end - touchStartX;


      if (Math.abs(distance) >= 45) {

        if (distance < 0) {
          next();
        } else {
          previous();
        }

      }

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   START
   ========================================================= */

updateNav();

showPage(1);