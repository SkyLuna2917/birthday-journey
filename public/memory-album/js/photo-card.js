/* =========================================================
   PHOTO MEMORIES
   IMAGE + VIDEO SUPPORT
========================================================= */

(() => {
  "use strict";


  /* =======================================================
     MEMORY LIST

     IMAGE:
     type: "image"
     src: "./images/example.png"
     song: "./audio/example.mp3"

     VIDEO:
     type: "video"
     src: "./videos/example.mp4"

     For videos:
     - The video's OWN audio is used.
     - No separate song is played.
     - Native video controls are enabled.
  ======================================================= */

  const items = [

    {
      type: "video",
      src: "./videos/memory2.mp4",
      song: "",
      message: "Parent's love is pure, endless, and true.They stand by us through every joy and sorrow.Their blessings give us strength to face life. No love in the world can ever match a parent's love. ❤️"
    },

    {
      type: "video",
      src: "./videos/memory1.mp4",
      song: "",
      message: "A girl's beauty is not only in her appearance but also in her kindness and confidence.Her smile can brighten the day and her words can bring happiness.True beauty comes from a good heart, a positive attitude, and self-respect. You are beautiful in your own unique way."
    },

    {
      type: "video",
      src: "./videos/memory3.mp4",
      song: "",
      message: " Many more happy return of the  day Madem."
    },

    {
      type: "video",
      src: "./videos/memory4.mp4",
      song: "",
      message: "self love"
    },

    {
      type: "image",
      src: "./images/memory1.jpg",
      song: "",
      message: "happy family"
    },

      {
      type: "image",
      src: "./images/memory2.jpg",
      song: "",
      message: "sister's vibe"
    },

      {
      type: "image",
      src: "./images/memory3.jpg",
      song: "./audio/memory3.mp3",
      message: "you as you"
    },

  ];


  /* =======================================================
     STATE
  ======================================================= */

  let current = 0;

  let audio = null;

  let token = 0;


  /* =======================================================
     ELEMENT HELPER
  ======================================================= */

  const $ = (id) => {
    return document.getElementById(id);
  };


  /* =======================================================
     STOP SEPARATE AUDIO
  ======================================================= */

  function stopAudio() {

    token++;

    if (!audio) {
      return;
    }

    audio.pause();

    audio.currentTime = 0;

    audio.removeAttribute("src");

    audio.load();

    audio = null;
  }


  /* =======================================================
     STOP VIDEO
  ======================================================= */

  function stopVideo() {

    const video = $("video");

    if (!video) {
      return;
    }

    video.pause();

    video.currentTime = 0;

    video.removeAttribute("src");

    video.removeAttribute("controls");

    video.load();

    video.classList.remove("is-visible");
  }


  /* =======================================================
     STOP ALL MEDIA
  ======================================================= */

  function stopMedia() {

    stopAudio();

    stopVideo();
  }


  /* =======================================================
     PLAY IMAGE BACKGROUND AUDIO
  ======================================================= */

  function playAudio(song) {

    stopAudio();

    /*
      No song = nothing to play.
    */

    if (!song) {
      return;
    }

    const currentToken = token;

    audio = new Audio(song);

    audio.loop = true;

    audio.volume = 1;

    const promise = audio.play();

    if (promise) {

      promise.catch(() => {
        /*
          Browser may block autoplay.
          User interaction will allow playback.
        */
      });

    }


    audio.addEventListener("error", () => {

      if (currentToken === token) {

        console.warn(
          "Could not load audio:",
          song
        );

      }

    });

  }


  /* =======================================================
     SHOW DOTS
  ======================================================= */

  function showDots() {

    const dots = $("dots");

    if (!dots) {
      return;
    }

    dots.replaceChildren();


    items.forEach((_, i) => {

      const button =
        document.createElement("button");

      button.className =
        "dot" +
        (i === current ? " active" : "");

      button.type = "button";

      button.setAttribute(
        "aria-label",
        `Memory ${i + 1}`
      );

      button.addEventListener(
        "click",
        () => show(i)
      );

      dots.appendChild(button);

    });

  }


  /* =======================================================
     SHOW MEMORY
  ======================================================= */

  function show(index) {

    current =
      (index + items.length) %
      items.length;

    const item =
      items[current];

    const frame =
      $("frame");

    const image =
      $("photo");

    const video =
      $("video");


    if (!frame || !image || !video) {

      console.error(
        "Photo Memories: required media elements are missing."
      );

      return;
    }


    /* -------------------------------------------------------
       Stop previous media
    ------------------------------------------------------- */

    stopMedia();


    /* -------------------------------------------------------
       Hide both media elements
    ------------------------------------------------------- */

    image.classList.remove(
      "is-visible"
    );

    video.classList.remove(
      "is-visible"
    );


    /* -------------------------------------------------------
       Restart frame animation
    ------------------------------------------------------- */

    frame.classList.remove(
      "change"
    );

    void frame.offsetWidth;

    frame.classList.add(
      "change"
    );


    /* =======================================================
       IMAGE MEMORY
    ======================================================= */

    if (item.type === "image") {

      image.src =
        item.src;

      image.alt =
        `Memory ${current + 1}`;

      image.classList.add(
        "is-visible"
      );


      /*
        Image uses the separate
        background song.
      */

      playAudio(
        item.song
      );

    }


    /* =======================================================
       VIDEO MEMORY
    ======================================================= */

    else if (item.type === "video") {

      /*
        IMPORTANT:
        Video audio is enabled.
      */

      video.muted = false;

      video.volume = 1;

      video.loop = false;

      video.autoplay = false;

      video.playsInline = true;


      /*
        Enable native controls.
      */

      video.setAttribute(
        "controls",
        ""
      );

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "webkit-playsinline",
        ""
      );


      /*
        Set video source.
      */

      video.src =
        item.src;


      /*
        Wait until enough video
        data has loaded.
      */

      video.onloadeddata = () => {

        /*
          Make sure the user hasn't
          already changed memory.
        */

        if (
          current !==
          items.indexOf(item)
        ) {
          return;
        }


        video.classList.add(
          "is-visible"
        );


        /*
          Try to start video.

          Since the user arrived here
          by clicking Next/Previous,
          browser autoplay is more likely
          to be allowed.
        */

        video.play().catch(() => {

          /*
            If autoplay with audio is
            blocked, controls remain visible.

            User can simply press Play.
          */

        });

      };


      /* -----------------------------------------------------
         Video error
      ----------------------------------------------------- */

      video.onerror = () => {

        video.classList.remove(
          "is-visible"
        );

        console.error(
          "Could not load video:",
          item.src
        );

      };


      /*
        Load video.
      */

      video.load();

    }


    /* =======================================================
       TEXT / COUNTER
    ======================================================= */

    const message =
      $("msg");

    const count =
      $("count");


    if (message) {

      message.textContent =
        item.message || "";

    }


    if (count) {

      count.textContent =
        `${current + 1} / ${items.length}`;

    }


    /* =======================================================
       DOTS
    ======================================================= */

    showDots();

  }


  /* =======================================================
     NEXT
  ======================================================= */

  const next =
    $("next");

  if (next) {

    next.addEventListener(
      "click",
      () => {

        show(
          current + 1
        );

      }
    );

  }


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const prev =
    $("prev");

  if (prev) {

    prev.addEventListener(
      "click",
      () => {

        show(
          current - 1
        );

      }
    );

  }


  /* =======================================================
     PAGE CLEANUP
  ======================================================= */

  window.addEventListener(
    "pagehide",
    stopMedia
  );

  window.addEventListener(
    "beforeunload",
    stopMedia
  );


  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "hidden"
      ) {

        stopMedia();

      }

    }
  );


  /* =======================================================
     INITIAL MEMORY
  ======================================================= */

  showDots();

  show(0);

})();