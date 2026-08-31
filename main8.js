"use strict";

/* =========================================================
   FISH DATA
========================================================= */

const fish = [
    {
        name: "Clownfish",
        scientific: "Amphiprion percula",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/A._percula.jpg",
        facts: "Clownfish live among sea anemones and have a protective mucus coating that helps them live among the anemone's stinging tentacles."
    },
    {
        name: "Blue Tang",
        scientific: "Paracanthurus hepatus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paracanthurus%20hepatus%20in%20National%20Marine%20Aquarium.jpg",
        facts: "Blue Tangs are bright blue reef fish that spend much of their time grazing on algae."
    },
    {
        name: "Yellow Tang",
        scientific: "Zebrasoma flavescens",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Yellow%20Tang.jpg",
        facts: "Yellow Tangs are tropical surgeonfish known for their brilliant yellow color."
    },
    {
        name: "Lionfish",
        scientific: "Pterois volitans",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Common%20lion%20fish%20Pterois%20volitans.jpg",
        facts: "Lionfish have beautiful fan-like fins and venomous spines. They are ambush predators."
    },
    {
        name: "Moorish Idol",
        scientific: "Zanclus cornutus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moorish%20idol%20Zanclus%20cornutus.jpg",
        facts: "Moorish Idols have distinctive black, white and yellow markings and are commonly associated with coral reefs."
    },
    {
        name: "Angelfish",
        scientific: "Holacanthus ciliaris",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Angelfish.jpg",
        facts: "Queen Angelfish are colorful tropical reef fish found in the western Atlantic."
    },
    {
        name: "Butterflyfish",
        scientific: "Chaetodon",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reef%20Butterflyfish.jpg",
        facts: "Butterflyfish are small, colorful reef fish with flattened bodies and narrow snouts."
    },
    {
        name: "Triggerfish",
        scientific: "Balistoides conspicillum",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Balistoides%20conspicillum%20352992832.jpg",
        facts: "Clown Triggerfish have powerful jaws and spectacular black, white and yellow markings."
    },
    {
        name: "Pufferfish",
        scientific: "Arothron hispidus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Arothron%20hispidus%20%28white-spotted%20puffer%20fish%29%20at%20Prague%20sea%20aquarium.jpg",
        facts: "Pufferfish can inflate their bodies when threatened, making them much more difficult for predators to swallow."
    },
    {
        name: "Mandarin Fish",
        scientific: "Synchiropus splendidus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mandarin%20fish%20%28Synchiropus%20splendidus%29%20%2845103629692%29.jpg",
        facts: "Mandarin Fish are famous for their spectacular blue, orange and green patterns."
    }
];


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const grid = document.getElementById("fish-grid");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalFacts = document.getElementById("modal-facts");
const closeModal = document.getElementById("close-modal");

const dayToggle = document.getElementById("dayToggle");
const nightToggle = document.getElementById("nightToggle");
const soundToggle = document.getElementById("soundToggle");


/* =========================================================
   RENDER FISH
========================================================= */

function renderFish() {

    if (!grid) return;

    grid.innerHTML = "";

    fish.forEach((item, index) => {

        const card = document.createElement("article");

        card.className = "fish-card";
        card.tabIndex = 0;

        const image = document.createElement("img");

        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";

        image.onerror = function () {

            image.onerror = null;

            image.src = createFallbackImage(item.name);

        };


        const info = document.createElement("div");

        info.className = "fish-info";


        const title = document.createElement("h2");

        title.textContent = item.name;


        const scientific = document.createElement("p");

        const italic = document.createElement("em");

        italic.textContent = item.scientific;

        scientific.appendChild(italic);


        info.appendChild(title);
        info.appendChild(scientific);

        card.appendChild(image);
        card.appendChild(info);


        card.addEventListener("click", () => {

            openFish(index);

        });


        card.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openFish(index);

            }

        });


        grid.appendChild(card);

    });

}


/* =========================================================
   MODAL
========================================================= */

function openFish(index) {

    const item = fish[index];

    if (!item || !modal) return;

    modalImage.src = item.image;
    modalImage.alt = item.name;

    modalName.textContent = item.name;

    modalFacts.textContent = item.facts;

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeFish() {

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

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
        event => {

            if (event.target === modal) {

                closeFish();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeFish();

        }

    }
);


/* =========================================================
   DAY / NIGHT
========================================================= */

function setDay() {

    document.body.classList.remove("night");

    if (dayToggle) {

        dayToggle.classList.add("active");

    }

    if (nightToggle) {

        nightToggle.classList.remove("active");

    }

    localStorage.setItem(
        "aquariumMode",
        "day"
    );

}


function setNight() {

    document.body.classList.add("night");

    if (nightToggle) {

        nightToggle.classList.add("active");

    }

    if (dayToggle) {

        dayToggle.classList.remove("active");

    }

    localStorage.setItem(
        "aquariumMode",
        "night"
    );

}


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
   OCEAN SOUND ENGINE
   Uses Web Audio API instead of an external MP3.
========================================================= */

let audioContext = null;

let masterGain = null;

let oceanNoise = null;

let oceanFilter = null;

let oceanLFO = null;

let oceanLFOGain = null;

let soundOn = false;


/*
 * Creates a looping filtered noise sound.
 *
 * The combination of noise + filtering + slow amplitude
 * modulation produces a soft ocean/wave ambience.
 */

function createOceanSound() {

    if (audioContext) {

        return;

    }


    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        if (soundToggle) {

            soundToggle.textContent =
                "⚠️ Audio Not Supported";

        }

        return;

    }


    audioContext =
        new AudioContext();


    masterGain =
        audioContext.createGain();

    masterGain.gain.value =
        0.16;


    /*
     * Create 4 seconds of random noise.
     */

    const duration = 4;

    const bufferSize =
        audioContext.sampleRate *
        duration;


    const noiseBuffer =
        audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate
        );


    const data =
        noiseBuffer.getChannelData(0);


    for (
        let i = 0;
        i < bufferSize;
        i++
    ) {

        data[i] =
            Math.random() * 2 - 1;

    }


    oceanNoise =
        audioContext.createBufferSource();

    oceanNoise.buffer =
        noiseBuffer;

    oceanNoise.loop =
        true;


    /*
     * Low-pass filter removes harsh high frequencies.
     */

    oceanFilter =
        audioContext.createBiquadFilter();

    oceanFilter.type =
        "lowpass";

    oceanFilter.frequency.value =
        950;

    oceanFilter.Q.value =
        0.7;


    /*
     * Slow LFO creates the rise and fall of waves.
     */

    oceanLFO =
        audioContext.createOscillator();

    oceanLFO.type =
        "sine";

    oceanLFO.frequency.value =
        0.075;


    oceanLFOGain =
        audioContext.createGain();

    oceanLFOGain.gain.value =
        0.12;


    oceanLFO.connect(
        oceanLFOGain
    );

    oceanLFOGain.connect(
        masterGain.gain
    );


    oceanNoise.connect(
        oceanFilter
    );

    oceanFilter.connect(
        masterGain
    );

    masterGain.connect(
        audioContext.destination
    );


    oceanNoise.start();

    oceanLFO.start();

}


/* =========================================================
   TURN OCEAN SOUND ON
========================================================= */

async function startOceanSound() {

    try {

        createOceanSound();

        if (!audioContext) {

            return;

        }


        /*
         * resume() is important because browsers can
         * create an AudioContext in the suspended state.
         */

        if (
            audioContext.state ===
            "suspended"
        ) {

            await audioContext.resume();

        }


        masterGain.gain.cancelScheduledValues(
            audioContext.currentTime
        );


        masterGain.gain.setTargetAtTime(
            0.16,
            audioContext.currentTime,
            0.25
        );


        soundOn = true;


        if (soundToggle) {

            soundToggle.textContent =
                "🔊 Ocean Sounds ON";

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
            "Ocean audio error:",
            error
        );


        if (soundToggle) {

            soundToggle.textContent =
                "⚠️ Sound Error";

        }

    }

}


/* =========================================================
   TURN OCEAN SOUND OFF
========================================================= */

async function stopOceanSound() {

    if (!audioContext) {

        soundOn = false;

        return;

    }


    masterGain.gain.cancelScheduledValues(
        audioContext.currentTime
    );


    masterGain.gain.setTargetAtTime(
        0,
        audioContext.currentTime,
        0.18
    );


    soundOn = false;


    if (soundToggle) {

        soundToggle.textContent =
            "🔇 Ocean Sounds";

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
        async () => {

            if (soundOn) {

                await stopOceanSound();

            } else {

                await startOceanSound();

            }

        }
    );

}


/* =========================================================
   FALLBACK FISH IMAGE
========================================================= */

function createFallbackImage(name) {

    const safeName =
        name.replace(
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


if (savedMode === "night") {

    setNight();

} else {

    setDay();

}


/*
 * We intentionally DO NOT automatically start audio.
 *
 * Browsers require a user gesture such as a click before
 * starting audible Web Audio.
 */

if (
    localStorage.getItem(
        "oceanSound"
    ) === "on"
) {

    if (soundToggle) {

        soundToggle.textContent =
            "🔊 Start Ocean Sounds";

    }

}


/* =========================================================
   START APPLICATION
========================================================= */

renderFish();
