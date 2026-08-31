"use strict";

/*
===========================================================
 AQUARIUM ADVENTURE
 Real Fish Photography
 main.js
===========================================================
*/

const fish = [
    {
        name: "Clownfish",
        scientific: "Amphiprion percula",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/A._percula.jpg",
        facts:
            "Clownfish live among sea anemones. Their protective mucus coating allows them to live safely among the anemone's stinging tentacles."
    },

    {
        name: "Blue Tang",
        scientific: "Paracanthurus hepatus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paracanthurus%20hepatus%20in%20National%20Marine%20Aquarium.jpg",
        facts:
            "The Blue Tang is famous for its bright blue body and dark markings. It spends much of its time grazing on algae around coral reefs."
    },

    {
        name: "Yellow Tang",
        scientific: "Zebrasoma flavescens",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Yellow%20Tang.jpg",
        facts:
            "Yellow Tangs are bright yellow surgeonfish that live around tropical reefs. They are important algae grazers."
    },

    {
        name: "Lionfish",
        scientific: "Pterois volitans",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Common%20lion%20fish%20Pterois%20volitans.jpg",
        facts:
            "Lionfish have spectacular fan-like fins and venomous spines. They are ambush predators that eat smaller fish and crustaceans."
    },

    {
        name: "Moorish Idol",
        scientific: "Zanclus cornutus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moorish%20idol%20Zanclus%20cornutus.jpg",
        facts:
            "The Moorish Idol has bold black, white and yellow markings and a long dorsal filament. It is commonly associated with coral reefs."
    },

    {
        name: "Angelfish",
        scientific: "Holacanthus ciliaris",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Angelfish.jpg",
        facts:
            "Queen Angelfish are colorful reef fish found in the tropical western Atlantic. Adults commonly inhabit coral and rocky reefs."
    },

    {
        name: "Butterflyfish",
        scientific: "Chaetodon",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reef%20Butterflyfish.jpg",
        facts:
            "Butterflyfish are small, colorful reef fish with flattened bodies. Many species use their narrow snouts to pick food from coral and rocks."
    },

    {
        name: "Triggerfish",
        scientific: "Balistoides conspicillum",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Balistoides%20conspicillum%20352992832.jpg",
        facts:
            "The Clown Triggerfish has striking spots and yellow markings. Triggerfish have powerful jaws that help them eat hard-shelled prey."
    },

    {
        name: "Pufferfish",
        scientific: "Arothron hispidus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Arothron%20hispidus%20%28white-spotted%20puffer%20fish%29%20at%20Prague%20sea%20aquarium.jpg",
        facts:
            "Pufferfish can inflate their bodies when threatened. The white-spotted puffer occurs in tropical Indo-Pacific waters."
    },

    {
        name: "Mandarin Fish",
        scientific: "Synchiropus splendidus",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mandarin%20fish%20%28Synchiropus%20splendidus%29%20%2845103629692%29.jpg",
        facts:
            "Mandarin Fish are famous for their spectacular blue, orange and green patterns. They live close to coral reefs and feed near the seafloor."
    }
];


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const fishGrid = document.getElementById("fish-grid");

const modal = document.getElementById("modal");

const modalImage =
    document.getElementById("modal-image");

const modalName =
    document.getElementById("modal-name");

const modalFacts =
    document.getElementById("modal-facts");

const closeModal =
    document.getElementById("close-modal");


/* =========================================================
   RENDER FISH
========================================================= */

function renderFish() {

    if (!fishGrid) {
        console.error(
            "Aquarium Adventure: #fish-grid was not found."
        );

        return;
    }

    fishGrid.innerHTML = "";

    fish.forEach((item, index) => {

        const card =
            document.createElement("article");

        card.className = "fish-card";

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.setAttribute(
            "role",
            "button"
        );

        card.setAttribute(
            "aria-label",
            `Learn about ${item.name}`
        );


        /* -----------------------------------------
           Image
        ----------------------------------------- */

        const image =
            document.createElement("img");

        image.src = item.image;

        image.alt =
            item.name;

        image.loading =
            "lazy";


        /*
          If a Wikimedia image is unavailable,
          use a clean aquarium placeholder instead
          of showing a broken-image icon.
        */

        image.onerror = function () {

            image.onerror = null;

            image.src =
                createFallbackImage(
                    item.name
                );

        };


        /* -----------------------------------------
           Information
        ----------------------------------------- */

        const info =
            document.createElement("div");

        info.className =
            "fish-info";


        const title =
            document.createElement("h2");

        title.textContent =
            item.name;


        const scientific =
            document.createElement("p");

        const italic =
            document.createElement("em");

        italic.textContent =
            item.scientific;

        scientific.appendChild(
            italic
        );


        info.appendChild(title);

        info.appendChild(
            scientific
        );


        card.appendChild(image);

        card.appendChild(info);


        /* -----------------------------------------
           Mouse
        ----------------------------------------- */

        card.addEventListener(
            "click",
            function () {

                openFish(index);

            }
        );


        /* -----------------------------------------
           Keyboard
        ----------------------------------------- */

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


        fishGrid.appendChild(
            card
        );

    });

}


/* =========================================================
   OPEN FISH
========================================================= */

function openFish(index) {

    const item =
        fish[index];

    if (!item) {
        return;
    }


    modalImage.src =
        item.image;

    modalImage.alt =
        item.name;


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


    /*
      Handle an unavailable large image.
    */

    modalImage.onerror =
        function () {

            modalImage.onerror =
                null;

            modalImage.src =
                createFallbackImage(
                    item.name
                );

        };

}


/* =========================================================
   CLOSE FISH
========================================================= */

function closeFish() {

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


/* =========================================================
   FALLBACK IMAGE
========================================================= */

function createFallbackImage(
    fishName
) {

    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="900"
            height="600"
            viewBox="0 0 900 600"
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
                        stop-color="#087eae"
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


            <circle
                cx="120"
                cy="100"
                r="8"
                fill="white"
                opacity=".5"
            />

            <circle
                cx="180"
                cy="160"
                r="5"
                fill="white"
                opacity=".4"
            />

            <circle
                cx="760"
                cy="120"
                r="7"
                fill="white"
                opacity=".4"
            />


            <ellipse
                cx="450"
                cy="300"
                rx="180"
                ry="100"
                fill="#ff9f1c"
            />


            <polygon
                points="280,300 150,200 150,400"
                fill="#ff7b00"
            />


            <circle
                cx="535"
                cy="270"
                r="12"
                fill="#111"
            />


            <text
                x="450"
                y="500"
                text-anchor="middle"
                fill="white"
                font-family="Arial"
                font-size="34"
                font-weight="bold"
            >
                ${fishName}
            </text>

        </svg>

    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   EVENTS
========================================================= */

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
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("open")
        ) {

            closeFish();

        }

    }
);


/* =========================================================
   START
========================================================= */

renderFish();
