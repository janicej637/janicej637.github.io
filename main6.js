"use strict";

let chores = JSON.parse(localStorage.getItem("coachChores") || "[]");
let activeTimer = null;
let soundEnabled = true;
let audioContext = null;

const coachMessages = [
  "You've got this! Keep pushing!",
  "Great effort! Don't give up!",
  "Stay focused and finish strong!",
  "Keep moving! You're doing great!",
  "Every second counts. Keep going!",
  "You're closer than you think!",
  "Nice work! Keep that momentum going!",
  "Champions finish what they start!",
  "Stay locked in. You've got this!",
  "Don't stop now. Finish the play!"
];

const countdownMessages = {
  10: "Ten seconds! Finish strong!",
  5: "Five seconds! Almost there!",
  3: "Three! Keep pushing!",
  2: "Two!",
  1: "One! Finish!"
};

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("coachChores", JSON.stringify(chores));
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function speak(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.04;
  u.pitch = 1.02;
  u.volume = 1;
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith("en"));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
  $("coachMessage").textContent = `"${text}"`;
}

function audio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(freq, duration = .12) {
  if (!soundEnabled) return;
  const ctx = audio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function beep() {
  tone(950, .08);
}

function startSound() {
  tone(600, .1);
  setTimeout(() => tone(850, .14), 110);
}

function finishSound() {
  tone(650, .12);
  setTimeout(() => tone(850, .12), 150);
  setTimeout(() => tone(1100, .3), 300);
}

function addChore() {
  const name = $("choreName").value.trim();
  const minutes = Number($("choreMinutes").value);

  if (!name || !minutes || minutes < 1) {
    speak("Coach says: enter a chore and a valid time.");
    return;
  }

  chores.push({
    id: Date.now(),
    name,
    duration: Math.round(minutes * 60),
    elapsed: 0,
    running: false,
    completed: false
  });

  $("choreName").value = "";
  save();
  render();
}

function startChore(id) {
  if (activeTimer) clearInterval(activeTimer);

  chores.forEach(c => c.running = false);
  const chore = chores.find(c => c.id === id);
  if (!chore || chore.completed) return;

  chore.running = true;
  startSound();
  speak("Let's go! Time to get it done!");

  activeTimer = setInterval(() => {
    chore.elapsed++;
    const remaining = chore.duration - chore.elapsed;

    if (remaining > 30 && remaining % 30 === 0 && Math.random() < .7) {
      speak(coachMessages[Math.floor(Math.random() * coachMessages.length)]);
    }

    if (remaining === 30) speak("Thirty seconds left! Finish strong!");

    if (remaining <= 10 && remaining > 0) {
      beep();
      if (countdownMessages[remaining]) speak(countdownMessages[remaining]);
    }

    if (remaining <= 0) {
      chore.elapsed = chore.duration;
      chore.running = false;
      clearInterval(activeTimer);
      activeTimer = null;
      finishSound();
      speak("Time's up! Great job! You finished your chore!");
    }

    save();
    render();
  }, 1000);

  render();
}

function pauseChore(id) {
  const chore = chores.find(c => c.id === id);
  if (!chore) return;
  chore.running = false;
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = null;
  speak("Quick timeout. Catch your breath and get ready to resume.");
  save();
  render();
}

function resetChore(id) {
  const chore = chores.find(c => c.id === id);
  if (!chore) return;
  chore.elapsed = 0;
  chore.running = false;
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = null;
  save();
  render();
}

function completeChore(id) {
  const chore = chores.find(c => c.id === id);
  if (!chore) return;
  chore.completed = true;
  chore.running = false;
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = null;
  finishSound();
  speak("Awesome job! Chore complete!");
  save();
  render();
}

function deleteChore(id) {
  if (!confirm("Delete this chore?")) return;
  chores = chores.filter(c => c.id !== id);
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = null;
  save();
  render();
}

function clearCompleted() {
  chores = chores.filter(c => !c.completed);
  save();
  render();
}

function render() {
  const list = $("choreList");
  $("emptyState").style.display = chores.length ? "none" : "block";

  list.innerHTML = chores.map(chore => {
    const remaining = Math.max(0, chore.duration - chore.elapsed);
    const percent = Math.min(100, chore.elapsed / chore.duration * 100);
    const warning = chore.running && remaining <= 30 && remaining > 0;

    return `
      <article class="chore-card ${chore.running ? "active" : ""} ${warning ? "warning" : ""} ${chore.completed ? "completed" : ""}">
        <div class="chore-top">
          <div>
            <div class="chore-name">${escapeHTML(chore.name)}</div>
            <div class="goal">GOAL: ${Math.round(chore.duration / 60)} MINUTES</div>
          </div>
          <div class="timer">${chore.completed ? "00:00" : formatTime(remaining)}</div>
          <div class="remaining">
            ${warning ? `<strong>🔥 ${remaining} SECONDS</strong> LEFT!` : chore.completed ? "<strong>✓ COMPLETED</strong> GREAT JOB!" : ""}
          </div>
          <div class="controls">
            ${!chore.completed && !chore.running ? `<button class="start" onclick="startChore(${chore.id})">▶ START</button>` : ""}
            ${chore.running ? `<button class="pause" onclick="pauseChore(${chore.id})">Ⅱ PAUSE</button>` : ""}
            ${!chore.completed ? `<button class="reset" onclick="resetChore(${chore.id})">↻ RESET</button>` : ""}
            ${!chore.completed ? `<button class="complete" onclick="completeChore(${chore.id})">✓ COMPLETE</button>` : ""}
            <button class="delete" onclick="deleteChore(${chore.id})">✕ DELETE</button>
          </div>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div>
      </article>
    `;
  }).join("");

  $("totalChores").textContent = chores.length;
  $("completedChores").textContent = chores.filter(c => c.completed).length;
  $("remainingChores").textContent = chores.filter(c => !c.completed).length;
}

$("addBtn").addEventListener("click", addChore);
$("clearBtn").addEventListener("click", clearCompleted);

$("speakBtn").addEventListener("click", () => {
  speak(coachMessages[Math.floor(Math.random() * coachMessages.length)]);
});

$("soundBtn").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  $("soundBtn").textContent = soundEnabled ? "🔊" : "🔇";
  if (!soundEnabled) speechSynthesis.cancel();
});

$("choreName").addEventListener("keydown", e => {
  if (e.key === "Enter") addChore();
});

render();
