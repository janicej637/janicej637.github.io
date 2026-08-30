// Game State Manager
const state = {
    currentQuestionIndex: 0,
    xp: 0,
    sfxEnabled: true,
    scores: { visual: 0, auditory: 0, kinesthetic: 0, structured: 0 },
    generatedReport: { summary: "", strategies: [] },
    minigameIndex: 0,
    activeQuestions: [] // Holds the randomized subset for the current run
};

// Web Audio Synthesizer Framework
function playAudioTone(freq, waveType, length) {
    if (!state.sfxEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + length);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + length);
    } catch(e) { console.log(e); }
}

const triggerClickSFX = () => playAudioTone(580, "triangle", 0.12);
const triggerProgressionSFX = () => {
    playAudioTone(480, "sine", 0.08);
    setTimeout(() => playAudioTone(640, "sine", 0.12), 80);
};
const triggerWrongSFX = () => playAudioTone(220, "sawtooth", 0.25);
const triggerVictorySFX = () => {
    playAudioTone(523, "sine", 0.15);
    setTimeout(() => playAudioTone(659, "sine", 0.15), 100);
    setTimeout(() => playAudioTone(784, "sine", 0.15), 200);
    setTimeout(() => playAudioTone(1046, "sine", 0.35), 300);
};

// Comprehensive Question Bank (Will be randomized to draw 5 each game loop)
const masterQuestionBank = [
    {
        question: "A giant scroll drops in front of you containing a secret spell. How do you learn it?",
        options: [
            { text: "👁️ I look closely at the maps, symbols, and written patterns.", type: "visual" },
            { text: "🗣️ I say the incantation out loud or listen to a wizard read it.", type: "auditory" },
            { text: "🪄 I wave the wand immediately to get a feel for the magic.", type: "kinesthetic" },
            { text: "⏳ I break it into tiny steps; long walls of text mix me up.", type: "structured" }
        ]
    },
    {
        question: "You are navigating a maze. Which hazard blocks your progress most?",
        options: [
            { text: "🌀 Getting distracted by moving decorations or flash changes.", type: "visual" },
            { text: "🔊 Loud echoes or background hums cutting off my thoughts.", type: "auditory" },
            { text: "🪑 Having to stand completely still at a locked door for too long.", type: "kinesthetic" },
            { text: "📜 Instructions that keep shifting without keeping a clear rule book.", type: "structured" }
        ]
    },
    {
        question: "Time to complete a mini-game challenge! What keeps your memory sharp?",
        options: [
            { text: "🎨 Color-coding matching elements or using map markers.", type: "visual" },
            { text: "🎵 Rhymes, rhythmic chants, or discussing tips with a teammate.", type: "auditory" },
            { text: "🎮 Using physical props, sketching, or active tracing tasks.", type: "kinesthetic" },
            { text: "⏱️ Frequent quick micro-breaks so my brain doesn't track off lines.", type: "structured" }
        ]
    },
    {
        question: "When reading a long piece of lore, your brain naturally...",
        options: [
            { text: "📸 Skims cleanly if there are pictures, charts, or bold fonts.", type: "visual" },
            { text: "🎧 Sub-vocalizes (whispering words internally) to stay connected.", type: "auditory" },
            { text: "✏️ Needs to doodle, highlight text, or fidget to maintain concentration.", type: "kinesthetic" },
            { text: "❌ Swaps letters around or gets lost unless someone highlights the row.", type: "structured" }
        ]
    },
    {
        question: "Pick a legendary tool to assist you on your journey:",
        options: [
            { text: "🗺️ The Chrono-Map (Infographics, mind-mapping tools, clear outlines).", type: "visual" },
            { text: "🎙️ The Echo-Stone (Text-to-speech devices, audio logs, podcasts).", type: "auditory" },
            { text: "🛠️ The Builder's Kit (Hands-on creation tools, text highlights, real builds).", type: "kinesthetic" },
            { text: "📅 The Order-Shield (Task breakdowns, uncluttered text displays, timer focus).", type: "structured" }
        ]
    },
    {
        question: "You enter a forgotten dungeon library. How do you find the hidden switch?",
        options: [
            { text: "🔍 Scanning structural changes, color codes, or layout variations.", type: "visual" },
            { text: "🦻 Listening closely for tiny gear clicks or wall echoes.", type: "auditory" },
            { text: "🧱 Feeling along the textures of the stone walls manually.", type: "kinesthetic" },
            { text: "🗂️ Sorting books systematically by row numbers to unlock details.", type: "structured" }
        ]
    },
    {
        question: "A teammate tries to explain a new battle tactic. You prefer that they:",
        options: [
            { text: "🗺️ Sketch a tactical combat drawing or map outline.", type: "visual" },
            { text: "📣 Explain it clearly or act out vocal target calls.", type: "auditory" },
            { text: "⚔️ Run a mock scrimmage so you can practice the physical maneuvers.", type: "kinesthetic" },
            { text: "📋 List individual, incremental sub-tasks step-by-step.", type: "structured" }
        ]
    }
];

const minigameData = [
    { text: "Using a text-to-speech engine to listen to a book", category: "auditory" },
    { text: "Transforming bullet points into an interconnected mind map", category: "visual" },
    { text: "Setting a kitchen timer for a structured 15-minute chunk", category: "structured" },
    { text: "Doodling shapes or tracing letters while memorizing definitions", category: "kinesthetic" }
];

// DOM Selectors
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const minigameScreen = document.getElementById("minigame-screen");
const resultsScreen = document.getElementById("results-screen");
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const btnExport = document.getElementById("btn-export");
const btnSfx = document.getElementById("btn-sfx");
const activeSortCard = document.getElementById("active-sort-card");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressBar = document.getElementById("progress-bar");
const xpCounter = document.getElementById("xp-counter");
const profileSummary = document.getElementById("profile-summary");
const strategyList = document.getElementById("strategy-list");

// Core Setup Hooks
btnSfx.addEventListener("click", () => {
    state.sfxEnabled = !state.sfxEnabled;
    btnSfx.innerText = state.sfxEnabled ? "🔊 SFX: ON" : "🔇 SFX: OFF";
    triggerClickSFX();
});

btnStart.addEventListener("click", () => { triggerProgressionSFX(); startQuest(); });
btnRestart.addEventListener("click", () => { triggerClickSFX(); resetQuest(); });
btnExport.addEventListener("click", saveAsHighFidelityPDF);

document.querySelectorAll(".zone-btn").forEach(button => {
    button.addEventListener("click", (e) => handleMinigameMatch(e.currentTarget));
});

// Dynamic Question Set Randomizer (Fisher-Yates Shuffle)
function generateDynamicQuestions() {
    let shuffled = [...masterQuestionBank];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Pull top 5 random distinct questions for this session loop
    state.activeQuestions = shuffled.slice(0, 5);
}

function startQuest() {
    generateDynamicQuestions();
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = state.activeQuestions[state.currentQuestionIndex];
    questionNumber.innerText = `Challenge ${state.currentQuestionIndex + 1} of 5`;
    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(opt => {
        const card = document.createElement("div");
        card.className = "option-card";
        card.innerText = opt.text;
        card.addEventListener("click", () => {
            triggerProgressionSFX();
            handleSelection(opt.type);
        });
        optionsContainer.appendChild(card);
    });

    progressBar.style.width = `${(state.currentQuestionIndex / (state.activeQuestions.length + 1)) * 100}%`;
}

function handleSelection(type) {
    state.scores[type]++;
    state.xp += 100;
    xpCounter.innerText = state.xp;
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < state.activeQuestions.length) {
        loadQuestion();
    } else {
        launchBonusRound();
    }
}

function launchBonusRound() {
    quizScreen.classList.remove("active");
    minigameScreen.classList.add("active");
    progressBar.style.width = `${(state.activeQuestions.length / (state.activeQuestions.length + 1)) * 100}%`;
    loadMinigameCard();
}

function loadMinigameCard() {
    if (state.minigameIndex < minigameData.length) {
        activeSortCard.innerText = `📋 Card: "${minigameData[state.minigameIndex].text}"`;
    } else {
        showResults();
    }
}
function handleMinigameMatch(selectedTarget) {
    const currentCard = minigameData[state.minigameIndex];
    const userGuess = selectedTarget.getAttribute("data-zone"); 
    
    if (userGuess === currentCard.category) {
        triggerProgressionSFX();
        state.xp += 150;
        xpCounter.innerText = state.xp;
        selectedTarget.classList.add("correct-flash");
    } else {
        triggerWrongSFX();
        selectedTarget.classList.add("wrong-flash");
    }

    setTimeout(() => {
        selectedTarget.classList.remove("correct-flash", "wrong-flash");
        state.minigameIndex++;
        loadMinigameCard();
    }, 400);
}

function showResults() {
    triggerVictorySFX();
    minigameScreen.classList.remove("active");
    resultsScreen.classList.add("active");
    progressBar.style.width = "100%";

    const scores = state.scores;
    let summaryText = "";
    let strategies = [];

    if (scores.structured >= 2) {
        summaryText = "Your mind thrives on customized structure! Standard blocks of text or linear lessons can occasionally trigger focusing fatigue or word tracking shifts. You process information brilliantly when it is dynamic, highly segmented, and parsed.";
        strategies = [
            "Chunking Method: Break reading files into small 15-minute bursts followed by a 2-minute physical movement change.",
            "Assistive Extensions: Try utilizing specialized typography fonts (like OpenDyslexic) or line-focus overlays to avoid tracking mistakes.",
            "Gamify Deadlines: Treat tasks like level benchmarks. Reward yourself with XP or actual tokens upon executing tough reading targets."
        ];
    } else {
        const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        if (dominant === "visual") {
            summaryText = "You possess a powerful Spatial Mind! Your brain locks onto geometric details, symbols, colors, and layout configurations rather than plain spoken blocks.";
            strategies = [
                "Color Coding: Use different highlighters or font layers to divide concepts visually.",
                "Mind Mapping: Convert linear text summaries into flowcharts, diagrams, or visual node chains."
            ];
        } else if (dominant === "auditory") {
            summaryText = "You are an Echo Weaver! Your memory thrives on rhythm, conversational cues, vocal cadences, and auditory feedback systems.";
            strategies = [
                "Vocal Recitation: Explain new concepts out loud to yourself or record voice memos to play back during downtime.",
                "Text-to-Speech: Convert tracking assignments into audio readouts so you can digest information auditorily."
            ];
        } else {
            summaryText = "You are a Kinesthetic Builder! You process knowledge through touch, physical movement, real experimentation, and structural engagement.";
            strategies = [
                "Tactile Association: Fidget intentionally or space yourself on a standing pad while trying to remember complex topics.",
                "Active Building: Rewrite concepts by hand onto whiteboards or use structural flashcards to sort physical piles."
            ];
        }
    }

    state.generatedReport = { summary: summaryText, strategies: strategies };
    profileSummary.innerText = summaryText;
    strategyList.innerHTML = "";
    strategies.forEach(strat => {
        const li = document.createElement("li");
        li.innerHTML = strat;
        strategyList.appendChild(li);
    });
}

function saveAsHighFidelityPDF() {
    triggerVictorySFX();
    const report = state.generatedReport;
    if (!report.summary) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow popups to export your PDF report!");
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>MindQuest Strategy Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
                .header { border-bottom: 4px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
                h1 { color: #8b5cf6; margin: 0; }
                .section { background: #f8fafc; border: 1px solid #e2eafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
                h3 { margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2eafc; padding-bottom: 8px; }
                li { margin-bottom: 12px; line-height: 1.6; }
                .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #e2eafc; padding-top: 16px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🧠 MindQuest Cognitive Report</h1>
                <p>Personalized Learning Strategy Blueprint</p>
            </div>
            <div class="section">
                <h3>Cognitive Profile Overview</h3>
                <p>${report.summary}</p>
            </div>
            <div class="section">
                <h3>🛠️ Personalized Retention Toolkit</h3>
                <ul>${report.strategies.map(s => `<li>${s}</li>`).join("")}</ul>
            </div>
            <div class="footer">
                Metrics Matrix: Visual[${state.scores.visual}] Auditory[${state.scores.auditory}] Kinesthetic[${state.scores.kinesthetic}] Structured[${state.scores.structured}] | Final Score: ${state.xp} XP<br>
                Educational assessment toolkit overview. Saved: ${new Date().toLocaleDateString()}
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function resetQuest() {
    state.currentQuestionIndex = 0;
    state.minigameIndex = 0;
    state.xp = 0;
    if(xpCounter) xpCounter.innerText = "0";
    state.scores = { visual: 0, auditory: 0, kinesthetic: 0, structured: 0 };
    state.generatedReport = { summary: "", strategies: [] };
    state.activeQuestions = [];

    resultsScreen.classList.remove("active");
    minigameScreen.classList.remove("active");
    startScreen.classList.add("active");
    progressBar.style.width = "0%";
}
