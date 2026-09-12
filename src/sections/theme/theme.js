export function setupTheme() {
  const button = document.querySelector('[data-action="theme"]');
  const video = document.getElementById("theme-background-video");
  const world = document.getElementById("birthday-world");

  if (!button || !video || !world) {
    console.warn("Theme: required elements were not found.");
    return;
  }


  /* ============================================================
     THEME VIDEOS
     ============================================================ */

  const themes = [
    "/themes/theme1.mp4",
    "/themes/theme2.mp4",
    "/themes/theme3.mp4",
    "/themes/theme4.mp4",
    "/themes/theme5.mp4",
    "/themes/theme6.mp4",
    "/themes/theme7.mp4",
    "/themes/theme8.mp4",
    "/themes/theme9.mp4",
    "/themes/theme10.mp4",
    "/themes/theme11.mp4"
  ];


  /* ============================================================
     CURRENT THEME
     ============================================================ */

  let currentIndex = Number(
    localStorage.getItem("birthday-theme-index")
  );

  if (
    !Number.isInteger(currentIndex) ||
    currentIndex < 0 ||
    currentIndex >= themes.length
  ) {
    currentIndex = -1;
  }


  let changing = false;


  /* ============================================================
     LOAD VIDEO
     ============================================================ */

  function loadVideo(src) {

    return new Promise((resolve, reject) => {

      /*
         Keep the current background visible
         while the next video loads.
      */

      video.classList.remove("is-active");

      video.pause();


      /*
         Set the new source.
      */

      video.src = src;

      video.muted = true;

      video.loop = true;

      video.autoplay = true;

      video.playsInline = true;

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "webkit-playsinline",
        ""
      );


      /* ========================================================
         VIDEO READY
         ======================================================== */

      const ready = async () => {

        try {

          /*
             Start the video first.
          */

          await video.play().catch(() => {});


          /*
             IMPORTANT:

             Only NOW switch the world into
             theme-video mode.

             This prevents the blank screen.
          */

          world.classList.add(
            "theme-video-active"
          );


          /*
             Give the browser one frame before
             starting the fade.
          */

          requestAnimationFrame(() => {

            requestAnimationFrame(() => {

              video.classList.add(
                "is-active"
              );

            });

          });


          resolve();

        } catch (error) {

          reject(error);

        }

      };


      /* ========================================================
         VIDEO ERROR
         ======================================================== */

      const failed = () => {

        video.classList.remove(
          "is-active"
        );

        reject(
          new Error(
            `Could not load theme video: ${src}`
          )
        );

      };


      video.addEventListener(
        "canplay",
        ready,
        { once: true }
      );

      video.addEventListener(
        "error",
        failed,
        { once: true }
      );


      /*
         Start loading.
      */

      video.load();

    });

  }


  /* ============================================================
     CHANGE THEME
     ============================================================ */

  async function changeTheme(index) {

    if (changing) {
      return;
    }


    currentIndex =
      (index + themes.length) %
      themes.length;


    const src =
      themes[currentIndex];


    changing = true;


    /*
       IMPORTANT:

       Do NOT add theme-video-active here.

       The current background stays visible
       while the new video loads.
    */


    try {

      await loadVideo(src);


      /*
         Save selected theme.
      */

      localStorage.setItem(
        "birthday-theme-index",
        String(currentIndex)
      );

      localStorage.setItem(
        "birthday-theme",
        src
      );


    } catch (error) {

      console.error(
        "Theme video error:",
        error
      );


      /*
         If loading fails, keep the current
         background working.
      */

      world.classList.remove(
        "theme-video-active"
      );

      video.classList.remove(
        "is-active"
      );


      world.classList.add(
        "theme-video-error"
      );


      setTimeout(() => {

        world.classList.remove(
          "theme-video-error"
        );

      }, 2500);

    } finally {

      changing = false;

    }

  }


  /* ============================================================
     THEME BUTTON
     ============================================================ */

  button.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();


      /*
         One click = next theme.
      */

      changeTheme(
        currentIndex + 1
      );

    }
  );


  /* ============================================================
     RESTORE LAST THEME
     ============================================================ */

  const savedIndex =
    localStorage.getItem(
      "birthday-theme-index"
    );


  if (savedIndex !== null) {

    const index =
      Number(savedIndex);


    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < themes.length
    ) {

      currentIndex = index;


      const src =
        themes[currentIndex];


      /*
         Restore the previous theme.

         The normal load function is used so
         the same fade-in behavior is applied.
      */

      loadVideo(src)
        .catch((error) => {

          console.error(
            "Could not restore theme:",
            error
          );

        });

    }

  }

}