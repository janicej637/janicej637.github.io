
"use strict";

/* =========================================================
   AQUARIUM ADVENTURE
   Complete main.js
========================================================= */


/* =========================================================
   FISH DATA
========================================================= */

const fish = [

    {
        name: "Clownfish",
        scientific: "Amphiprion percula",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/A._percula.jpg",
        facts:
            "Clownfish live among sea anemones. Their protective mucus coating helps them live safely among the anemone's stinging tentacles."
    },

    {
        name: "Blue Tang",
        scientific: "Paracanthurus hepatus",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Paracanthurus%20hepatus%20in%20National%20Marine%20Aquarium.jpg",
        facts:
            "Blue Tangs are bright blue reef fish. They spend much of their time grazing on algae around coral reefs."
    },

    {
        name: "Yellow Tang",
        scientific: "Zebrasoma flavescens",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Yellow%20Tang.jpg",
        facts:
            "Yellow Tangs are brilliant yellow surgeonfish that live around tropical coral reefs and rocky areas."
    },

    {
        name: "Lionfish",
        scientific: "Pterois volitans",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Common%20lion%20fish%20Pterois%20volitans.jpg",
        facts:
            "Lionfish have spectacular fan-like fins and venomous spines. They are ambush predators that eat smaller fish and crustaceans."
    },

    {
        name: "Moorish Idol",
        scientific: "Zanclus cornutus",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Moorish%20idol%20Zanclus%20cornutus.jpg",
        facts:
            "Moorish Idols have distinctive black, white and yellow markings and are commonly associated with tropical coral reefs."
    },

    {
        name: "Queen Angelfish",
        scientific: "Holacanthus ciliaris",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Angelfish.jpg",
        facts:
            "Queen Angelfish are colorful tropical reef fish found in the western Atlantic Ocean."
    },

    {
        name: "Butterflyfish",
        scientific: "Chaetodon",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Reef%20Butterflyfish.jpg",
        facts:
            "Butterflyfish are colorful reef fish with flattened bodies. Many species use their narrow snouts to pick food from coral and rocks."
    },

    {
        name: "Clown Triggerfish",
        scientific: "Balistoides conspicillum",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Balistoides%20conspicillum%20352992832.jpg",
        facts:
            "Clown Triggerfish have spectacular white spots, yellow markings and powerful jaws used to crush hard-shelled prey."
    },

    {
        name: "White-spotted Pufferfish",
        scientific: "Arothron hispidus",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Arothron%20hispidus%20%28white-spotted%20puffer%20fish%29%20at%20Prague%20sea%20aquarium.jpg",
        facts:
            "Pufferfish can inflate their bodies when threatened, making themselves much harder for predators to swallow."
    },

    {
        name: "Mandarin Fish",
        scientific: "Synchiropus splendidus",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mandarin%20fish%20%28Synchiropus%20splendidus%29%20%2845103629692%29.jpg",
        facts:
            "Mandarin Fish are famous for spectacular blue, orange and green patterns. They live close to coral reefs and feed near the seafloor."
    }

];


/* =========================================================
   GET PAGE ELEMENTS
========================================================= */

const grid =
    document.getElementById("fish-grid");

const modal =
    document.getElementById("modal");

const modalImage =
    document.getElementById("modal-image");

const modalName =
    document.getElementById("modal-name");

const modalFacts =
    document.getElementById("modal-facts");

const closeModal =
    document.getElementById("close-modal");

const dayToggle =
    document.getElementById("dayToggle");

const nightToggle =
    document.getElementById("nightToggle");

const soundToggle =
    document.getElementById("soundToggle");


/* =========================================================
   RENDER FISH CARDS
========================================================= */

function renderFish() {

    if (!grid) {

        console.error(
            "ERROR: #fish-grid was not found."
        );

        return;

    }

    grid.innerHTML = "";


    fish.forEach(
        (item, index) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "fish-card";

            card.tabIndex = 0;


            /* -------------------------
               IMAGE
            ------------------------- */

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                item.image;

            image.alt =
                item.name;

            image.loading =
                "lazy";


            /*
             * If a remote image cannot be loaded,
             * display a simple fallback.
             */

            image.onerror =
                function () {

                    image.onerror =
                        null;

                    image.src =
                        createFallbackImage(
                            item.name
                        );

                };


            /* -------------------------
               INFORMATION
            ------------------------- */

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "fish-info";


            const title =
                document.createElement(
                    "h2"
                );

            title.textContent =
                item.name;


            const scientific =
                document.createElement(
                    "p"
                );


            const italic =
                document.createElement(
                    "em"
                );

            italic.textContent =
                item.scientific;


            scientific.appendChild(
                italic
            );


            info.appendChild(
                title
            );

            info.appendChild(
                scientific
            );


            card.appendChild(
                image
            );

            card.appendChild(
                info
            );


            /* -------------------------
               CLICK
            ------------------------- */

            card.addEventListener(
                "click",
                function () {

                    openFish(index);

                }
            );


            /* -------------------------
               KEYBOARD
            ------------------------- */

            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openFish(index);

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   OPEN FISH INFORMATION
========================================================= */

function openFish(index) {

    const item =
        fish[index];

    if (
        !item ||
        !modal
    ) {

        return;

    }


    modalImage.src =
        item.image;

    modalImage.alt =
        item.name;


    modalImage.onerror =
        function () {

            modalImage.onerror =
                null;

            modalImage.src =
                createFallbackImage(
                    item.name
                );

        };


    modalName.textContent =
        item.name;

    modalFacts.textContent =
        item.facts;


    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE FISH INFORMATION
========================================================= */

function closeFish() {

    if (!modal) {

        return;

    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeFish
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeFish();

            }

        }
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeFish();

        }

    }
);


/* =========================================================
   DAY MODE
========================================================= */

function setDay() {

    document.body.classList.remove(
        "night"
    );


    if (dayToggle) {

        dayToggle.classList.add(
            "active"
        );

    }


    if (nightToggle) {

        nightToggle.classList.remove(
            "active"
        );

    }


    localStorage.setItem(
        "aquariumMode",
        "day"
    );

}


/* =========================================================
   NIGHT MODE
========================================================= */

function setNight() {

    document.body.classList.add(
        "night"
    );


    if (nightToggle) {

        nightToggle.classList.add(
            "active"
        );

    }


    if (dayToggle) {

        dayToggle.classList.remove(
            "active"
        );

    }


    localStorage.setItem(
        "aquariumMode",
        "night"
    );

}


/* =========================================================
   DAY/NIGHT BUTTONS
========================================================= */

if (dayToggle) {

    dayToggle.addEventListener(
        "click",
        setDay
    );

}


if (nightToggle) {

    nightToggle.addEventListener(
        "click",
        setNight
    );

}


/* =========================================================
   UNDERWATER RUMBLE AUDIO
========================================================= */

/*
 * IMPORTANT:
 *
 * Put this MP3 in the SAME folder as:
 *
 *     index16.html
 *     main.js
 *
 * The exact filename must be:
 *
 * pwlpl-underwater-rumble-sound-effect-521068.mp3
 *
 * The "./" makes it clear that the browser should look
 * in the current GitHub Pages directory.
 */

const underwaterAudio =
    new Audio(
        "./pwlpl-underwater-rumble-sound-effect-521068.mp3"
    );


/*
 * Loop continuously.
 */

underwaterAudio.loop =
    true;


/*
 * Initial volume.
 *
 * 0.35 = 35%
 */

underwaterAudio.volume =
    0.35;


let soundOn =
    false;


/* =========================================================
   START UNDERWATER SOUND
========================================================= */

async function startOceanSound() {

    if (!underwaterAudio) {

        return;

    }


    try {

        /*
         * Reset to beginning when starting.
         */

        underwaterAudio.currentTime =
            0;


        /*
         * Play() is called as a result of the
         * user's button click.
         */

        await underwaterAudio.play();


        soundOn =
            true;


        if (soundToggle) {

            soundToggle.textContent =
                "🔊 Underwater Sound ON";

            soundToggle.classList.add(
                "active"
            );

        }


        localStorage.setItem(
            "oceanSound",
            "on"
        );


    } catch (error) {

        console.error(
            "Unable to play underwater sound:",
            error
        );


        soundOn =
            false;


        if (soundToggle) {

            soundToggle.textContent =
                "⚠️ Sound File Error";

            soundToggle.classList.remove(
                "active"
            );

        }


        /*
         * Give the user a useful console message.
         */

        console.error(
            "Make sure this file exists beside index16.html:",
            "pwlpl-underwater-rumble-sound-effect-521068.mp3"
        );

    }

}


/* =========================================================
   STOP UNDERWATER SOUND
========================================================= */

function stopOceanSound() {

    if (!underwaterAudio) {

        return;

    }


    underwaterAudio.pause();


    /*
     * Reset to beginning.
     */

    underwaterAudio.currentTime =
        0;


    soundOn =
        false;


    if (soundToggle) {

        soundToggle.textContent =
            "🔇 Underwater Sound";

        soundToggle.classList.remove(
            "active"
        );

    }


    localStorage.setItem(
        "oceanSound",
        "off"
    );

}


/* =========================================================
   SOUND BUTTON
========================================================= */

if (soundToggle) {

    soundToggle.addEventListener(
        "click",
        function () {

            if (soundOn) {

                stopOceanSound();

            } else {

                startOceanSound();

            }

        }
    );

}


/* =========================================================
   HANDLE AUDIO ERRORS
========================================================= */

underwaterAudio.addEventListener(
    "error",
    function () {

        console.error(
            "The underwater MP3 could not be loaded."
        );


        console.error(
            "Expected filename:",
            "pwlpl-underwater-rumble-sound-effect-521068.mp3"
        );


        if (soundToggle) {

            soundToggle.textContent =
                "⚠️ MP3 Not Found";

        }

    }
);


/* =========================================================
   HANDLE AUDIO END
========================================================= */

underwaterAudio.addEventListener(
    "ended",
    function () {

        /*
         * Normally this will never execute because
         * loop=true.
         *
         * It is included as an additional safeguard.
         */

        if (soundOn) {

            underwaterAudio.currentTime =
                0;

            underwaterAudio.play()
                .catch(
                    function (error) {

                        console.error(
                            "Unable to restart audio:",
                            error
                        );

                    }
                );

        }

    }
);


/* =========================================================
   FALLBACK FISH IMAGE
========================================================= */

function createFallbackImage(
    name
) {

    const safeName =
        String(name)
            .replace(
                /[<>&"]/g,
                ""
            );


    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="900"
            height="600"
        >

            <defs>

                <linearGradient
                    id="water"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#087ea4"
                    />

                    <stop
                        offset="100%"
                        stop-color="#021522"
                    />

                </linearGradient>

            </defs>


            <rect
                width="900"
                height="600"
                fill="url(#water)"
            />


            <ellipse
                cx="450"
                cy="300"
                rx="190"
                ry="105"
                fill="#ff9f1c"
            />


            <polygon
                points="280,300 130,205 130,395"
                fill="#ff7b00"
            />


            <circle
                cx="540"
                cy="270"
                r="13"
                fill="#111"
            />


            <text
                x="450"
                y="510"
                text-anchor="middle"
                fill="white"
                font-family="Arial"
                font-size="34"
                font-weight="bold"
            >
                ${safeName}
            </text>

        </svg>

    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   RESTORE DAY/NIGHT SETTING
========================================================= */

const savedMode =
    localStorage.getItem(
        "aquariumMode"
    );


if (
    savedMode === "night"
) {

    setNight();

} else {

    setDay();

}


/* =========================================================
   RESTORE SOUND BUTTON STATE
========================================================= */

/*
 * We do NOT automatically play the sound here.
 *
 * The browser requires a user gesture before audio can
 * begin, so the user must press the sound button.
 */

const savedSound =
    localStorage.getItem(
        "oceanSound"
    );


if (
    savedSound === "on" &&
    soundToggle
) {

    soundToggle.textContent =
        "🔊 Start Underwater Sound";

}


/* =========================================================
   INITIALIZE
========================================================= */

renderFish();

console.log(
    "Aquarium Adventure initialized."
);
