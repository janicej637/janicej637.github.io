
"use strict";

/*
=========================================================
 MINDQUEST - COMPLETE GAME ENGINE
=========================================================

 This version is designed to be safely used with index17.html.

 Features:
 - Random 5-question quiz
 - Visual / Auditory / Kinesthetic / Structured scoring
 - XP system
 - Bonus matching mini-game
 - SFX
 - SFX ON/OFF
 - Results report
 - Print / Save as PDF
 - Restart
 - Defensive DOM checking
=========================================================
*/


/* ========================================================
   GAME STATE
======================================================== */

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

    activeQuestions: []

};


/* ========================================================
   SHARED AUDIO CONTEXT
======================================================== */

let audioContext = null;


/*
 * Create one AudioContext instead of creating a new
 * AudioContext every time a sound plays.
 */

function getAudioContext() {

    if (audioContext) {

        return audioContext;

    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            console.warn(
                "Web Audio API is not supported by this browser."
            );

            return null;

        }


        audioContext =
            new AudioContext();


        return audioContext;

    } catch (error) {

        console.error(
            "Unable to create AudioContext:",
            error
        );

        return null;

    }

}


/* ========================================================
   AUDIO SYNTHESIZER
======================================================== */

async function playAudioTone(
    frequency,
    waveType,
    duration
) {

    if (!state.sfxEnabled) {

        return;

    }


    const ctx =
        getAudioContext();


    if (!ctx) {

        return;

    }


    try {

        /*
         * Browsers may initially suspend AudioContext.
         */

        if (
            ctx.state === "suspended"
        ) {

            await ctx.resume();

        }


        const oscillator =
            ctx.createOscillator();


        const gainNode =
            ctx.createGain();


        oscillator.type =
            waveType;


        oscillator.frequency.setValueAtTime(
            frequency,
            ctx.currentTime
        );


        gainNode.gain.setValueAtTime(
            0.08,
            ctx.currentTime
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.00001,
            ctx.currentTime + duration
        );


        oscillator.connect(
            gainNode
        );


        gainNode.connect(
            ctx.destination
        );


        oscillator.start();


        oscillator.stop(
            ctx.currentTime + duration
        );


    } catch (error) {

        console.warn(
            "SFX error:",
            error
        );

    }

}


/* ========================================================
   SOUND EFFECTS
======================================================== */

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


    setTimeout(
        () => {

            playAudioTone(
                640,
                "sine",
                0.12
            );

        },
        80
    );

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


    setTimeout(
        () => {

            playAudioTone(
                659,
                "sine",
                0.15
            );

        },
        100
    );


    setTimeout(
        () => {

            playAudioTone(
                784,
                "sine",
                0.15
            );

        },
        200
    );


    setTimeout(
        () => {

            playAudioTone(
                1046,
                "sine",
                0.35
            );

        },
        300
    );

}


/* ========================================================
   QUESTION BANK
======================================================== */

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


/* ========================================================
   MINI-GAME DATA
======================================================== */

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


/* ========================================================
   DOM HELPERS
======================================================== */

function getElement(id) {

    return document.getElementById(id);

}


function requireElement(id) {

    const element =
        getElement(id);


    if (!element) {

        console.error(
            `MindQuest: Missing HTML element #${id}`
        );

    }


    return element;

}


/* ========================================================
   DOM ELEMENTS
======================================================== */

const startScreen =
    getElement("start-screen");

const quizScreen =
    getElement("quiz-screen");

const minigameScreen =
    getElement("minigame-screen");

const resultsScreen =
    getElement("results-screen");


const btnStart =
    getElement("btn-start");

const btnRestart =
    getElement("btn-restart");

const btnExport =
    getElement("btn-export");

const btnSfx =
    getElement("btn-sfx");


const activeSortCard =
    getElement("active-sort-card");

const questionNumber =
    getElement("question-number");

const questionText =
    getElement("question-text");

const optionsContainer =
    getElement("options-container");

const progressBar =
    getElement("progress-bar");

const xpCounter =
    getElement("xp-counter");

const profileSummary =
    getElement("profile-summary");

const strategyList =
    getElement("strategy-list");


/* ========================================================
   SAFE TEXT UPDATE
======================================================== */

function setText(
    element,
    value
) {

    if (element) {

        element.innerText =
            value;

    }

}


/* ========================================================
   UPDATE XP
======================================================== */

function updateXP() {

    setText(
        xpCounter,
        state.xp
    );

}


/* ========================================================
   UPDATE PROGRESS
======================================================== */

function updateProgress(
    percent
) {

    if (!progressBar) {

        return;

    }


    const safePercent =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );


    progressBar.style.width =
        `${safePercent}%`;

}


/* ========================================================
   RANDOM QUESTION GENERATOR
======================================================== */

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


/* ========================================================
   START QUEST
======================================================== */

function startQuest() {

    state.currentQuestionIndex =
        0;

    state.minigameIndex =
        0;

    generateDynamicQuestions();


    if (startScreen) {

        startScreen.classList.remove(
            "active"
        );

    }


    if (resultsScreen) {

        resultsScreen.classList.remove(
            "active"
        );

    }


    if (minigameScreen) {

        minigameScreen.classList.remove(
            "active"
        );

    }


    if (quizScreen) {

        quizScreen.classList.add(
            "active"
        );

    }


    loadQuestion();

}


/* ========================================================
   LOAD QUESTION
======================================================== */

function loadQuestion() {

    const currentQuestion =
        state.activeQuestions[
            state.currentQuestionIndex
        ];


    if (!currentQuestion) {

        launchBonusRound();

        return;

    }


    setText(
        questionNumber,
        `Challenge ${state.currentQuestionIndex + 1} of 5`
    );


    setText(
        questionText,
        currentQuestion.question
    );


    if (!optionsContainer) {

        console.error(
            "MindQuest: #options-container is missing."
        );

        return;

    }


    optionsContainer.innerHTML =
        "";


    currentQuestion.options.forEach(
        option => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "option-card";


            card.tabIndex =
                0;


            card.innerText =
                option.text;


            function chooseOption() {

                triggerProgressionSFX();

                handleSelection(
                    option.type
                );

            }


            card.addEventListener(
                "click",
                chooseOption
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        chooseOption();

                    }

                }
            );


            optionsContainer.appendChild(
                card
            );

        }
    );


    const progress =
        (
            state.currentQuestionIndex /
            (state.activeQuestions.length + 1)
        ) *
        100;


    updateProgress(
        progress
    );

}


/* ========================================================
   HANDLE ANSWER
======================================================== */

function handleSelection(
    type
) {

    if (
        Object.prototype.hasOwnProperty.call(
            state.scores,
            type
        )
    ) {

        state.scores[type]++;

    }


    state.xp +=
        100;


    /*updateXP();*/


    state.currentQuestionIndex++;


    if (
        state.currentQuestionIndex <
        state.activeQuestions.length
    ) {

        loadQuestion();

    } else {

        launchBonusRound();

    }

}


/* ========================================================
   BONUS ROUND
======================================================== */

function launchBonusRound() {

    if (quizScreen) {

        quizScreen.classList.remove(
            "active"
        );

    }


    if (minigameScreen) {

        minigameScreen.classList.add(
            "active"
        );

    }


    updateProgress(
        (
            state.activeQuestions.length /
            (state.activeQuestions.length + 1)
        ) * 100
    );


    loadMinigameCard();

}


/* ========================================================
   LOAD MINI-GAME CARD
======================================================== */

function loadMinigameCard() {

    if (
        state.minigameIndex <
        minigameData.length
    ) {

        setText(
            activeSortCard,
            `📋 Card: "${minigameData[state.minigameIndex].text}"`
        );

    } else {

        showResults();

    }

}


/* ========================================================
   MINI-GAME MATCH
======================================================== */

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

        return;

    }


    const userGuess =
        selectedTarget.getAttribute(
            "data-zone"
        );


    if (
        userGuess ===
        currentCard.category
    ) {

        triggerProgressionSFX();


        state.xp +=
            150;


        /*updateXP();*/


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
        400
    );

}


/* ========================================================
   FIND DOMINANT PROFILE
======================================================== */

function getDominantScore() {

    const categories =
        Object.keys(
            state.scores
        );


    return categories.reduce(
        (best, current) => {

            return state.scores[current] >
                state.scores[best]
                ? current
                : best;

        },
        categories[0]
    );

}


/* ========================================================
   GENERATE RESULTS
======================================================== */

function showResults() {

    triggerVictorySFX();


    if (minigameScreen) {

        minigameScreen.classList.remove(
            "active"
        );

    }


    if (resultsScreen) {

        resultsScreen.classList.add(
            "active"
        );

    }


    updateProgress(
        100
    );


    const scores =
        state.scores;


    let summaryText =
        "";


    let strategies =
        [];


    if (
        scores.structured >= 2
    ) {

        summaryText =
            "Your mind thrives on customized structure. You may process information especially well when tasks are clearly segmented, organized and presented in manageable steps.";


        strategies = [

            "Chunking Method: Break reading or study files into small 15-minute bursts followed by a short movement break.",

            "Focus Tools: Try line-focus overlays, clean typography and reduced visual clutter.",

            "Gamify Deadlines: Treat difficult tasks like level benchmarks and reward yourself when you complete each stage."

        ];


    } else {

        const dominant =
            getDominantScore();


        if (
            dominant ===
            "visual"
        ) {

            summaryText =
                "You show a strong visual processing preference. Your attention may benefit from symbols, colors, diagrams, spatial relationships and clearly organized layouts.";


            strategies = [

                "Color Coding: Use different colors to separate concepts and important information.",

                "Mind Mapping: Convert linear notes into flowcharts, diagrams or visual node chains."

            ];


        } else if (
            dominant ===
            "auditory"
        ) {

            summaryText =
                "You show a strong auditory processing preference. Rhythm, conversation, verbal explanations and spoken feedback may help you retain information.";


            strategies = [

                "Vocal Recitation: Explain new concepts out loud or record short voice notes.",

                "Text-to-Speech: Convert reading assignments into audio when appropriate."

            ];


        } else {

            summaryText =
                "You show a strong kinesthetic processing preference. Hands-on activities, movement, experimentation and physical interaction may help you engage with information.";


            strategies = [

                "Tactile Association: Use intentional movement or hands-on activities while learning.",

                "Active Building: Rewrite concepts on a whiteboard or physically organize flashcards and notes."

            ];

        }

    }


    state.generatedReport = {

        summary:
            summaryText,

        strategies:
            strategies

    };


    setText(
        profileSummary,
        summaryText
    );


    if (strategyList) {

        strategyList.innerHTML =
            "";


        strategies.forEach(
            strategy => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    strategy;


                strategyList.appendChild(
                    li
                );

            }
        );

    }

}


/* ========================================================
   PDF / PRINT REPORT
======================================================== */

function saveAsHighFidelityPDF() {

    triggerVictorySFX();


    const report =
        state.generatedReport;


    if (
        !report.summary
    ) {

        alert(
            "Complete the MindQuest challenges before exporting your report."
        );

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow popups to export your report."
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
                MindQuest Strategy Report
            </title>

            <style>

                body {
                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        40px;

                    color:
                        #1e293b;

                    max-width:
                        800px;

                    margin:
                        auto;
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
                        1px solid #e2eafc;

                    border-radius:
                        12px;

                    padding:
                        24px;

                    margin-bottom:
                        24px;
                }

                h3 {
                    margin-top:
                        0;

                    color:
                        #0f172a;

                    border-bottom:
                        1px solid #e2eafc;

                    padding-bottom:
                        8px;
                }

                li {
                    margin-bottom:
                        12px;

                    line-height:
                        1.6;
                }

                .footer {
                    font-size:
                        11px;

                    color:
                        #94a3b8;

                    text-align:
                        center;

                    margin-top:
                        40px;

                    border-top:
                        1px solid #e2eafc;

                    padding-top:
                        16px;
                }

            </style>

        </head>

        <body>

            <div class="header">

                <h1>
                    🧠 MindQuest Cognitive Report
                </h1>

                <p>
                    Personalized Learning Strategy Blueprint
                </p>

            </div>


            <div class="section">

                <h3>
                    Cognitive Profile Overview
                </h3>

                <p>
                    ${escapeHTML(report.summary)}
                </p>

            </div>


            <div class="section">

                <h3>
                    🛠️ Personalized Retention Toolkit
                </h3>

                <ul>
                    ${strategiesHTML}
                </ul>

            </div>


            <div class="footer">

                Visual:
                ${state.scores.visual}

                &nbsp;|&nbsp;

                Auditory:
                ${state.scores.auditory}

                &nbsp;|&nbsp;

                Kinesthetic:
                ${state.scores.kinesthetic}

                &nbsp;|&nbsp;

                Structured:
                ${state.scores.structured}

                <br><br>

                Final Score:
                ${state.xp} XP

                <br>

                Saved:
                ${new Date().toLocaleDateString()}

            </div>


            <script>

                window.onload =
                    function() {

                        window.print();

                        setTimeout(
                            function() {

                                window.close();

                            },
                            700
                        );

                    };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();

}


/* ========================================================
   HTML ESCAPE
======================================================== */

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


/* ========================================================
   RESET GAME
======================================================== */

function resetQuest() {

    state.currentQuestionIndex =
        0;


    state.minigameIndex =
        0;


    state.xp =
        0;


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


   /*updateXP();*/


    updateProgress(
        0
    );


    if (resultsScreen) {

        resultsScreen.classList.remove(
            "active"
        );

    }


    if (minigameScreen) {

        minigameScreen.classList.remove(
            "active"
        );

    }


    if (quizScreen) {

        quizScreen.classList.remove(
            "active"
        );

    }


    if (startScreen) {

        startScreen.classList.add(
            "active"
        );

    }

}


/* ========================================================
   INITIALIZE BUTTONS
======================================================== */

function initializeControls() {

    /*
     * SFX
     */

    if (btnSfx) {

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


    /*
     * START
     */

    if (btnStart) {

        btnStart.addEventListener(
            "click",
            () => {

                triggerProgressionSFX();

                startQuest();

            }
        );

    } else {

        console.warn(
            "MindQuest: #btn-start not found."
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


    /*
     * MINI-GAME ZONES
     */

    const zones =
        document.querySelectorAll(
            ".zone-btn"
        );


    zones.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    handleMinigameMatch(
                        event.currentTarget
                    );

                }
            );

        }
    );

}


/* ========================================================
   INITIALIZE APP
======================================================== */

function initializeMindQuest() {

    initializeControls();

    /*updateXP();*/

    updateProgress(
        0
    );


    /*
     * If the HTML has no active screen,
     * automatically activate the start screen.
     */

    const anyActiveScreen =
        document.querySelector(
            ".screen.active"
        );


    if (
        !anyActiveScreen &&
        startScreen
    ) {

        startScreen.classList.add(
            "active"
        );

    }


    console.log(
        "MindQuest initialized successfully."
    );

}


/* ========================================================
   WAIT FOR HTML
======================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMindQuest
    );

} else {

    initializeMindQuest();

}

