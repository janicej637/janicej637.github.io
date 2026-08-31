"use strict";


/* =========================================================
   FISH DATA
========================================================= */

const fish = [

    {
        name:"Clownfish",
        scientific:"Amphiprion percula",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/A._percula.jpg",
        facts:"Clownfish live among sea anemones. Their protective mucus coating allows them to live safely among the anemone's stinging tentacles."
    },

    {
        name:"Blue Tang",
        scientific:"Paracanthurus hepatus",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Paracanthurus%20hepatus%20in%20National%20Marine%20Aquarium.jpg",
        facts:"The Blue Tang is famous for its bright blue body and dark markings. It spends much of its time grazing on algae around coral reefs."
    },

    {
        name:"Yellow Tang",
        scientific:"Zebrasoma flavescens",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Yellow%20Tang.jpg",
        facts:"Yellow Tangs are bright yellow surgeonfish that live around tropical reefs. They are important algae grazers."
    },

    {
        name:"Lionfish",
        scientific:"Pterois volitans",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Common%20lion%20fish%20Pterois%20volitans.jpg",
        facts:"Lionfish have spectacular fan-like fins and venomous spines. They are ambush predators that eat smaller fish and crustaceans."
    },

    {
        name:"Moorish Idol",
        scientific:"Zanclus cornutus",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Moorish%20idol%20Zanclus%20cornutus.jpg",
        facts:"The Moorish Idol has bold black, white and yellow markings and a long dorsal filament. It is commonly associated with coral reefs."
    },

    {
        name:"Angelfish",
        scientific:"Holacanthus ciliaris",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Angelfish.jpg",
        facts:"Queen Angelfish are colorful reef fish found in the tropical western Atlantic. Adults commonly inhabit coral and rocky reefs."
    },

    {
        name:"Butterflyfish",
        scientific:"Chaetodon",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Reef%20Butterflyfish.jpg",
        facts:"Butterflyfish are small, colorful reef fish with flattened bodies. Many species use their narrow snouts to pick food from coral and rocks."
    },

    {
        name:"Triggerfish",
        scientific:"Balistoides conspicillum",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Balistoides%20conspicillum%20352992832.jpg",
        facts:"The Clown Triggerfish has striking spots and yellow markings. Triggerfish have powerful jaws that help them eat hard-shelled prey."
    },

    {
        name:"Pufferfish",
        scientific:"Arothron hispidus",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Arothron%20hispidus%20%28white-spotted%20puffer%20fish%29%20at%20Prague%20sea%20aquarium.jpg",
        facts:"Pufferfish can inflate their bodies when threatened. The white-spotted puffer occurs in tropical Indo-Pacific waters."
    },

    {
        name:"Mandarin Fish",
        scientific:"Synchiropus splendidus",
        image:"https://commons.wikimedia.org/wiki/Special:FilePath/Mandarin%20fish%20%28Synchiropus%20splendidus%29%20%2845103629692%29.jpg",
        facts:"Mandarin Fish are famous for their spectacular blue, orange and green patterns. They live close to coral reefs and feed near the seafloor."
    }

];


/* =========================================================
   ELEMENTS
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
   RENDER FISH
========================================================= */

function renderFish(){

    if(!grid){
        return;
    }

    grid.innerHTML = "";

    fish.forEach((item,index)=>{

        const card =
            document.createElement("article");

        card.className =
            "fish-card";

        card.tabIndex = 0;

        const image =
            document.createElement("img");

        image.src =
            item.image;

        image.alt =
            item.name;

        image.loading =
            "lazy";


        image.onerror = function(){

            image.onerror = null;

            image.src =
                createFallbackImage(
                    item.name
                );

        };


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


        card.addEventListener(
            "click",
            ()=>{
                openFish(index);
            }
        );


        card.addEventListener(
            "keydown",
            event=>{

                if(
                    event.key === "Enter" ||
                    event.key === " "
                ){

                    event.preventDefault();

                    openFish(index);

                }

            }
        );


        grid.appendChild(card);

    });

}


/* =========================================================
   FISH MODAL
========================================================= */

function openFish(index){

    const item =
        fish[index];

    if(!item){
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
}


function closeFish(){

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
   DAY / NIGHT
========================================================= */

function setDay(){

    document.body.classList.remove(
        "night"
    );

    dayToggle.classList.add(
        "active"
    );

    nightToggle.classList.remove(
        "active"
    );

    localStorage.setItem(
        "aquariumMode",
        "day"
    );
}


function setNight(){

    document.body.classList.add(
        "night"
    );

    nightToggle.classList.add(
        "active"
    );

    dayToggle.classList.remove(
        "active"
    );

    localStorage.setItem(
        "aquariumMode",
        "night"
    );
}


dayToggle.addEventListener(
    "click",
    setDay
);


nightToggle.addEventListener(
    "click",
    setNight
);


/* =========================================================
   OCEAN SOUND
========================================================= */

/*
    The browser will not allow an audio file to autoplay
    without user interaction.

    This button starts/stops the ocean ambience after the
    visitor clicks it.

    Replace the URL below with your preferred ocean-wave
    MP3 if you have one.
*/

const oceanAudio =
    new Audio(
        "https://cdn.pixabay.com/audio/2022/05/13/audio_257f8f5d7c.mp3"
    );

oceanAudio.loop =
    true;

oceanAudio.volume =
    0.35;


let soundOn = false;


function toggleSound(){

    if(!soundOn){

        oceanAudio.play()
            .then(()=>{

                soundOn = true;

                soundToggle.textContent =
                    "🔊 Ocean Sounds ON";

                soundToggle.classList.add(
                    "active"
                );

                localStorage.setItem(
                    "oceanSound",
                    "on"
                );

            })
            .catch(()=>{

                soundToggle.textContent =
                    "🔊 Click Again for Sound";

            });

    }else{

        oceanAudio.pause();

        soundOn = false;

        soundToggle.textContent =
            "🔇 Ocean Sounds";

        soundToggle.classList.remove(
            "active"
        );

        localStorage.setItem(
            "oceanSound",
            "off"
        );

    }

}


soundToggle.addEventListener(
    "click",
    toggleSound
);


/* =========================================================
   MODAL EVENTS
========================================================= */

closeModal.addEventListener(
    "click",
    closeFish
);


modal.addEventListener(
    "click",
    event=>{

        if(
            event.target === modal
        ){

            closeFish();

        }

    }
);


document.addEventListener(
    "keydown",
    event=>{

        if(
            event.key === "Escape"
        ){

            closeFish();

        }

    }
);


/* =========================================================
   FALLBACK IMAGE
========================================================= */

function createFallbackImage(
    name
){

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
                ${name}
            </text>

        </svg>
    `;

    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   RESTORE SAVED SETTINGS
========================================================= */

const savedMode =
    localStorage.getItem(
        "aquariumMode"
    );


if(savedMode === "night"){
    setNight();
}else{
    setDay();
}


/*
   Sound is deliberately NOT automatically started.
   The browser requires user interaction before audio
   playback.
*/

const savedSound =
    localStorage.getItem(
        "oceanSound"
    );


if(savedSound === "on"){

    soundToggle.textContent =
        "🔊 Ocean Sounds";

}


/* =========================================================
   START
========================================================= */

renderFish();
