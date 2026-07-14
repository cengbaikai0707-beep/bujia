/* =========================================================
   script.js — 遊戲邏輯
   題目內容全部放在 questions.js，這個檔案不存任何題目。
   ========================================================= */

/* ---------------------------------------------------------
   GAME_CONFIG：老師可以直接改這裡
   --------------------------------------------------------- */
const GAME_CONFIG = {

  // 每次抽幾題。闖關模式是「每一關」的題數。
  counts: {
    basic:     { middle: 10, upper: 10 },
    adventure: { middle: 5,  upper: 6  },   // 五關 → 中年級 25 題、高年級 30 題
    quick:     { middle: 10, upper: 10 },
    challenge: { middle: 15, upper: 15 },
    postTest:  { middle: 15, upper: 20 }
  },

  // 難度配比（基礎／標準／挑戰）。加起來要等於 1。
  difficultyRatio: {
    basic:     { 基礎: 1.00, 標準: 0.00, 挑戰: 0.00 },   // 基礎補給站：全部基礎題
    adventure: { 基礎: 0.25, 標準: 0.55, 挑戰: 0.20 },   // 主線：減少過度簡單，偏推理
    quick:     { 基礎: 0.50, 標準: 0.40, 挑戰: 0.10 },
    challenge: { 基礎: 0.10, 標準: 0.40, 挑戰: 0.50 },   // 挑戰：拉高挑戰比例
    postTest:  { 基礎: 0.30, 標準: 0.50, 挑戰: 0.20 }
  },

  // 同一個部件最多可以連續出現幾題
  maxSameRadicalInARow: 2,

  stages: {
    1: { name: "部件認親", icon: "🔎",
         remind: "你已經學會辨認部件的長相。下一關要從一群字裡，找出它們共同的意思。",
         passcode: "同一個部件，常常帶著同一種意思。" },
    2: { name: "字義偵探", icon: "🧩",
         remind: "歸納是偵探最重要的本領。接下來，把線索用在真正的句子裡。",
         passcode: "把一群字排在一起，共同的部分就是線索。" },
    3: { name: "錯字修復", icon: "🛠️",
         remind: "你修好了好幾個句子。下一關會出現你沒學過的字，別怕。",
         passcode: "選字之前，先問這個字在講什麼。" },
    4: { name: "陌生字推理", icon: "🧭",
         remind: "遇到不認識的字也能推理，這是最關鍵的能力。最後一關，綜合出擊。",
         passcode: "不認識的字，先看部件，再猜方向。" },
    5: { name: "終極密碼", icon: "🏅",
         remind: "文字王國恢復秩序了。",
         passcode: "先看部件，再猜意思，最後放回句子檢查。" }
  },

  // 評語級距（下限分數 → 稱號與講評方向）
  ranks: [
    { min: 86, title: "首席部件偵探",
      comment: "你已經能穩定用部件判斷字義，而且很少被形近字騙走。接下來要練的不是「更多題」，而是遇到部件不表意的例外時，怎麼靠句子再確認一次。",
      next: "挑戰模式全對之後，試著自己出題考同學：找三個同部件的字，再找一個「部件不表意」的例外。" },
    { min: 71, title: "資深部件偵探",
      comment: "大方向抓得很準，錯的多半是形近字的細節。你的判斷是對的，只是最後一步沒有回到句子裡檢查。",
      next: "答題時養成習慣：選好字之後，把它放回句子念一次，看看意思順不順。" },
    { min: 41, title: "見習部件偵探",
      comment: "你已經知道要看部件了，但有時候會被右邊的聲旁吸引，或是把讀音相同的字混在一起。這很正常，代表你正在建立新的習慣。",
      next: "先集中練第 1、2 關。把「氵、忄、扌、言、貝、足」這六個部件的意思背熟，答題速度會明顯變快。" },
    { min: 0, title: "初入文字王國",
      comment: "現在還在靠印象猜字，這不是能力問題，而是還沒養成「先看部件」的習慣。每一題的解析都告訴你線索在哪裡，慢慢看完，不要急著跳過。",
      next: "從快速練習開始，一次十題就好。每答完一題，把那個部件念出來、說一次它代表什麼。" }
  ]
};

/* ---------------------------------------------------------
   小工具
   --------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------------------------------------------------
   抽題
   規則：符合年級／模式（闖關再加上關卡）→ 依難度配比抽 →
   同時讓四種能力盡量平均 → 題數不足時自動補題（絕不讓遊戲卡住）→
   最後重排順序，避免同一個部件連續出現太多次。
   --------------------------------------------------------- */
function drawQuestions(level, mode, stage) {
  const bank = window.QUESTION_BANK || [];
  const count = GAME_CONFIG.counts[mode][level];

  let pool = bank.filter(q =>
    q.level === level &&
    Array.isArray(q.mode) && q.mode.includes(mode) &&
    (stage == null || q.stage === stage)
  );

  if (pool.length === 0) return [];

  // 依配比算出每個難度要幾題
  const ratio = GAME_CONFIG.difficultyRatio[mode];
  const quota = {};
  let assigned = 0;
  const levels = ["基礎", "標準", "挑戰"];
  levels.forEach((d, i) => {
    quota[d] = (i === levels.length - 1)
      ? count - assigned                       // 最後一類補足，避免四捨五入誤差
      : Math.round(count * ratio[d]);
    assigned += quota[d];
  });

  const picked = [];
  const used = new Set();
  const skillCount = { 辨認: 0, 分類: 0, 應用: 0, 推理: 0 };

  // 從候選中挑一題：優先挑「目前出現最少的能力類型」
  function takeFrom(candidates) {
    const avail = candidates.filter(q => !used.has(q.id));
    if (avail.length === 0) return null;
    const minSkill = Math.min(...avail.map(q => skillCount[q.skillType] ?? 0));
    const best = avail.filter(q => (skillCount[q.skillType] ?? 0) === minSkill);
    const chosen = best[Math.floor(Math.random() * best.length)];
    used.add(chosen.id);
    skillCount[chosen.skillType] = (skillCount[chosen.skillType] ?? 0) + 1;
    picked.push(chosen);
    return chosen;
  }

  // 1) 依難度配額抽
  levels.forEach(d => {
    const byDiff = pool.filter(q => q.difficulty === d);
    for (let i = 0; i < quota[d]; i++) {
      if (!takeFrom(byDiff)) break;   // 這個難度不夠，先跳過，等下補題
    }
  });

  // 2) 不足時，先從同關卡的池子補
  while (picked.length < count && takeFrom(pool)) { /* 補題中 */ }

  // 3) 還是不足，就放寬到同年級同模式的所有題目
  if (picked.length < count) {
    const wider = bank.filter(q =>
      q.level === level && Array.isArray(q.mode) && q.mode.includes(mode)
    );
    while (picked.length < count && takeFrom(wider)) { /* 補題中 */ }
  }

  return spaceOutRadicals(shuffle(picked));
}

// 避免同一個部件連續出現超過上限。找不到更好的排法就維持原樣。
function spaceOutRadicals(list) {
  const max = GAME_CONFIG.maxSameRadicalInARow;
  const out = [];
  const rest = list.slice();

  while (rest.length) {
    let idx = rest.findIndex(q => {
      const tail = out.slice(-max);
      return !(tail.length === max && tail.every(t => t.radical === q.radical));
    });
    if (idx === -1) idx = 0;          // 沒得換了，就照原順序
    out.push(rest.splice(idx, 1)[0]);
  }
  return out;
}

/* ---------------------------------------------------------
   遊戲狀態
   --------------------------------------------------------- */
const state = {
  name: "", level: "middle", mode: "adventure",
  stages: [],        // 闖關模式：[[第1關題目], [第2關題目], ...]；其他模式只有一組
  stageIndex: 0,
  queue: [],         // 目前這一關的題目
  qIndex: 0,
  answers: [],       // 全部作答紀錄
  stageCorrect: 0,
  locked: false,
  currentOptions: [],
  examQueue: [],     // 考前快寫：這一輪抽到的部件
  examIndex: 0
};

const MODE_LABEL = {
  basic: "基礎補給站", adventure: "闖關模式", quick: "快速練習",
  challenge: "挑戰模式", postTest: "後測模式", exam: "考前快寫"
};
const LEVEL_LABEL = { middle: "中年級", upper: "高年級" };

/* ---------------------------------------------------------
   畫面切換
   --------------------------------------------------------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  $("topbar").classList.toggle("hidden", id !== "screen-game");
  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------
   開始遊戲
   --------------------------------------------------------- */
function startGame() {
  state.name = $("input-name").value.trim() || "無名偵探";
  state.answers = [];
  state.stageIndex = 0;

  if (state.mode === "adventure") {
    state.stages = [1, 2, 3, 4, 5].map(s => drawQuestions(state.level, "adventure", s));
  } else {
    state.stages = [drawQuestions(state.level, state.mode, null)];
  }

  const total = state.stages.reduce((n, s) => n + s.length, 0);
  if (total === 0) {
    alert("題庫裡找不到符合條件的題目，請檢查 questions.js。");
    return;
  }

  loadStage(0);
  showScreen("screen-game");
}

function loadStage(i) {
  state.stageIndex = i;
  state.queue = state.stages[i];
  state.qIndex = 0;
  state.stageCorrect = 0;
  renderQuestion();
}

/* ---------------------------------------------------------
   出題
   --------------------------------------------------------- */
function totalQuestions() {
  return state.stages.reduce((n, s) => n + s.length, 0);
}
function answeredCount() {
  return state.answers.length;
}

function renderQuestion() {
  const q = state.queue[state.qIndex];
  state.locked = false;

  // 上方狀態列
  const stageNo = state.mode === "adventure" ? state.stageIndex + 1 : null;
  $("bar-stage").textContent = stageNo
    ? `第 ${stageNo} 關 · ${GAME_CONFIG.stages[stageNo].name}`
    : MODE_LABEL[state.mode];
  $("bar-mode").textContent = `${LEVEL_LABEL[state.level]} · ${MODE_LABEL[state.mode]}`;
  $("bar-progress").textContent = `${answeredCount() + 1} / ${totalQuestions()}`;
  $("progress-fill").style.width = (answeredCount() / totalQuestions() * 100) + "%";

  // 田字格線索（只有題目有 focus 欄位才顯示）
  if (q.focus) {
    $("focus-char").textContent = q.focus;
    $("focus-label").textContent = q.skillType === "推理" ? "這個字你可能沒學過" : "線索部件";
    $("focus-box").classList.remove("hidden");
  } else {
    $("focus-box").classList.add("hidden");
  }

  $("q-meta").textContent = `${q.skillType}　難度：${q.difficulty}`;
  $("q-text").innerHTML = escapeHTML(q.question).replace(/＿＿/g, '<span class="blank">＿＿</span>');

  // 選項：打亂順序，但記住哪一個是正解
  state.currentOptions = shuffle(
    q.options.map((text, i) => ({ text, correct: i === q.answerIndex }))
  );

  const box = $("options");
  box.className = "options" + (q.charOptions ? "" : " one-col");
  box.innerHTML = "";
  const keys = ["A", "B", "C", "D", "E", "F"];
  state.currentOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt" + (q.charOptions ? " opt-char" : "");
    btn.innerHTML = `<span class="opt-key">${keys[i]}</span><span class="opt-text">${escapeHTML(opt.text)}</span>`;
    btn.addEventListener("click", () => answer(i));
    box.appendChild(btn);
  });

  $("feedback").className = "feedback hidden";
  $("btn-next").classList.add("hidden");
  $("btn-next").textContent =
    (state.qIndex === state.queue.length - 1) ? "完成這一關" : "下一題";
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------------------------------------------------
   作答
   --------------------------------------------------------- */
function answer(chosenIdx) {
  if (state.locked) return;
  state.locked = true;

  const q = state.queue[state.qIndex];
  const chosen = state.currentOptions[chosenIdx];
  const isCorrect = chosen.correct;
  if (isCorrect) state.stageCorrect++;

  state.answers.push({
    id: q.id,
    stage: q.stage,
    skillType: q.skillType,
    radical: q.radical,
    difficulty: q.difficulty,
    chosen: chosen.text,
    correct: isCorrect
  });

  // 標示選項
  const btns = $("options").querySelectorAll(".opt");
  btns.forEach((b, i) => {
    b.disabled = true;
    if (state.currentOptions[i].correct) b.classList.add("is-correct");
    else if (i === chosenIdx) b.classList.add("is-wrong");
  });

  // 回饋
  const fb = $("feedback");
  fb.className = "feedback " + (isCorrect ? "good" : "bad");
  $("fb-verdict").textContent = isCorrect ? "◎ 線索正確" : "✗ 再看一次部件";
  $("fb-line").textContent = isCorrect ? q.correctFeedback : q.wrongHint;
  $("fb-explain").textContent = q.explanation;

  $("bar-progress").textContent = `${answeredCount()} / ${totalQuestions()}`;
  $("progress-fill").style.width = (answeredCount() / totalQuestions() * 100) + "%";
  $("btn-next").classList.remove("hidden");
}

function nextQuestion() {
  if (state.qIndex < state.queue.length - 1) {
    state.qIndex++;
    renderQuestion();
    return;
  }
  // 這一關結束
  if (state.mode === "adventure" && state.stageIndex < state.stages.length - 1) {
    showStageEnd();
  } else if (state.mode === "adventure") {
    showStageEnd(true);
  } else {
    showResult();
  }
}

/* ---------------------------------------------------------
   過關畫面
   --------------------------------------------------------- */
function showStageEnd(isFinal = false) {
  const no = state.stageIndex + 1;
  const cfg = GAME_CONFIG.stages[no];

  $("stage-icon").textContent = cfg.icon;
  $("stage-title").textContent = isFinal ? "全部關卡完成" : `第 ${no} 關完成`;
  $("stage-score").textContent = `這一關答對 ${state.stageCorrect} / ${state.queue.length} 題`;
  $("stage-remind").textContent = cfg.remind;

  $("passcode-text").textContent = cfg.passcode;
  $("passcode").classList.remove("hidden");

  $("btn-continue").textContent = isFinal ? "查看結案報告" : "前往下一關";
  $("btn-continue").onclick = () => {
    if (isFinal) showResult();
    else { loadStage(state.stageIndex + 1); showScreen("screen-game"); }
  };

  showScreen("screen-stage");
}

/* ---------------------------------------------------------
   統計與結果頁
   --------------------------------------------------------- */
function buildStats() {
  const total = state.answers.length;
  const correct = state.answers.filter(a => a.correct).length;
  const accuracy = total ? Math.round(correct / total * 100) : 0;

  const skillStats = {};
  ["辨認", "分類", "應用", "推理"].forEach(s => (skillStats[s] = { total: 0, correct: 0 }));
  const radicalMistakes = {};

  state.answers.forEach(a => {
    if (!skillStats[a.skillType]) skillStats[a.skillType] = { total: 0, correct: 0 };
    skillStats[a.skillType].total++;
    if (a.correct) skillStats[a.skillType].correct++;
    else radicalMistakes[a.radical] = (radicalMistakes[a.radical] || 0) + 1;
  });

  const rank = GAME_CONFIG.ranks.find(r => accuracy >= r.min);
  return { total, correct, accuracy, skillStats, radicalMistakes, rank };
}

function showResult() {
  const st = buildStats();

  $("r-name").textContent = state.name;
  $("r-context").textContent =
    `${LEVEL_LABEL[state.level]}　${MODE_LABEL[state.mode]}　${new Date().toLocaleDateString("zh-TW")}`;
  $("r-accuracy").textContent = st.accuracy + "%";
  $("r-rank").textContent = st.rank.title;
  $("r-count").textContent = `答對 ${st.correct} 題 / 共 ${st.total} 題`;

  // 四項能力
  const skillBox = $("r-skills");
  skillBox.innerHTML = "";
  Object.entries(st.skillStats).forEach(([name, s]) => {
    const div = document.createElement("div");
    div.className = "skill";
    if (s.total === 0) {
      div.innerHTML = `<div class="skill-top"><span class="skill-name">${name}</span>
        <span class="skill-none">這次沒有抽到這一類題目</span></div>`;
    } else {
      const pct = Math.round(s.correct / s.total * 100);
      const tone = pct >= 80 ? "high" : pct >= 50 ? "mid" : "low";
      div.innerHTML = `
        <div class="skill-top">
          <span class="skill-name">${name}</span>
          <span class="skill-num">${s.correct} / ${s.total}　${pct}%</span>
        </div>
        <div class="skill-rail"><div class="skill-bar ${tone}" style="width:${pct}%"></div></div>`;
    }
    skillBox.appendChild(div);
  });

  // 常錯部件
  const misBox = $("r-mistakes");
  const mis = Object.entries(st.radicalMistakes).sort((a, b) => b[1] - a[1]);
  misBox.innerHTML = mis.length
    ? mis.map(([r, n]) => `<span class="chip"><span class="ch">${r}</span><span class="ct">錯 ${n} 次</span></span>`).join("")
    : `<p class="skill-none">這一次沒有錯題，部件全部認對了。</p>`;

  $("r-comment").textContent = st.rank.comment;
  $("r-next").textContent = mis.length
    ? `${st.rank.next}　特別留意這幾個部件：${mis.slice(0, 3).map(m => m[0]).join("、")}。`
    : st.rank.next;

  showScreen("screen-result");
}

/* ---------------------------------------------------------
   匯出結果
   --------------------------------------------------------- */
function exportResult() {
  const st = buildStats();
  const data = {
    studentName: state.name,
    level: state.level,
    mode: state.mode,
    totalQuestions: st.total,
    correctCount: st.correct,
    accuracy: st.accuracy,
    skillStats: st.skillStats,
    radicalMistakes: st.radicalMistakes,
    answers: state.answers,
    completedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `部件偵探社_${state.name}_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------
   考前快寫 exam：無評分，看部件 → 自己寫 10 個字 → 對照答案庫
   --------------------------------------------------------- */
const EXAM_PER_SESSION = 6;

function startExam() {
  state.name = $("input-name").value.trim() || "無名偵探";
  state.mode = "exam";
  const bank = window.EXAM_BANK || [];
  if (!bank.length) { alert("找不到考前快寫的答案庫，請檢查 questions.js。"); return; }
  state.examQueue = shuffle(bank).slice(0, Math.min(EXAM_PER_SESSION, bank.length));
  state.examIndex = 0;
  renderExam();
  showScreen("screen-exam");
}

function renderExam() {
  const e = state.examQueue[state.examIndex];
  $("exam-progress").textContent = `第 ${state.examIndex + 1} / ${state.examQueue.length} 個部件`;
  $("exam-radical").textContent = e.radical;
  $("exam-radical-name").textContent = e.radicalName || "";
  $("exam-prompt").textContent = e.prompt;

  const gbox = $("exam-groups");
  gbox.innerHTML = "";
  e.groups.forEach(g => {
    const div = document.createElement("div");
    div.className = "exam-group";
    div.innerHTML = `<p class="exam-group-label">${escapeHTML(g.label)}</p>
      <div class="exam-chars">${g.chars.map(c => `<span class="exam-char">${escapeHTML(c)}</span>`).join("")}</div>`;
    gbox.appendChild(div);
  });
  $("exam-meaning").textContent = "意義方向：" + (e.meaningHint || "");
  $("exam-caution").textContent = e.caution ? ("提醒：" + e.caution) : "";

  $("exam-answers").classList.add("hidden");
  $("btn-exam-reveal").classList.remove("hidden");
  $("btn-exam-next").textContent =
    (state.examIndex === state.examQueue.length - 1) ? "看練習回顧" : "下一個部件";
}

function revealExam() {
  $("exam-answers").classList.remove("hidden");
  $("btn-exam-reveal").classList.add("hidden");
}

function nextExam() {
  if (state.examIndex < state.examQueue.length - 1) {
    state.examIndex++;
    renderExam();
  } else {
    showExamResult();
  }
}

function showExamResult() {
  $("xr-name").textContent = state.name;
  $("xr-context").textContent =
    `考前快寫　${state.examQueue.length} 個部件　${new Date().toLocaleDateString("zh-TW")}`;

  const list = $("xr-list");
  list.innerHTML = "";
  state.examQueue.forEach(e => {
    const div = document.createElement("div");
    div.className = "exam-review-row";
    div.innerHTML = `<span class="exam-review-rad">${escapeHTML(e.radical)}</span>
      <span class="exam-review-hint">${escapeHTML(e.radicalName || "")}｜${escapeHTML(e.meaningHint || "")}</span>`;
    list.appendChild(div);
  });
  $("xr-review").textContent =
    "回家可以挑其中 2～3 個部件，各寫出 10 個字，並試著說出它們共同的意思方向。";
  showScreen("screen-exam-result");
}

/* ---------------------------------------------------------
   事件綁定
   --------------------------------------------------------- */
function bindChoiceGroup(selector, key) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(selector).forEach(b => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");
      state[key] = btn.dataset[key];
    });
  });
}

bindChoiceGroup("[data-level]", "level");

// 四張模式卡片，各自啟動
$("btn-basic").addEventListener("click", () => { state.mode = "basic"; startGame(); });
$("btn-adventure").addEventListener("click", () => { state.mode = "adventure"; startGame(); });
$("btn-challenge").addEventListener("click", () => { state.mode = "challenge"; startGame(); });
$("btn-exam").addEventListener("click", startExam);

// 考前快寫
$("btn-exam-reveal").addEventListener("click", revealExam);
$("btn-exam-next").addEventListener("click", nextExam);
$("btn-exam-quit").addEventListener("click", () => {
  if (confirm("現在離開，這次練習不會被保存。確定回首頁嗎？")) showScreen("screen-home");
});
$("btn-exam-again").addEventListener("click", startExam);
$("btn-exam-home").addEventListener("click", () => showScreen("screen-home"));

$("btn-next").addEventListener("click", nextQuestion);
$("btn-export").addEventListener("click", exportResult);
$("btn-again").addEventListener("click", startGame);
$("btn-home").addEventListener("click", () => showScreen("screen-home"));
$("btn-quit").addEventListener("click", () => {
  if (confirm("現在離開，這一次的作答不會被保存。確定回首頁嗎？")) showScreen("screen-home");
});

$("btn-howto").addEventListener("click", () => $("modal").classList.remove("hidden"));
$("btn-close-modal").addEventListener("click", () => $("modal").classList.add("hidden"));
$("modal").addEventListener("click", e => {
  if (e.target === $("modal")) $("modal").classList.add("hidden");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $("modal").classList.add("hidden");
});
