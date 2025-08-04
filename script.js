const category = localStorage.getItem("selectedCategory");
document.getElementById("category-title").textContent = "カテゴリ：" + category;

let allData = [];
let filtered = [];
let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");

async function loadQuiz() {
  const res = await fetch("quiz.json");
  allData = await res.json();

  filtered = shuffle(
    allData.filter(q => q.tags && q.tags.includes(category))
  ).slice(0, 10);

  showQuestion();
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const q = filtered[current];
  questionEl.textContent = `Q${current + 1}. ${q.question}`;
  choicesEl.innerHTML = "";
  resultEl.textContent = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    choicesEl.appendChild(btn);
  });
}

function checkAnswer(i) {
  const correct = filtered[current].answer;
  resultEl.textContent =
    i === correct
      ? "正解！"
      : `不正解… 正解は「${filtered[current].choices[correct]}」`;

  if (i === correct) score++;

  setTimeout(() => {
    current++;
    if (current < filtered.length) {
      showQuestion();
    } else {
      showFinalScore();
    }
  }, 1500);
}

function showFinalScore() {
  questionEl.textContent = "クイズ終了！";
  choicesEl.innerHTML = "";
  resultEl.innerHTML = `スコア：${score} / ${filtered.length}`;

  // スコア履歴を保存
  saveScoreHistory(category, score, filtered.length);
}

function saveScoreHistory(category, score, total) {
  const key = "quiz_scores";
  const data = JSON.parse(localStorage.getItem(key) || "{}");

  if (!data[category]) data[category] = [];

  data[category].push({
    score: score,
    total: total,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(key, JSON.stringify(data));
}

loadQuiz();
