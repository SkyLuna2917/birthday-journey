import "./countdown.css";

// 🎂 Exact birthday
const birthdayDate = new Date("2026-09-13T00:00:00");

// 🎂 Birth date and time
const birthDate = new Date("2002-09-13T01:15:00");

let countdownInterval = null;
let birthdayMode = true;


/* =========================================
   GET COUNTDOWN ELEMENTS
========================================= */

function getCountdownElements() {
    return {
        container: document.querySelector(".countdown-container"),
        box: document.querySelector(".countdown-box"),
        message: document.querySelector(".special-day-message"),
        valuesContainer: document.querySelector(".countdown-values")
    };
}


/* =========================================
   CREATE COUNTDOWN BOXES
========================================= */

function createBoxes(values, labels) {
    const elements = getCountdownElements();

    if (!elements.valuesContainer) {
        return;
    }

    elements.valuesContainer.innerHTML = values
        .map((value, index) => `
            <div>
                <strong>${String(value).padStart(2, "0")}</strong>
                <span>${labels[index]}</span>
            </div>
        `)
        .join("");
}


/* =========================================
   BIRTHDAY COUNTDOWN
   DAYS / HOURS / MINUTES / SECONDS
========================================= */

function getBirthdayDifference(now) {

    const difference =
        birthdayDate.getTime() - now.getTime();

    if (difference <= 0) {
        return null;
    }

    const totalSeconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds
    };
}


/* =========================================
   LIFE COUNTDOWN
   YEARS / MONTHS / DAYS / HOURS / MINUTES / SECONDS
========================================= */

function getLifeDifference(now) {

    let years =
        now.getFullYear() -
        birthDate.getFullYear();

    let months =
        now.getMonth() -
        birthDate.getMonth();

    let days =
        now.getDate() -
        birthDate.getDate();

    let hours =
        now.getHours() -
        birthDate.getHours();

    let minutes =
        now.getMinutes() -
        birthDate.getMinutes();

    let seconds =
        now.getSeconds() -
        birthDate.getSeconds();


    // Seconds
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }


    // Minutes
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }


    // Hours
    if (hours < 0) {
        hours += 24;
        days--;
    }


    // Days
    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            );

        days += previousMonth.getDate();
    }


    // Months
    if (months < 0) {
        months += 12;
        years--;
    }


    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    };
}


/* =========================================
   SHOW BIRTHDAY COUNTDOWN
========================================= */

function showBirthdayCountdown(data) {

    const elements =
        getCountdownElements();

    if (!elements.container) {
        return;
    }


    // Message
    if (elements.message) {
        elements.message.textContent =
            "SPECIAL DAY IS ABOUT TO ARRIVE";
    }


    // Remove life mode
    elements.container.classList.remove(
        "life-countdown"
    );


    // Four boxes only
    createBoxes(
        [
            data.days,
            data.hours,
            data.minutes,
            data.seconds
        ],
        [
            "DAYS",
            "HOURS",
            "MINUTES",
            "SECONDS"
        ]
    );
}


/* =========================================
   SHOW LIFE COUNTDOWN
========================================= */

function showLifeCountdown(data) {

    const elements =
        getCountdownElements();

    if (!elements.container) {
        return;
    }


    // Life mode
    elements.container.classList.add(
        "life-countdown"
    );


    // Birthday message
    if (elements.message) {
        elements.message.textContent =
            "🎉 HAPPY BIRTHDAY MADEM 🎉";
    }


    // Six boxes
    createBoxes(
        [
            data.years,
            data.months,
            data.days,
            data.hours,
            data.minutes,
            data.seconds
        ],
        [
            "YEARS",
            "MONTHS",
            "DAYS",
            "HOURS",
            "MINUTES",
            "SECONDS"
        ]
    );
}


/* =========================================
   UPDATE TIMER
========================================= */

function updateCountdown() {

    const now = new Date();


    /*
     * BEFORE BIRTHDAY
     */

    if (now < birthdayDate) {

        birthdayMode = true;

        const difference =
            getBirthdayDifference(now);

        if (difference) {
            showBirthdayCountdown(
                difference
            );
        }

        return;
    }


    /*
     * BIRTHDAY HAS ARRIVED
     */

    if (birthdayMode) {

        birthdayMode = false;

        console.log(
            "🎉 HAPPY BIRTHDAY MADEM 🎉"
        );
    }


    /*
     * AFTER BIRTHDAY
     * SHOW LIFE COUNTDOWN
     */

    const lifeDifference =
        getLifeDifference(now);

    showLifeCountdown(
        lifeDifference
    );
}


/* =========================================
   START COUNTDOWN
========================================= */

export function setupCountdown() {

    // Prevent duplicate timers
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }


    // Run immediately
    updateCountdown();


    // Update every second
    countdownInterval =
        setInterval(
            updateCountdown,
            1000
        );
}