// Book Application State Manager
const bookState = {
    currentPageIndex: 0,
    audioPlaying: false,
    speechUtterance: null,
    userName: "Alex",
    userRole: "Chief Assistant",
    storyPages: [
        {
            chapter: "Chapter 1",
            title: "The Sugary Birthday",
            visualClass: "visual-p4",
            template: "Once upon a time, in a town filled with sugar plum houses and lollipop fences, lived a spunky little girl named Jayla Jellybean. Wherever she went, a trail of shimmering jellybeans followed in her wake! It all started on Jayla's eighth birthday, when a sprinkle of glitter dust tickled her nose. Poof! Out tumbled a perfectly formed blueberry jellybean! Her brilliant {ROLE} {NAME} watched in absolute amazement. But soon, Jayla discovered something even bigger: she possessed absolute Jellybean Generation! She could consciously create specific jellybeans with unique properties, utilizing them as a powerful force for good alongside her kind heart and unwavering optimism to protect her town from any sugary threat!"
        },
        {
            chapter: "Chapter 2",
            title: "The Sparkly Kitchen & Gauntlet",
            visualClass: "visual-p1",
            template: "Deep inside the Whispering Woods lived the evolved candy crusader, Jayla Jellybean. Jayla didn't make normal gadgets; she mixed starlight and fruit juice to create specialized tactical candies. Today, her kitchen smelled like warm cinnamon because her brilliant {ROLE} named {NAME} was helping calibrate the Jellybean Gauntlet—a special wrist-mounted device decorated with her favorite candy patterns designed to launch the perfect jellybean projectile to solve any real-world problem or aid a friend with a quick click and whir!"
        },
        {
            chapter: "Chapter 3",
            title: "The Sweetest Memories",
            visualClass: "visual-p2",
            template: "Rain lashed against the window, mirroring the storm brewing inside Jayla. Despite her amazing powers, she couldn't shake a deep sadness today—it was the anniversary of her grandma's passing. Memories flickered through Jayla's mind as her dedicated {ROLE} {NAME} sat quietly by her side. Suddenly, a soft glow caught {NAME}'s eye! Nestled amongst the colorful stash was a pearlescent white jellybean, radiating a warm vanilla aroma that left a faint inscription: 'Remember, the sweetest memories live on in every jellybean you create.' Wiping her tears, Jayla activated her Jellybean Generation. Together with {NAME}, they forged a special batch holding the ultimate tribute—her grandma's laugh became a fizzy lemon drop, her warm hugs became a gooey marshmallow, and her unwavering love became a heart-shaped cherry."
        },
        {
            chapter: "Chapter 4",
            title: "The Festival of Joy",
            visualClass: "visual-p4",
            template: "The annual Coral Springs Candy Festival was in full swing, and the air buzzed with excitement! Jayla Jellybean, alongside her tactical {ROLE} {NAME}, skipped down the street, their colorful costumes sparkling in the sun. Children chased after them, their pockets overflowing with the exotic treats they'd dispensed from their trusty Jellybean Gauntlet. As they rounded a corner, a group of children crowded around a crying toddler who had dropped his ice cream. Jayla immediately activated her Jellybean Vision, causing the world to shimmer and highlight the exact solution! Kneeling down, she offered the toddler a glimmering rainbow 'pick-me-up' jellybean. 'This isn't just any jellybean,' {NAME} explained with a wink. 'It's filled with all the happiness of a summer day!' The toddler popped it in, erupted into belly laughs, and the whole street cheered!"
        },
        {
            chapter: "Chapter 5",
            title: "Attack of the Gummy Golem!",
            visualClass: "visual-p2",
            template: "Chaos erupted in the town square! A monstrous figure made of swirling frosting and sour straps stomped through the streets—it was the Gummy Golem, a grumpy giant awakened by a candy imbalance! People scattered as it roared, but not Jayla Jellybean and her courageous {ROLE}, {NAME}. Tapping into her Jellybean Vision, the environment shifted into a high-tech lens, highlighting a massive, glistening target above the candy store. 'That's it!' Jayla cried, raising her Jellybean Gauntlet. With a click and a whir, the gauntlet transformed into a giant candy dispenser as {NAME} dialed in the coordinates. Utilizing Jellybean Generation, she loaded a single, ordinary-looking jellybean that rocketed upward, expanding until it squelched against the Golem's face! The supersized truth serum bean did its magic, shrinking the monster down to a tiny, tearful gingerbread cookie named Gummy George. Jayla and {NAME} gently explained that the world had simply forgotten the joy of candy, successfully saving the day with a well-placed projectile and a whole lot of heart!"
        },
        {
            chapter: "Chapter 6",
            title: "The Stormy Playground",
            visualClass: "visual-p2",
            template: "Walking to the local playground, Jayla and {NAME} noticed their friend Toby sitting all alone under a dark rain cloud on the swings. A group of older kids had accidentally kicked a soccer ball over his structural drawing. Toby was crying, and his drawing was fading under the gray drizzle. Jayla's gauntlet hummed softly as she prepared her next move."
        },
        {
            chapter: "Chapter 7",
            title: "The Neon Magic Pop",
            visualClass: "visual-p3",
            template: "Jayla reached into her candy pouch and pulled out a shimmering Neon Blue bean created through her conscious generation, while {NAME} cheered her on. 'Here, eat this!' Jayla smiled. Toby took a bite, and instantly, a glowing energy umbrella popped over his head, blocking out the rain! The blue sparkles flew onto the other kids' soccer ball, transforming it into a soft bubble."
        },
        {
            chapter: "Chapter 8",
            title: "Stronger Together",
            visualClass: "visual-p1",
            template: "Seeing the sparkling bubble, the other children laughed and ran over to help Toby rebuild his block fortress. Jayla and her brilliant {ROLE}, {NAME}, watched happily as new friendships grew right before their eyes. With a snap and a pop, her gauntlet began charging up with new sugar magic, ready to zoom up buildings or face the next runaway gumball avalanche!"
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

// Matrix Checklist Selectors
const chkGen = document.getElementById("chk-generation");
const chkVision = document.getElementById("chk-vision");
const chkGauntlet = document.getElementById("chk-gauntlet");
const powerChargeBar = document.getElementById("power-charge-bar");

// Bindings
btnPrev.addEventListener("click", () => shiftPage(-1));
btnNext.addEventListener("click", () => shiftPage(1));
btnAudio.addEventListener("click", controlSpeechRuntime);
btnPdf.addEventListener("click", exportHighQualityStoryPDF);
btnCraft.addEventListener("click", compileCustomLabJellybean);
if(btnApply) btnApply.addEventListener("click", applyCharacterPersonalization);

// Matrix tracking change events
[chkGen, chkVision, chkGauntlet].forEach(checkbox => {
    checkbox.addEventListener("change", evaluateMatrixScoreStatus);
});

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

    // Reset Checklist Matrix per chapter to prevent cheating
    chkGen.checked = false;
    chkVision.checked = false;
    chkGauntlet.checked = false;
    evaluateMatrixScoreStatus();
}

function evaluateMatrixScoreStatus() {
    let checkedCount = 0;
    if (chkGen.checked) checkedCount++;
    if (chkVision.checked) checkedCount++;
    if (chkGauntlet.checked) checkedCount++;

    const chargePercentage = (checkedCount / 3) * 100;
    powerChargeBar.style.width = `${chargePercentage}%`;

    // Success sound blip reward if all are matched
    if(checkedCount === 3) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            setTimeout(() => osc.frequency.setValueAtTime(659.25, ctx.currentTime), 80); // E5
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            osc.connect(gain);
gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime + 0.2);} catch(e) {}}}function applyCharacterPersonalization() {const nameInput = document.getElementById("user-name").value.trim();const roleInput = document.getElementById("user-role").value;if(nameInput !== "") {bookState.userName = nameInput;bookState.userRole = roleInput;renderActivePage();try {const ctx = new (window.AudioContext || window.webkitAudioContext)();const osc = ctx.createOscillator();const gain = ctx.createGain();osc.frequency.setValueAtTime(698.46, ctx.currentTime);gain.gain.setValueAtTime(0.04, ctx.currentTime);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime + 0.1);} catch(e) {}}}function shiftPage(offset) {bookState.currentPageIndex += offset;renderActivePage();}function controlSpeechRuntime() {if (bookState.audioPlaying) {stopCurrentSpeech();} else {const textToRead = getProcessedText(bookState.storyPages[bookState.currentPageIndex].template);bookState.speechUtterance = new SpeechSynthesisUtterance(textToRead);bookState.speechUtterance.rate = 0.95;bookState.speechUtterance.pitch = 1.1;bookState.speechUtterance.onend = () => {bookState.audioPlaying = false;btnAudio.innerText = "🔊 Read Aloud";};window.speechSynthesis.speak(bookState.speechUtterance);bookState.audioPlaying = true;btnAudio.innerText = "🛑 Stop Reading";}}function stopCurrentSpeech() {window.speechSynthesis.cancel();bookState.audioPlaying = false;btnAudio.innerText = "🔊 Read Aloud";}function compileCustomLabJellybean() {const coreSpark = document.getElementById("color-mix").value;const challengeTarget = document.getElementById("problem-mix").value;let magicResolutionText = "";switch(challengeTarget) {case "bullying":magicResolutionText = Jayla activates her Jellybean Vision! Highlighting a target grid, she fires the ${coreSpark} projectile from her Jellybean Gauntlet while ${bookState.userName} locks down coordinates. It bursts into a shimmering wave of neon glitter, creating a giant sandbox for everyone to share.;break;case "environment":magicResolutionText = Jayla triggers advanced Jellybean Generation! She creates a special customized variant, allowing her and ${bookState.userRole} ${bookState.userName} to plant the ${coreSpark} treat deep into the soil to instantly sprout rainbow sunflowers across the town square!;break;case "animals":magicResolutionText = Jayla spots a liquorice-styled line path using her lenses! Firing a soft ${coreSpark} cloud from her gauntlet, she creates a bouncy safety cushion below the tree while ${bookState.userName} guides the scared kitten down safely.;break;}craftedJellyText.innerText = magicResolutionText;labOutput.classList.remove("hidden");}function exportHighQualityStoryPDF() {stopCurrentSpeech();const pdfWindow = window.open("", "_blank");if (!pdfWindow) return alert("Please allow popups to view your printable book format!");let htmlContent = <!DOCTYPE html> <html> <head> <title>The Adventures of Jayla Jellybean</title> <style> body { font-family: 'Comic Sans MS', sans-serif; padding: 40px; color: #4c1d95; line-height: 1.6; max-width: 700px; margin: auto; } .book-header { text-align: center; border-bottom: 5px solid #fbcfe8; padding-bottom: 20px; margin-bottom: 40px; } h1 { color: #ec4899; margin: 0; } .page-block { background: #ffffff; border: 3px solid #fbcfe8; border-radius: 16px; padding: 30px; margin-bottom: 40px; page-break-inside: avoid; } .chapter-title { color: #8b5cf6; margin-top: 0; font-size: 1.5rem; border-bottom: 1px dashed #fbcfe8; padding-bottom: 8px; } .narrative { font-size: 1.2rem; text-align: justify; } .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 50px; } </style> </head> <body> <div class="book-header"> <h1>🌈 The Adventures of Jayla Jellybean</h1> <p>Superpower Edition featuring Co-Inventor ${bookState.userName}</p> </div>;bookState.storyPages.forEach(p => {htmlContent += <div class="page-block"> <div class="chapter-title">${p.chapter}: ${p.title}</div> <p class="narrative">${getProcessedText(p.template)}</p> </div>;});htmlContent += <div class="footer">© 2026 Jayla Jellybean Universe | All Rights Reserved.</div> <script> window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }; <\/script> </body> </html>;pdfWindow.document.write(htmlContent);pdfWindow.document.close();}
