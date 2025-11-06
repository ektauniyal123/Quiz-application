// Sounds
const clickSound = new Audio('sounds/click.wav');
const successSound = new Audio('sounds/success.wav');
const failSound = new Audio('sounds/fail.wav');
const timeupSound = new Audio('sounds/timeup.wav');

// Quiz data: 10 MCQs (OOPs, OS, CN, Web)
const quizData = [
  { q: "Which OOP concept binds data and methods together?", opts: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], a: 2 },
  { q: "Which is an example of runtime polymorphism?", opts: ["Method Overloading", "Method Overriding", "Encapsulation", "Constructor"], a: 1 },
  { q: "Which OS scheduling algorithm is non-preemptive?", opts: ["Round Robin", "FCFS", "SJF (Preemptive)", "Priority (Preemptive)"], a: 1 },
  { q: "Deadlock occurs when:", opts: ["Processes run in parallel", "Multiple processes share memory", "Resources are held and waited circularly", "OS crashes"], a: 2 },
  { q: "What does IP stand for in networking?", opts: ["Internet Protocol", "Internal Program", "Interface Packet", "Integrated Process"], a: 0 },
  { q: "At which OSI layer does TCP operate?", opts: ["Network", "Transport", "Application", "Session"], a: 1 },
  { q: "DBMS stands for ?", opts: ["Data-Base Management System", "Data-Base Main System", " DB Monitor System", "Data-Base Management Score"], a: 0 },
  { q: "Which CSS property changes text color?", opts: ["font-style", "color", "background-color", "text-align"], a: 1 },
  { q: "Which language is mainly used to add interactivity to websites?", opts: ["HTML", "CSS", "JavaScript", "SQL"], a: 2 },
  { q: "Which JavaScript operator checks strict equality?", opts: ["=", "==", "===", "!="], a: 2 }
];

// State
let idx = 0;
let score = 0;
let timer = 20;
let intervalId = null;
let locked = false;
const TOTAL = quizData.length;

// Elements
const welcome = document.getElementById('welcome');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

const qEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const qCounter = document.getElementById('qCounter');
const liveScore = document.getElementById('liveScore');
const progressBar = document.getElementById('progressBar');
const timerEl = document.getElementById('timer');

const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const bestScoreText = document.getElementById('bestScoreText');

// Event listeners
startBtn.addEventListener('click', () => {
  clickSound.currentTime = 0; clickSound.play();
  startQuiz();
});
nextBtn.addEventListener('click', () => {
  clickSound.currentTime = 0; clickSound.play();
  nextQuestion();
});
restartBtn.addEventListener('click', () => {
  clickSound.currentTime = 0; clickSound.play();
  restartQuiz();
});
playAgainBtn.addEventListener('click', () => {
  clickSound.currentTime = 0; clickSound.play();
  restartQuiz();
});

function startQuiz() {
  welcome.style.display = 'none';
  resultScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  idx = 0;
  score = 0;
  updateHeader();
  renderQuestion();
  startTimer();
}

function restartQuiz() {
  quizScreen.style.display = 'block';
  resultScreen.style.display = 'none';
  idx = 0;
  score = 0;
  updateHeader();
  renderQuestion();
  startTimer();
  restartBtn.style.display = 'none';
  nextBtn.disabled = false;
}

function updateHeader() {
  qCounter.textContent = `Q ${idx + 1} of ${TOTAL}`;
  liveScore.textContent = `Score: ${score}`;
  const pct = (idx / TOTAL) * 100;
  progressBar.style.width = `${pct}%`;
}

function renderQuestion() {
  locked = false;
  nextBtn.disabled = false;
  timer = 20;
  timerEl.textContent = timer;
  answersEl.innerHTML = '';
  const item = quizData[idx];
  qEl.textContent = item.q;
  item.opts.forEach((opt, i) => {
    const div = document.createElement('label');
    div.className = 'answer';
    div.innerHTML = `<input type="radio" name="opt" value="${i}"><span>${opt}</span>`;
    div.addEventListener('click', () => onSelect(i, div));
    answersEl.appendChild(div);
  });
}

function onSelect(i, el) {
  if (locked) return;
  locked = true;
  stopTimer();
  const correct = quizData[idx].a;
  const answerNodes = Array.from(document.querySelectorAll('.answer'));
  answerNodes.forEach((node, k) => {
    if (k === correct) node.classList.add('correct');
    else if (k === i) node.classList.add('wrong');
  });
  if (i === correct) score++;
  liveScore.textContent = `Score: ${score}`;
}

function startTimer() {
  stopTimer();
  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      stopTimer();
      // Reveal correct and allow next
      const correct = quizData[idx].a;
      const nodes = Array.from(document.querySelectorAll('.answer'));
      nodes.forEach((node, k) => {
        if (k === correct) node.classList.add('correct');
      });
      timeupSound.currentTime = 0; timeupSound.play();
      locked = true;
    }
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function nextQuestion() {
  if (!locked) {
    // Require selection or timeout before moving on
    // If user clicks Next without answering, treat as timeout
    stopTimer();
    const correct = quizData[idx].a;
    const nodes = Array.from(document.querySelectorAll('.answer'));
    nodes.forEach((node, k) => {
      if (k === correct) node.classList.add('correct');
    });
    locked = true;
    return;
  }
  idx++;
  if (idx < TOTAL) {
    updateHeader();
    renderQuestion();
    startTimer();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  quizScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  const pct = Math.round((score / TOTAL) * 100);
  const message =
    score >= 9 ? "🏆 Perfect! You're a Quiz Master!" :
    score >= 8 ? "🎉 Hurray! You did great!" :
    score >= 5 ? "🙂 Nice effort. Keep practicing!" :
                 "😅 Oops! Better luck next time!";

  resultTitle.textContent = `You scored ${score}/${TOTAL} (${pct}%)`;
  resultText.textContent = message;

  // Sounds on result
  if (score >= 8) { successSound.currentTime = 0; successSound.play(); }
  else { failSound.currentTime = 0; failSound.play(); }

  // Best score (localStorage)
  try {
    const key = 'bestScore10';
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    if (score > prev) {
      localStorage.setItem(key, String(score));
    }
    const best = Math.max(score, prev);
    bestScoreText.textContent = `Your best score on this device: ${best}/${TOTAL}`;
  } catch (_) {
    bestScoreText.textContent = '';
  }

  // Reset headers/progress
  progressBar.style.width = '100%';
  restartBtn.style.display = 'inline-block';
}
