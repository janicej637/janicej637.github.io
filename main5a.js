
"use strict";

/*
===========================================================
 TRIORINGO — MAIN5A.JS
 Matched specifically to the supplied index17.html
===========================================================
*/


/* =========================================================
   GAME STATE
========================================================= */

const state = {
    currentQuestionIndex: 0,
    xp: 0,
    sfxEnabled: true,

    scores: {
        visual: 0,
        auditory: 0,
        kinesthetic: 0,
        structured: 0
    },

    generatedReport: {
        summary: "",
        strategies: []
    },

    minigameIndex: 0,
    activeQuestions: [],
    answered: false
};


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

function getAudioContext() {

    if (audioContext) {
        return audioContext;
    }

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            console.warn("Web Audio is not supported.");
            return null;
        }

        audioContext = new AudioContext();

        return audioContext;

    } catch (error) {

        console.warn(
            "Could not create audio context:",
            error
        );

        return null;
    }
}


async function playAudioTone(
    frequency,
    waveType,
    duration
) {

    if (!state.sfxEnabled) {
        return;
    }

    const ctx = getAudioContext();

    if (!ctx) {
        return;
    }

    try {

        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type =
            waveType;

        oscillator.frequency.setValueAtTime(
            frequency,
            ctx.currentTime
        );

        gain.gain.setValueAtTime(
            0.08,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + duration
        );

    } catch (error) {

        console.warn(
            "Audio playback error:",
            error
        );
    }
}


/* =========================================================
   SOUND EFFECTS
========================================================= */

function triggerClickSFX() {

    playAudioTone(
        580,
        "triangle",
        0.12
    );

}


function triggerProgressionSFX() {

    playAudioTone(
        480,
        "sine",
        0.08
    );

    setTimeout(() => {

        playAudioTone(
            640,
            "sine",
            0.12
        );

    }, 80);

}


function triggerWrongSFX() {

    playAudioTone(
        220,
        "sawtooth",
        0.25
    );

}


function triggerVictorySFX() {

    playAudioTone(
        523,
        "sine",
        0.15
    );

    setTimeout(() => {

        playAudioTone(
            659,
            "sine",
            0.15
        );

    }, 100);

    setTimeout(() => {

        playAudioTone(
            784,
            "sine",
            0.15
        );

    }, 200);

    setTimeout(() => {

        playAudioTone(
            1046,
            "sine",
            0.35
        );

    }, 300);

}


/* =========================================================
   QUESTION BANK
========================================================= */

const masterQuestionBank = [

    {
        question:
            "A giant scroll drops in front of you containing a secret spell. How do you learn it?",

        options: [

            {
                text:
                    "👁️ I look closely at the maps, symbols, and written patterns.",
                type:
                    "visual"
            },

            {
                text:
                    "🗣️ I say the incantation out loud or listen to a wizard read it.",
                type:
                    "auditory"
            },

            {
                text:
                    "🪄 I wave the wand immediately to get a feel for the magic.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "⏳ I break it into tiny steps; long walls of text mix me up.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "You are navigating a maze. Which hazard blocks your progress most?",

        options: [

            {
                text:
                    "🌀 Getting distracted by moving decorations or flash changes.",
                type:
                    "visual"
            },

            {
                text:
                    "🔊 Loud echoes or background hums cutting off my thoughts.",
                type:
                    "auditory"
            },

            {
                text:
                    "🪑 Having to stand completely still at a locked door for too long.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "📜 Instructions that keep shifting without keeping a clear rule book.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "Time to complete a mini-game challenge! What keeps your memory sharp?",

        options: [

            {
                text:
                    "🎨 Color-coding matching elements or using map markers.",
                type:
                    "visual"
            },

            {
                text:
                    "🎵 Rhymes, rhythmic chants, or discussing tips with a teammate.",
                type:
                    "auditory"
            },

            {
                text:
                    "🎮 Using physical props, sketching, or active tracing tasks.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "⏱️ Frequent quick micro-breaks so my brain doesn't track off lines.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "When reading a long piece of lore, your brain naturally...",

        options: [

            {
                text:
                    "📸 Skims cleanly if there are pictures, charts, or bold fonts.",
                type:
                    "visual"
            },

            {
                text:
                    "🎧 Sub-vocalizes or whispers words internally to stay connected.",
                type:
                    "auditory"
            },

            {
                text:
                    "✏️ Needs to doodle, highlight text, or fidget to maintain concentration.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "❌ Gets lost unless information is clearly separated and organized.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "Pick a legendary tool to assist you on your journey:",

        options: [

            {
                text:
                    "🗺️ The Chrono-Map — infographics, mind maps and clear outlines.",
                type:
                    "visual"
            },

            {
                text:
                    "🎙️ The Echo-Stone — text-to-speech devices, audio logs and podcasts.",
                type:
                    "auditory"
            },

            {
                text:
                    "🛠️ The Builder's Kit — hands-on creation tools and real builds.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "📅 The Order-Shield — task breakdowns, clean displays and timers.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "You enter a forgotten dungeon library. How do you find the hidden switch?",

        options: [

            {
                text:
                    "🔍 Scanning structural changes, color codes or layout variations.",
                type:
                    "visual"
            },

            {
                text:
                    "🦻 Listening closely for tiny gear clicks or wall echoes.",
                type:
                    "auditory"
            },

            {
                text:
                    "🧱 Feeling along the textures of the stone walls manually.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "🗂️ Sorting books systematically by row numbers to unlock details.",
                type:
                    "structured"
            }

        ]
    },


    {
        question:
            "A teammate tries to explain a new battle tactic. You prefer that they:",

        options: [

            {
                text:
                    "🗺️ Sketch a tactical combat drawing or map outline.",
                type:
                    "visual"
            },

            {
                text:
                    "📣 Explain it clearly or act out vocal target calls.",
                type:
                    "auditory"
            },

            {
                text:
                    "⚔️ Run a mock scrimmage so you can practice the physical maneuvers.",
                type:
                    "kinesthetic"
            },

            {
                text:
                    "📋 List individual, incremental sub-tasks step-by-step.",
                type:
                    "structured"
            }

        ]
    }

];


/* =========================================================
   MINI-GAME DATA
========================================================= */

const minigameData = [

    {
        text:
            "Using a text-to-speech engine to listen to a book",
        category:
            "auditory"
    },

    {
        text:
            "Transforming bullet points into an interconnected mind map",
        category:
            "visual"
    },

    {
        text:
            "Setting a kitchen timer for a structured 15-minute chunk",
        category:
            "structured"
    },

    {
        text:
            "Doodling shapes or tracing letters while memorizing definitions",
        category:
            "kinesthetic"
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

let startScreen;
let quizScreen;
let minigameScreen;
let resultsScreen;

let btnStart;
let btnRestart;
let btnExport;
let btnSfx;

let activeSortCard;
let questionNumber;
let questionText;
let optionsContainer;
let progressBar;
let profileSummary;
let strategyList;


/* =========================================================
   GET DOM ELEMENTS
========================================================= */

function cacheDOM() {

    startScreen =
        document.getElementById(
            "start-screen"
        );

    quizScreen =
        document.getElementById(
            "quiz-screen"
        );

    minigameScreen =
        document.getElementById(
            "minigame-screen"
        );

    resultsScreen =
        document.getElementById(
            "results-screen"
        );


    btnStart =
        document.getElementById(
            "btn-start"
        );

    btnRestart =
        document.getElementById(
            "btn-restart"
        );

    btnExport =
        document.getElementById(
            "btn-export"
        );

    btnSfx =
        document.getElementById(
            "btn-sfx"
        );


    activeSortCard =
        document.getElementById(
            "active-sort-card"
        );

    questionNumber =
        document.getElementById(
            "question-number"
        );

    questionText =
        document.getElementById(
            "question-text"
        );

    optionsContainer =
        document.getElementById(
            "options-container"
        );

    progressBar =
        document.getElementById(
            "progress-bar"
        );

    profileSummary =
        document.getElementById(
            "profile-summary"
        );

    strategyList =
        document.getElementById(
            "strategy-list"
        );

}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screen) {

    const screens = [

        startScreen,
        quizScreen,
        minigameScreen,
        resultsScreen

    ];


    screens.forEach(
        current => {

            if (current) {

                current.classList.remove(
                    "active"
                );

            }

        }
    );


    if (screen) {

        screen.classList.add(
            "active"
        );

    }

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function updateProgress(percent) {

    if (!progressBar) {
        return;
    }


    percent =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );


    progressBar.style.width =
        `${percent}%`;

}


/* =========================================================
   RANDOMIZE QUESTIONS
========================================================= */

function generateDynamicQuestions() {

    const shuffled =
        [...masterQuestionBank];


    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }


    state.activeQuestions =
        shuffled.slice(
            0,
            5
        );

}


/* =========================================================
   START GAME
========================================================= */

function startQuest() {

    state.currentQuestionIndex =
        0;

    state.minigameIndex =
        0;

    state.xp =
        0;

    state.answered =
        false;

    state.scores = {

        visual: 0,
        auditory: 0,
        kinesthetic: 0,
        structured: 0

    };


    state.generatedReport = {

        summary: "",
        strategies: []

    };


    generateDynamicQuestions();


    triggerProgressionSFX();


    showScreen(
        quizScreen
    );


    loadQuestion();

}


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion() {

    const currentQuestion =
        state.activeQuestions[
            state.currentQuestionIndex
        ];


    if (!currentQuestion) {

        launchBonusRound();

        return;

    }


    state.answered =
        false;


    if (questionNumber) {

        questionNumber.innerText =
            `Challenge ${state.currentQuestionIndex + 1} of 5`;

    }


    if (questionText) {

        questionText.innerText =
            currentQuestion.question;

    }


    if (!optionsContainer) {

        console.error(
            "Missing #options-container"
        );

        return;

    }


    optionsContainer.innerHTML =
        "";


    currentQuestion.options.forEach(
        (option, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "option-card";


            card.dataset.type =
                option.type;


            card.innerText =
                option.text;


            card.addEventListener(
                "click",
                () => {

                    if (
                        state.answered
                    ) {

                        return;

                    }


                    handleSelection(
                        option.type,
                        card
                    );

                }
            );


            optionsContainer.appendChild(
                card
            );

        }
    );


    updateProgress(
        (
            state.currentQuestionIndex /
            5
        ) * 100
    );

}


/* =========================================================
   HANDLE QUIZ ANSWER
========================================================= */

function handleSelection(
    type,
    selectedCard
) {

    if (
        state.answered
    ) {

        return;

    }


    state.answered =
        true;


    if (
        state.scores[type] !== undefined
    ) {

        state.scores[type]++;

    }


    state.xp +=
        100;


    if (selectedCard) {

        selectedCard.classList.add(
            "selected"
        );

    }


    triggerProgressionSFX();


    /*
     * Give the user a short visual pause
     * before loading the next question.
     */

    setTimeout(
        () => {

            state.currentQuestionIndex++;


            if (
                state.currentQuestionIndex <
                state.activeQuestions.length
            ) {

                loadQuestion();

            } else {

                launchBonusRound();

            }

        },
        450
    );

}


/* =========================================================
   BONUS ROUND
========================================================= */

function launchBonusRound() {

    showScreen(
        minigameScreen
    );


    updateProgress(
        83
    );


    state.minigameIndex =
        0;


    loadMinigameCard();

}


/* =========================================================
   LOAD BONUS CARD
========================================================= */

function loadMinigameCard() {

    if (
        state.minigameIndex >=
        minigameData.length
    ) {

        showResults();

        return;

    }


    const card =
        minigameData[
            state.minigameIndex
        ];


    if (activeSortCard) {

        activeSortCard.innerText =
            `📋 Card: "${card.text}"`;

    }

}


/* =========================================================
   MINI-GAME MATCH
========================================================= */

function handleMinigameMatch(
    selectedTarget
) {

    if (!selectedTarget) {
        return;
    }


    const currentCard =
        minigameData[
            state.minigameIndex
        ];


    if (!currentCard) {

        showResults();

        return;

    }


    const userGuess =
        selectedTarget.dataset.zone;


    const isCorrect =
        userGuess ===
        currentCard.category;


    if (isCorrect) {

        state.xp +=
            150;


        triggerProgressionSFX();


        selectedTarget.classList.add(
            "correct-flash"
        );


    } else {

        triggerWrongSFX();


        selectedTarget.classList.add(
            "wrong-flash"
        );

    }


    setTimeout(
        () => {

            selectedTarget.classList.remove(
                "correct-flash",
                "wrong-flash"
            );


            state.minigameIndex++;


            loadMinigameCard();

        },
        500
    );

}


/* =========================================================
   FIND DOMINANT TYPE
========================================================= */

function getDominantScore() {

    const categories =
        Object.keys(
            state.scores
        );


    return categories.reduce(
        (
            highest,
            current
        ) => {

            if (
                state.scores[current] >
                state.scores[highest]
            ) {

                return current;

            }


            return highest;

        },
        categories[0]
    );

}


/* =========================================================
   SHOW RESULTS
========================================================= */

function showResults() {

    triggerVictorySFX();


    showScreen(
        resultsScreen
    );


    updateProgress(
        100
    );


    const scores =
        state.scores;


    let summary =
        "";

    let strategies =
        [];


    if (
        scores.structured >= 2
    ) {

        summary =
            "Your learning profile shows a strong preference for structure. You may work especially well when information is organized into clear steps, manageable sections and predictable routines.";


        strategies = [

            "Chunking Method: Break large assignments into short, focused sessions.",

            "Organize Information: Use headings, numbered steps, checklists and clearly separated sections.",

            "Use Timers: Try short timed learning blocks followed by brief breaks."

        ];

    }

    else {

        const dominant =
            getDominantScore();


        if (
            dominant ===
            "visual"
        ) {

            summary =
                "Your learning profile shows a strong visual preference. You may remember information particularly well when it is presented through images, diagrams, colors, symbols and spatial organization.";


            strategies = [

                "Color Coding: Use colors to separate concepts and highlight important information.",

                "Mind Mapping: Turn written information into diagrams, charts or visual maps.",

                "Visual Flashcards: Combine important words with pictures or symbols."

            ];

        }

        else if (
            dominant ===
            "auditory"
        ) {

            summary =
                "Your learning profile shows a strong auditory preference. You may benefit from hearing explanations, discussing ideas, repeating information and using spoken feedback.";


            strategies = [

                "Read Aloud: Say important information aloud while studying.",

                "Text-to-Speech: Listen to longer reading assignments when appropriate.",

                "Teach Someone: Explain a concept verbally to reinforce your memory."

            ];

        }

        else {

            summary =
                "Your learning profile shows a strong kinesthetic preference. You may engage especially well when learning includes movement, hands-on activities, experimentation and physical interaction.";


            strategies = [

                "Hands-On Learning: Use physical examples whenever possible.",

                "Movement Breaks: Add short movement breaks during longer study sessions.",

                "Build and Practice: Learn concepts by doing, creating or demonstrating them."

            ];

        }

    }


    state.generatedReport = {

        summary:
            summary,

        strategies:
            strategies

    };


    if (profileSummary) {

        profileSummary.innerText =
            summary;

    }


    if (strategyList) {

        strategyList.innerHTML =
            "";


        strategies.forEach(
            strategy => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.innerText =
                    strategy;


                strategyList.appendChild(
                    li
                );

            }
        );

    }

}


/* =========================================================
   PRINT / PDF REPORT
========================================================= */

function saveAsHighFidelityPDF() {

    if (
        !state.generatedReport.summary
    ) {

        alert(
            "Please complete the TrioRingo challenge first."
        );

        return;

    }


    triggerVictorySFX();


    const report =
        state.generatedReport;


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow popups so TrioRingo can create your printable report."
        );

        return;

    }


    const strategiesHTML =
        report.strategies
            .map(
                strategy =>
                    `<li>${escapeHTML(strategy)}</li>`
            )
            .join("");


    printWindow.document.write(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>
TrioRingo Learning Power Report
</title>

<style>

body {

    font-family:
        Arial,
        sans-serif;

    max-width:
        800px;

    margin:
        auto;

    padding:
        40px;

    color:
        #1e293b;

    line-height:
        1.6;

}

.header {

    border-bottom:
        4px solid #8b5cf6;

    padding-bottom:
        20px;

    margin-bottom:
        30px;

}

h1 {

    color:
        #8b5cf6;

    margin:
        0;

}

.section {

    background:
        #f8fafc;

    border:
        1px solid #e2e8f0;

    border-radius:
        12px;

    padding:
        24px;

    margin-bottom:
        24px;

}

h2,
h3 {

    color:
        #0f172a;

}

li {

    margin-bottom:
        12px;

}

.score-box {

    background:
        #f1f5f9;

    padding:
        18px;

    border-radius:
        10px;

}

.footer {

    border-top:
        1px solid #e2e8f0;

    margin-top:
        30px;

    padding-top:
        20px;

    text-align:
        center;

    font-size:
        11px;

    color:
        #64748b;

}

</style>

</head>

<body>

<div class="header">

<h1>
🧠 TrioRingo
</h1>

<p>
Discover Your Learning Power
</p>

</div>


<div class="section">

<h2>
Your Cognitive Processing Profile
</h2>

<p>
${escapeHTML(report.summary)}
</p>

</div>


<div class="section">

<h2>
🛠️ Your Ultimate Retention Toolkit
</h2>

<ul>

${strategiesHTML}

</ul>

</div>


<div class="section">

<h2>
Your TrioRingo Score
</h2>

<div class="score-box">

<p>
Visual:
<strong>
${state.scores.visual}
</strong>
</p>

<p>
Auditory:
<strong>
${state.scores.auditory}
</strong>
</p>

<p>
Kinesthetic:
<strong>
${state.scores.kinesthetic}
</strong>
</p>

<p>
Structured:
<strong>
${state.scores.structured}
</strong>
</p>

<p>
Total XP:
<strong>
${state.xp}
</strong>
</p>

</div>

</div>


<div class="footer">

TrioRingo Educational Learning Tool

<br>

Generated:
${new Date().toLocaleDateString()}

<br><br>

This tool is educational and is not a medical diagnosis.

</div>


<script>

window.onload = function() {

    window.print();

    setTimeout(
        function() {

            window.close();

        },
        800
    );

};

<\/script>

</body>

</html>

`);


    printWindow.document.close();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   RESET GAME
========================================================= */

function resetQuest() {

    state.currentQuestionIndex =
        0;

    state.minigameIndex =
        0;

    state.xp =
        0;

    state.answered =
        false;


    state.scores = {

        visual: 0,

        auditory: 0,

        kinesthetic: 0,

        structured: 0

    };


    state.generatedReport = {

        summary: "",

        strategies: []

    };


    state.activeQuestions =
        [];


    if (profileSummary) {

        profileSummary.innerText =
            "Analyzing your brain mechanics...";

    }


    if (strategyList) {

        strategyList.innerHTML =
            "";

    }


    updateProgress(
        0
    );


    showScreen(
        startScreen
    );

}


/* =========================================================
   INITIALIZE SFX BUTTON
========================================================= */

function initializeSFX() {

    if (!btnSfx) {
        return;
    }


    btnSfx.addEventListener(
        "click",
        () => {

            state.sfxEnabled =
                !state.sfxEnabled;


            btnSfx.innerText =
                state.sfxEnabled
                    ? "🔊 SFX: ON"
                    : "🔇 SFX: OFF";


            if (
                state.sfxEnabled
            ) {

                triggerClickSFX();

            }

        }
    );

}


/* =========================================================
   INITIALIZE MINI-GAME BUTTONS
========================================================= */

function initializeMiniGame() {

    const zoneButtons =
        document.querySelectorAll(
            ".zone-btn"
        );


    zoneButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    handleMinigameMatch(
                        button
                    );

                }
            );

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeGame() {

    cacheDOM();


    /*
     * START
     */

    if (btnStart) {

        btnStart.addEventListener(
            "click",
            startQuest
        );

    }


    /*
     * RESTART
     */

    if (btnRestart) {

        btnRestart.addEventListener(
            "click",
            () => {

                triggerClickSFX();

                resetQuest();

            }
        );

    }


    /*
     * EXPORT
     */

    if (btnExport) {

        btnExport.addEventListener(
            "click",
            saveAsHighFidelityPDF
        );

    }


    initializeSFX();

    initializeMiniGame();


    /*
     * Make sure the start screen is visible.
     */

    showScreen(
        startScreen
    );


    updateProgress(
        0
    );


    console.log(
        "TrioRingo main5a.js loaded successfully."
    );

}


/* =========================================================
   START AFTER HTML LOADS
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGame
    );

} else {

    initializeGame();

}

