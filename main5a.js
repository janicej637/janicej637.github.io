"use strict";

/* =========================================================
TrioRingo — Learning Power Game
JavaScript matched specifically to the supplied HTML
========================================================= */

/* -----------------------------
GAME STATE
----------------------------- */

const state = {
currentQuestionIndex: 0,
minigameIndex: 0,
xp: 0,
sfxEnabled: true,

```
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

activeQuestions: []


};

/* -----------------------------
DOM ELEMENTS
----------------------------- */

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const minigameScreen = document.getElementById("minigame-screen");
const resultsScreen = document.getElementById("results-screen");

const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const btnExport = document.getElementById("btn-export");
const btnSfx = document.getElementById("btn-sfx");

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const activeSortCard = document.getElementById("active-sort-card");

const progressBar = document.getElementById("progress-bar");

const profileSummary = document.getElementById("profile-summary");
const strategyList = document.getElementById("strategy-list");

/*
XP counter is OPTIONAL.

```
Your HTML currently has the XP display commented out.
Therefore we use a null-safe selector.
```

*/

const xpCounter = document.getElementById("xp-counter");

/* =========================================================
AUDIO SYSTEM
========================================================= */

let audioContext = null;

/*
Create the AudioContext only after a user interaction.
This avoids browser autoplay restrictions.
*/

function getAudioContext() {

```
if (!audioContext) {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {
        return null;
    }

    audioContext = new AudioContext();
}

return audioContext;
```

}

/*
Resume audio if browser has suspended it.
*/

function prepareAudio() {

```
const ctx = getAudioContext();

if (!ctx) {
    return;
}

if (ctx.state === "suspended") {
    ctx.resume();
}
```

}

/*
Play a simple synthesized tone.
*/

function playAudioTone(freq, waveType, length) {

```
if (!state.sfxEnabled) {
    return;
}

try {

    const ctx = getAudioContext();

    if (!ctx) {
        return;
    }

    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(
        freq,
        ctx.currentTime
    );

    gain.gain.setValueAtTime(
        0.08,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + length
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
        ctx.currentTime + length
    );

} catch (error) {

    console.log(
        "Audio error:",
        error
    );
}
```

}

/* -----------------------------
SOUND EFFECTS
----------------------------- */

function triggerClickSFX() {

```
playAudioTone(
    580,
    "triangle",
    0.12
);
```

}

function triggerProgressionSFX() {

```
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
```

}

function triggerWrongSFX() {

```
playAudioTone(
    220,
    "sawtooth",
    0.25
);
```

}

function triggerVictorySFX() {

```
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
```

}

/* =========================================================
QUESTION BANK
========================================================= */

const masterQuestionBank = [

```
{
    question:
        "A giant scroll drops in front of you containing a secret spell. How do you learn it?",

    options: [

        {
            text:
                "👁️ I look closely at the maps, symbols, and written patterns.",
            type: "visual"
        },

        {
            text:
                "🗣️ I say the incantation out loud or listen to a wizard read it.",
            type: "auditory"
        },

        {
            text:
                "🪄 I wave the wand immediately to get a feel for the magic.",
            type: "kinesthetic"
        },

        {
            text:
                "⏳ I break it into tiny steps; long walls of text mix me up.",
            type: "structured"
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
            type: "visual"
        },

        {
            text:
                "🔊 Loud echoes or background hums cutting off my thoughts.",
            type: "auditory"
        },

        {
            text:
                "🪑 Having to stand completely still at a locked door for too long.",
            type: "kinesthetic"
        },

        {
            text:
                "📜 Instructions that keep shifting without keeping a clear rule book.",
            type: "structured"
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
            type: "visual"
        },

        {
            text:
                "🎵 Rhymes, rhythmic chants, or discussing tips with a teammate.",
            type: "auditory"
        },

        {
            text:
                "🎮 Using physical props, sketching, or active tracing tasks.",
            type: "kinesthetic"
        },

        {
            text:
                "⏱️ Frequent quick micro-breaks so my brain doesn't track off lines.",
            type: "structured"
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
            type: "visual"
        },

        {
            text:
                "🎧 Sub-vocalizes (whispering words internally) to stay connected.",
            type: "auditory"
        },

        {
            text:
                "✏️ Needs to doodle, highlight text, or fidget to maintain concentration.",
            type: "kinesthetic"
        },

        {
            text:
                "❌ Swaps letters around or gets lost unless someone highlights the row.",
            type: "structured"
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
            type: "visual"
        },

        {
            text:
                "🎙️ The Echo-Stone — text-to-speech devices, audio logs and podcasts.",
            type: "auditory"
        },

        {
            text:
                "🛠️ The Builder's Kit — hands-on creation tools and real builds.",
            type: "kinesthetic"
        },

        {
            text:
                "📅 The Order-Shield — task breakdowns, timers and uncluttered displays.",
            type: "structured"
        }

    ]
},


{
    question:
        "You enter a forgotten dungeon library. How do you find the hidden switch?",

    options: [

        {
            text:
                "🔍 Scanning structural changes, color codes, or layout variations.",
            type: "visual"
        },

        {
            text:
                "🦻 Listening closely for tiny gear clicks or wall echoes.",
            type: "auditory"
        },

        {
            text:
                "🧱 Feeling along the textures of the stone walls manually.",
            type: "kinesthetic"
        },

        {
            text:
                "🗂️ Sorting books systematically by row numbers to unlock details.",
            type: "structured"
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
            type: "visual"
        },

        {
            text:
                "📣 Explain it clearly or act out vocal target calls.",
            type: "auditory"
        },

        {
            text:
                "⚔️ Run a mock scrimmage so you can practice the physical maneuvers.",
            type: "kinesthetic"
        },

        {
            text:
                "📋 List individual, incremental sub-tasks step-by-step.",
            type: "structured"
        }

    ]
}
```

];

/* =========================================================
BONUS ROUND DATA
========================================================= */

const minigameData = [

```
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
```

];

/* =========================================================
EVENT LISTENERS
========================================================= */

/*
SFX toggle
*/

if (btnSfx) {

```
btnSfx.addEventListener(
    "click",
    () => {

        prepareAudio();

        state.sfxEnabled =
            !state.sfxEnabled;

        btnSfx.innerText =
            state.sfxEnabled
                ? "🔊 SFX: ON"
                : "🔇 SFX: OFF";

        if (state.sfxEnabled) {
            triggerClickSFX();
        }

    }
);
```

}

/*
Start game
*/

if (btnStart) {

```
btnStart.addEventListener(
    "click",
    () => {

        prepareAudio();

        triggerProgressionSFX();

        startQuest();

    }
);
```

}

/*
Restart game
*/

if (btnRestart) {

```
btnRestart.addEventListener(
    "click",
    () => {

        prepareAudio();

        triggerClickSFX();

        resetQuest();

    }
);
```

}

/*
Export / Print report
*/

if (btnExport) {

```
btnExport.addEventListener(
    "click",
    saveAsHighFidelityPDF
);
```

}

/*
Bonus round buttons
*/

document
.querySelectorAll(".zone-btn")
.forEach(button => {

```
    button.addEventListener(
        "click",
        event => {

            prepareAudio();

            handleMinigameMatch(
                event.currentTarget
            );

        }
    );

});
```

/* =========================================================
QUESTION RANDOMIZER
========================================================= */

function generateDynamicQuestions() {

```
const shuffled =
    [...masterQuestionBank];

for (
    let i = shuffled.length - 1;
    i > 0;
    i--
) {

    const j =
        Math.floor(
            Math.random() * (i + 1)
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

/*
    Five random questions.
*/

state.activeQuestions =
    shuffled.slice(0, 5);
```

}

/* =========================================================
START QUEST
========================================================= */

function startQuest() {

```
state.currentQuestionIndex = 0;
state.minigameIndex = 0;

generateDynamicQuestions();

if (startScreen) {
    startScreen.classList.remove("active");
}

if (quizScreen) {
    quizScreen.classList.add("active");
}

loadQuestion();
```

}

/* =========================================================
LOAD QUESTION
========================================================= */

function loadQuestion() {

```
const currentQuestion =
    state.activeQuestions[
        state.currentQuestionIndex
    ];

if (!currentQuestion) {
    launchBonusRound();
    return;
}


if (questionNumber) {

    questionNumber.innerText =
        `Challenge ${
            state.currentQuestionIndex + 1
        } of 5`;

}


if (questionText) {

    questionText.innerText =
        currentQuestion.question;

}


if (optionsContainer) {

    optionsContainer.innerHTML = "";

    currentQuestion.options
        .forEach(option => {

            const card =
                document.createElement("div");

            card.className =
                "option-card";

            card.innerText =
                option.text;

            card.setAttribute(
                "role",
                "button"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );


            card.addEventListener(
                "click",
                () => {

                    triggerProgressionSFX();

                    handleSelection(
                        option.type,
                        card
                    );

                }
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        triggerProgressionSFX();

                        handleSelection(
                            option.type,
                            card
                        );

                    }

                }
            );


            optionsContainer.appendChild(
                card
            );

        });

}


updateProgress();
```

}

/* =========================================================
HANDLE ANSWER
========================================================= */

function handleSelection(
type,
selectedCard
) {

```
/*
    Prevent double-clicking an answer.
*/

if (
    optionsContainer &&
    optionsContainer.dataset.locked === "true"
) {
    return;
}

if (optionsContainer) {
    optionsContainer.dataset.locked = "true";
}


/*
    Add score.
*/

if (
    Object.prototype.hasOwnProperty.call(
        state.scores,
        type
    )
) {

    state.scores[type]++;

}


/*
    Add XP.
*/

state.xp += 100;


/*
    IMPORTANT FIX:

    xpCounter may not exist because
    the HTML currently comments it out.

    Therefore this is null-safe.
*/

if (xpCounter) {
    xpCounter.innerText =
        state.xp;
}


/*
    Visual feedback.
*/

if (selectedCard) {

    selectedCard.classList.add(
        "selected"
    );

}


state.currentQuestionIndex++;


setTimeout(
    () => {

        if (optionsContainer) {
            optionsContainer.dataset.locked =
                "false";
        }

        if (
            state.currentQuestionIndex <
            state.activeQuestions.length
        ) {

            loadQuestion();

        } else {

            launchBonusRound();

        }

    },
    350
);
```

}

/* =========================================================
BONUS ROUND
========================================================= */

function launchBonusRound() {

```
if (quizScreen) {
    quizScreen.classList.remove("active");
}

if (minigameScreen) {
    minigameScreen.classList.add("active");
}

updateProgress();

loadMinigameCard();
```

}

/* =========================================================
LOAD BONUS CARD
========================================================= */

function loadMinigameCard() {

```
if (
    state.minigameIndex <
    minigameData.length
) {

    const currentCard =
        minigameData[
            state.minigameIndex
        ];

    if (activeSortCard) {

        activeSortCard.innerText =
            `📋 Card: "${currentCard.text}"`;

    }

} else {

    showResults();

}
```

}

/* =========================================================
BONUS ROUND ANSWER
========================================================= */

function handleMinigameMatch(
selectedTarget
) {

```
if (
    !selectedTarget ||
    state.minigameIndex >=
    minigameData.length
) {
    return;
}


/*
    Prevent multiple clicks
    during the animation.
*/

if (
    selectedTarget.dataset.locked ===
    "true"
) {
    return;
}

selectedTarget.dataset.locked =
    "true";


const currentCard =
    minigameData[
        state.minigameIndex
    ];

const userGuess =
    selectedTarget.getAttribute(
        "data-zone"
    );


if (
    userGuess ===
    currentCard.category
) {

    triggerProgressionSFX();

    state.xp += 150;


    if (xpCounter) {

        xpCounter.innerText =
            state.xp;

    }


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

        selectedTarget.dataset.locked =
            "false";

        state.minigameIndex++;

        loadMinigameCard();

    },
    500
);
```

}

/* =========================================================
PROGRESS BAR
========================================================= */

function updateProgress() {

```
if (!progressBar) {
    return;
}


const totalSteps =
    state.activeQuestions.length +
    minigameData.length;


const completedSteps =
    state.currentQuestionIndex +
    state.minigameIndex;


let percent =
    totalSteps > 0
        ? (completedSteps / totalSteps) * 100
        : 0;


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
```

}

/* =========================================================
RESULTS
========================================================= */

function showResults() {

```
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


if (progressBar) {
    progressBar.style.width =
        "100%";
}


const scores =
    state.scores;


/*
    Find highest category.
*/

const categories =
    Object.keys(scores);


let dominant =
    categories[0];


categories.forEach(
    category => {

        if (
            scores[category] >
            scores[dominant]
        ) {

            dominant =
                category;

        }

    }
);


let summaryText = "";
let strategies = [];


/*
    Structured profile
*/

if (
    scores.structured >= 2 &&
    scores.structured >= scores[dominant]
) {

    summaryText =
        "Your mind thrives on customized structure! You may learn especially well when information is broken into clear, manageable steps.";

    strategies = [

        "Chunking Method: Break large assignments into small 15-minute bursts.",

        "Visual Organization: Use headings, checklists, timers and clearly separated sections.",

        "Gamify Deadlines: Turn difficult tasks into small level-based goals and reward progress."

    ];

}


/*
    Visual profile
*/

else if (
    dominant === "visual"
) {

    summaryText =
        "You are a Spatial Explorer! You may naturally connect strongly with colors, images, diagrams, symbols and visual organization.";

    strategies = [

        "Color Coding: Use different colors to separate important concepts.",

        "Mind Mapping: Turn written information into diagrams, flowcharts and visual connections.",

        "Visual Flashcards: Pair important facts with memorable images or symbols."

    ];

}


/*
    Auditory profile
*/

else if (
    dominant === "auditory"
) {

    summaryText =
        "You are an Echo Weaver! You may remember information particularly well through conversation, rhythm, spoken explanations and auditory feedback.";

    strategies = [

        "Vocal Recitation: Explain new concepts out loud.",

        "Text-to-Speech: Listen to difficult reading material.",

        "Discussion Learning: Talk through difficult ideas with another person."

    ];

}


/*
    Kinesthetic profile
*/

else {

    summaryText =
        "You are a Kinesthetic Builder! You may learn especially well through movement, hands-on activities, experimentation and active practice.";

    strategies = [

        "Active Learning: Turn passive studying into hands-on activities.",

        "Tactile Association: Write, draw, build or physically manipulate learning materials.",

        "Movement Breaks: Add short movement breaks during longer study sessions."

    ];

}


state.generatedReport = {

    summary:
        summaryText,

    strategies:
        strategies

};


if (profileSummary) {

    profileSummary.innerText =
        summaryText;

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
```

}

/* =========================================================
PRINT / SAVE REPORT
========================================================= */

function saveAsHighFidelityPDF() {

```
prepareAudio();

triggerVictorySFX();


const report =
    state.generatedReport;


if (!report.summary) {

    alert(
        "Please complete the TrioRingo challenge first."
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


const safeSummary =
    escapeHTML(
        report.summary
    );


const safeStrategies =
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

                padding: 40px;

                color:
                    #1e293b;

                max-width:
                    800px;

                margin:
                    auto;

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

            h3 {

                margin-top:
                    0;

                color:
                    #0f172a;

            }

            li {

                margin-bottom:
                    12px;

            }

            .footer {

                font-size:
                    11px;

                color:
                    #64748b;

                text-align:
                    center;

                margin-top:
                    40px;

                border-top:
                    1px solid #e2e8f0;

                padding-top:
                    16px;

            }

        </style>

    </head>

    <body>

        <div class="header">

            <h1>
                🧠 TrioRingo
            </h1>

            <p>
                Learning Power Strategy Report
            </p>

        </div>


        <div class="section">

            <h3>
                Your Cognitive Processing Profile
            </h3>

            <p>
                ${safeSummary}
            </p>

        </div>


        <div class="section">

            <h3>
                🛠️ Your Retention Toolkit
            </h3>

            <ul>
                ${safeStrategies}
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

            Final XP:
            ${state.xp}

            <br>

            Generated:
            ${new Date().toLocaleDateString()}

        </div>


        <script>

            window.onload = function() {

                window.print();

                setTimeout(
                    function() {
                        window.close();
                    },
                    500
                );

            };

        <\/script>

    </body>

    </html>

`);


printWindow.document.close();
```

}

/* =========================================================
HTML ESCAPE
========================================================= */

function escapeHTML(value) {

```
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
```

}

/* =========================================================
RESET GAME
========================================================= */

function resetQuest() {

```
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


/*
    XP is optional in this HTML.
*/

if (xpCounter) {

    xpCounter.innerText =
        "0";

}


if (profileSummary) {

    profileSummary.innerText =
        "Analyzing your brain mechanics...";

}


if (strategyList) {

    strategyList.innerHTML =
        "";

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

    quizScreen.classList.remove(
        "active"
    );

}


if (startScreen) {

    startScreen.classList.add(
        "active"
    );

}


if (progressBar) {

    progressBar.style.width =
        "0%";

}


}
