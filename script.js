// Book Application State Manager
const bookState = {
    currentPageIndex: 0,
    audioPlaying: false,
    speechUtterance: null,
    userName: "Alex",
    userRole: "Chief Assistant",
    // Base book structures with tracking markers for clean runtime replacement adjustments
    storyPages: [
        {
            chapter: "Chapter 1",
            title: "The Sparkly Kitchen",
            visualClass: "visual-p1",
            template: "Deep inside the Whispering Woods lived an 8-year-old inventor named Jayla Jellybean. Jayla didn't make normal gadgets; she mixed starlight and fruit juice to create magical jellybeans that could fix big problems. Today, her kitchen smelled like strawberries because her brand new {ROLE} named {NAME} was helping stoke the magic oven!"
        },
        {
            chapter: "Chapter 2",
            title: "The Stormy Playground",
            visualClass: "visual-p2",
            template: "Walking to the local playground, Jayla and {NAME} noticed their friend Toby sitting all alone under a dark rain cloud on the swings. A group of older kids had accidentally kicked a soccer ball over his structural drawing. Toby was crying, and his drawing was fading under the gray drizzle."
        },
        {
            chapter: "Chapter 3",
            title: "The Neon Magic Pop",
            visualClass: "visual-p3",
            template: "Jayla reached into her candy pouch and pulled out a shimmering Neon Blue bean, while {NAME} cheered her on. 'Here, eat this!' Jayla smiled. Toby took a bite, and instantly, a glowing energy umbrella popped over his head, blocking out the rain! The blue sparkles flew onto the other kids' soccer ball, transforming it into a soft bubble."
        },
        {
            chapter: "Chapter 4",
            title: "Stronger Together",
            visualClass: "visual-p4",
            template: "Seeing the sparkling bubble, the other children laughed and ran over to help Toby rebuild his block fortress. Jayla and her brilliant {ROLE}, {NAME}, watched happily as new friendships grew right before their eyes. With a snap and a pop, her pouch began charging up with new sugar magic!"
        }
    ]
};

// Selectors Matrix
const pBadge = document.getElementById("page-badge");
const pTitle = document.getElementById("story-title");
const pArt = document.getElementById("story-art");
const pNarrative = document.getElementById("story-narrative");
const pIndicator = document.getElementById("page-indicator");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnAudio = document.getElementById("btn-audio");
const btnPdf = document.getElementById("btn-pdf");
const btnApply = document.getElementById("btn-apply");

const btnCraft = document.getElementById("btn-craft");
const labOutput = document.getElementById("lab-output");
const craftedJellyText = document.getElementById("crafted-jelly-text");

// Bindings
btnPrev.addEventListener("click", () => shiftPage(-1));
btnNext.addEventListener("click", () => shiftPage(1));
btnAudio.addEventListener("click", controlSpeechRuntime);
btnPdf.addEventListener("click", exportHighQualityStoryPDF);
btnCraft.addEventListener("click", compileCustomLabJellybean);
if(btnApply) btnApply.addEventListener("click", applyCharacterPersonalization);

// Init Load Configuration Run
renderActivePage();

function getProcessedText(templateStr) {
    return templateStr.replace(/{NAME}/g, bookState.userName).replace(/{ROLE}/g, bookState.userRole);
}

function renderActivePage() {
    stopCurrentSpeech();
    const data = bookState.storyPages[bookState.currentPageIndex];
    
    pArt.className = `magic-art ${data.visualClass}`;
    pBadge.innerText = data.chapter;
    pTitle.innerText = data.title;
    pNarrative.innerText = getProcessedText(data.template);
    
    pIndicator.innerText = `Page ${bookState.currentPageIndex + 1} / ${bookState.storyPages.length}`;
    btnPrev.disabled = bookState.currentPageIndex === 0;
    btnNext.disabled = bookState.currentPageIndex === bookState.storyPages.length - 1;
}

function applyCharacterPersonalization() {
    const nameInput = document.getElementById("user-name").value.trim();
    const roleInput = document.getElementById("user-role").value;
    
    if(nameInput !== "") {
        bookState.userName = nameInput;
        bookState.userRole = roleInput;
        renderActivePage();
        
        // Success audio blip trigger feedback
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(698.46, ctx.currentTime); // F5
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    }
}

function shiftPage(offset) {
    bookState.currentPageIndex += offset;
    renderActivePage();
}

function controlSpeechRuntime() {
    if (bookState.audioPlaying) {
        stopCurrentSpeech();
    } else {
        const textToRead = getProcessedText(bookState.storyPages[bookState.currentPageIndex].template);
        bookState.speechUtterance = new SpeechSynthesisUtterance(textToRead);
        bookState.speechUtterance.rate = 0.95;
        bookState.speechUtterance.pitch = 1.1;
        
        bookState.speechUtterance.onend = () => {
            bookState.audioPlaying = false;
            btnAudio.innerText = "🔊 Read Aloud";
        };
        
        window.speechSynthesis.speak(bookState.speechUtterance);
        bookState.audioPlaying = true;
        btnAudio.innerText = "🛑 Stop Reading";
    }
}

function stopCurrentSpeech() {
    window.speechSynthesis.cancel();
    bookState.audioPlaying = false;
    btnAudio.innerText = "🔊 Read Aloud";
}

function compileCustomLabJellybean() {
    const coreSpark = document.getElementById("color-mix").value;
    const challengeTarget = document.getElementById("problem-mix").value;
    let magicResolutionText = "";

    switch(challengeTarget) {
        case "bullying":
            magicResolutionText = `Jayla rolls the ${coreSpark} jellybean across the playground block while ${bookState.userName} coordinates target zones! It burst into a wave of neon glitter, creating a giant sandbox for everyone to build together.`;
            break;
        case "environment":
            magicResolutionText = `Jayla and her ${bookState.userRole} tuck the ${coreSpark} jellybean into the dry soil. With a soft pop, sparkling vines shoot out from the ground, filling the community garden with rainbow sunflowers!`;
            break;
        case "animals":
            magicResolutionText = `Jayla tosses the ${coreSpark} jellybean high while ${bookState.userName} creates a soft, bouncy marshmallow cloud under the oak tree. The scared kitten leaps down safely, purring with joy!`;
            break;
    }

    craftedJellyText.innerText = magicResolutionText;
    labOutput.classList.remove("hidden");
}

function exportHighQualityStoryPDF() {
    stopCurrentSpeech();
    const pdfWindow = window.open("", "_blank");
    if (!pdfWindow) return alert("Please allow popups to view your printable book format!");
    
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>The Adventures of Jayla Jellybean</title>
            <style>
                body { font-family: 'Comic Sans MS', sans-serif; padding: 40px; color: #4c1d95; line-height: 1.6; max-width: 700px; margin: auto; }
                .book-header { text-align: center; border-bottom: 5px solid #fbcfe8; padding-bottom: 20px; margin-bottom: 40px; }
                h1 { color: #ec4899; margin: 0; }
                .page-block { background: #ffffff; border: 3px solid #fbcfe8; border-radius: 16px; padding: 30px; margin-bottom: 40px; page-break-inside: avoid; }
                .chapter-title { color: #8b5cf6; margin-top: 0; font-size: 1.5rem; border-bottom: 1px dashed #fbcfe8; padding-bottom: 8px; }
                .narrative { font-size: 1.2rem; text-align: justify; }
                .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 50px; }
            </style>
        </head>
        <body>
            <div class="book-header">
                <h1>🌈 The Adventures of Jayla Jellybean</h1>
                <p>Special Interactive Edition for Co-Inventor ${bookState.userName}</p>
            </div>
    `;

    bookState.storyPages.forEach(p => {
        htmlContent += `
            <div class="page-block">
                <div class="chapter-title">${p.chapter}: ${p.title}</div>
                <p class="narrative">${getProcessedText(p.template)}</p>
            </div>
        `;
    });

    htmlContent += `
            <div class="footer">© 2026 Jayla Jellybean Universe | All Rights Reserved.</div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `;

    pdfWindow.document.write(htmlContent);
    pdfWindow.document.close();
}
