/*
 * Arsenal Player Flashcards - main.js
 * Matches the supplied index12a.html.
 *
 * Player images use Wikimedia Commons Special:FilePath URLs.
 * Verify the individual Commons page/license before publishing.
 */
"use strict";

const players = [
  {
    name: "Bukayo Saka",
    number: 7,
    position: "Forward",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_bukayo_saka_arsenal_2025_(cropped).jpg"
  },
  {
    name: "William Saliba",
    number: 2,
    position: "Defender",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_william_saliba_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Gabriel Magalhães",
    number: 6,
    position: "Defender",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Gabriel_Magalhaes_Arsenal_2025.jpg"
  },
  {
    name: "Jurrien Timber",
    number: 12,
    position: "Defender",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jurrien_Timber_Celebrates.jpg"
  },
  {
    name: "Martin Ødegaard",
    number: 8,
    position: "Midfielder",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Arsenal_v_Everton_-_52223349030_(Martin_Ødegaard,_capitão_do_Arsenal).jpg"
  },
  {
    name: "Declan Rice",
    number: 41,
    position: "Midfielder",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/2024_Emirates_Cup_-_Declan_Rice.jpg"
  },
  {
    name: "Mikel Merino",
    number: 23,
    position: "Midfielder",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_mikel_merino_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Martin Zubimendi",
    number: 36,
    position: "Midfielder",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Martín_Zubimendi_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Gabriel Martinelli",
    number: 11,
    position: "Forward",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Gabriel_Martinelli_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Eberechi Eze",
    number: 10,
    position: "Midfielder",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Eberechi_Eze_2026.jpg"
  },
  {
    name: "Noni Madueke",
    number: 20,
    position: "Forward",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Noni_Madueke.jpg"
  },
  {
    name: "Jakub Kiwior",
    number: 15,
    position: "Defender",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Jakub_Kiwior_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Myles Lewis-Skelly",
    number: 49,
    position: "Defender",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_Myles_Lewis-Skelly_arsenal_2025_(cropped).jpg"
  },
  {
    name: "Reiss Nelson",
    number: 24,
    position: "Forward",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/1_reiss_nelson_arsenal_2025.jpg"
  }
];

const $ = (id) => document.getElementById(id);
const answerInputs = [...document.querySelectorAll("#answers input")];
const playerImage = $("player-image");
const result = $("result");
const submitButton = $("submit");
const nextButton = $("next");
const scoreNumber = $("score-number");
const correctCount = $("correct-count");
const attemptCount = $("attempt-count");
const accuracy = $("accuracy");
const progressText = $("progress-text");
const progressBar = $("progress-bar");

let currentPlayer = null;
let deck = [];
let correct = 0;
let attempts = 0;
let answered = false;
let completed = 0;

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function updateScore() {
  scoreNumber.textContent = correct;
  correctCount.textContent = correct;
  attemptCount.textContent = attempts;
  accuracy.textContent = attempts ? `${Math.round((correct / attempts) * 100)}%` : "0%";

  const progress = Math.round((completed / players.length) * 100);
  progressText.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
}

function showResult(message, type) {
  result.textContent = message;
  result.style.color = type === "correct" ? "#d4af37" : "#ff6b6b";
  result.style.transform = "scale(1.02)";
  setTimeout(() => { result.style.transform = "scale(1)"; }, 180);
}

function resetChoices() {
  answerInputs.forEach((input) => {
    input.value = "";
    input.disabled = false;
    input.style.borderColor = "";
    input.style.background = "";
  });
  result.textContent = "";
  result.style.color = "";
}

function getChoices() {
  const wrong = shuffle(players.filter(p => p.name !== currentPlayer.name)).slice(0, 3);
  return shuffle([currentPlayer, ...wrong]);
}

function loadPlayer() {
  if (!deck.length) deck = shuffle(players);
  currentPlayer = deck.pop();
  answered = false;
  resetChoices();

  playerImage.alt = `${currentPlayer.name} Arsenal player`;
  playerImage.src = currentPlayer.image;
  playerImage.style.animation = "none";
  void playerImage.offsetWidth;
  playerImage.style.animation = "cardIn .45s ease both";

  const choices = getChoices();
  answerInputs.forEach((input, index) => {
    input.value = choices[index].name;
    input.dataset.answer = choices[index].name;
    input.setAttribute("aria-label", `Answer option ${index + 1}: ${choices[index].name}`);
  });

  submitButton.disabled = false;
  nextButton.disabled = true;
  submitButton.textContent = "✓  Submit Answer";
}

function selectInput(input) {
  if (answered) return;
  answerInputs.forEach((item) => {
    item.style.borderColor = "";
    item.style.background = "";
  });
  input.style.borderColor = "#db0007";
  input.style.background = "rgba(219,0,7,.13)";
}

function submitAnswer() {
  if (answered) return;

  const selected = answerInputs.find(input => input === document.activeElement) ||
                   answerInputs.find(input => input.value.trim());

  if (!selected) {
    showResult("Please choose an answer first.", "wrong");
    return;
  }

  answered = true;
  attempts++;

  const isCorrect = normalize(selected.value) === normalize(currentPlayer.name);
  if (isCorrect) correct++;
  completed++;

  answerInputs.forEach(input => {
    input.disabled = true;
    if (normalize(input.value) === normalize(currentPlayer.name)) {
      input.style.borderColor = "#d4af37";
      input.style.background = "rgba(212,175,55,.14)";
    }
  });

  selected.style.borderColor = isCorrect ? "#d4af37" : "#ff4d5a";
  selected.style.background = isCorrect ? "rgba(212,175,55,.14)" : "rgba(219,0,7,.18)";

  showResult(
    isCorrect
      ? `✓ Correct! That's ${currentPlayer.name}.`
      : `✗ The correct answer is ${currentPlayer.name}.`,
    isCorrect ? "correct" : "wrong"
  );

  submitButton.disabled = true;
  submitButton.textContent = isCorrect ? "✓  Correct!" : "Answer Submitted";
  nextButton.disabled = false;
  updateScore();
}

function nextPlayer() {
  loadPlayer();
}

answerInputs.forEach(input => {
  input.addEventListener("click", () => selectInput(input));
  input.addEventListener("focus", () => selectInput(input));
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") submitAnswer();
  });
});

submitButton.addEventListener("click", submitAnswer);
nextButton.addEventListener("click", nextPlayer);

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    if (!answered) submitAnswer();
    else if (!nextButton.disabled) nextPlayer();
  }
});

playerImage.addEventListener("error", () => {
  playerImage.removeAttribute("src");
  playerImage.alt = `${currentPlayer.name} image unavailable`;
});

updateScore();
loadPlayer();
