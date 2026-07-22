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
    adventure: { middle: 6 },
    quick:     { middle: 12 },
    challenge: { middle: 20 },
    postTest:  { middle: 20 }
  },

  // 難度配比（基礎／標準／挑戰）。加起來要等於 1。
  difficultyRatio: {
    adventure: { 基礎: 0.40, 標準: 0.45, 挑戰: 0.15 },
    quick:     { 基礎: 0.50, 標準: 0.40, 挑戰: 0.10 },
    challenge: { 基礎: 0.20, 標準: 0.50, 挑戰: 0.30 },
    postTest:  { 基礎: 0.30, 標準: 0.50, 挑戰: 0.20 }
  },

  // 同一個部件最多可以連續出現幾題
  maxSameRadicalInARow: 2,

  stages: {
    1: { name: "部首情報室", icon: "🔎",
         remind: "你已掌握部首常提示的意義範圍。下一關要追蹤同一部件形成的字族。",
         passcode: "部首給方向，整個字才是答案。" },
    2: { name: "字族追蹤室", icon: "🧩",
         remind: "同一部件換上不同部首，字義也跟著改變。接著把線索放進句子驗證。",
         passcode: "共同部件連字族，不同部首辨字義。" },
    3: { name: "情境鑑識室", icon: "🛠️",
         remind: "你已能用句意檢查部首線索。下一關必須自己叫出字來。",
         passcode: "選完字，再放回句子讀一次。" },
    4: { name: "字量搜索區", icon: "⌨️",
         remind: "主動寫出字比看選項更難。最後一關要整合字義、字族與例外。",
         passcode: "能自己叫出的字，才真正進入記憶。" },
    5: { name: "核心檔案庫", icon: "🏅",
         remind: "失竊的文字核心已修復。",
         passcode: "先看部首猜字義，再沿共同部件追字族。" }
  },

  // 評語級距（下限分數 → 稱號與講評方向）
  ranks: [
    { min: 86, title: "首席部件偵探",
      comment: "你已經能穩定用部件判斷字義，而且很少被形近字騙走。接下來要練的不是「更多題」，而是遇到部件不表意的例外時，怎麼靠句子再確認一次。",
      next: "挑戰模式全對之後，試著自己出題考同學：找三個同部件的字，再找一個「部件不表意」的例外。" },
    { min: 71, title: "資深部件偵探",
      comment: "大方向抓得很準，錯的多半是形近字的細節。你的判斷是對的，只是最後一步沒有回到句子裡檢查。",
      next: "答題時養成習慣：先說部首提示，再把字放回句子念一次。" },
    { min: 41, title: "見習部件偵探",
      comment: "你已經知道要看部件了，但有時候會被右邊的聲旁吸引，或是把讀音相同的字混在一起。這很正常，代表你正在建立新的習慣。",
      next: "先集中練第 1、2 關。把「氵、扌、言、貝、足、食」的提示範圍說熟，再練青、包、交、艮字族。" },
    { min: 0, title: "初入文字王國",
      comment: "現在還在靠印象猜字，這不是能力問題，而是還沒養成「先看部件」的習慣。每一題的解析都告訴你線索在哪裡，慢慢看完，不要急著跳過。",
      next: "從快速偵查開始。每答完一題，把部首念出來，再說一次它可能提示什麼。" }
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
  const skillCount = { 字義: 0, 字族: 0, 應用: 0, 提取: 0, 推理: 0 };

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
  currentOptions: []
};

const MODE_LABEL = {
  adventure: "完整辦案", quick: "快速偵查",
  challenge: "字量追緝", postTest: "結案檢核"
};
const LEVEL_LABEL = { middle: "中年級" };

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

  const box = $("options");
  box.innerHTML = "";
  $("recall-box").classList.add("hidden");
  $("recall-input").value = "";
  $("recall-input").disabled = false;
  $("btn-submit-recall").disabled = false;
  $("recall-count").textContent = "已輸入 0 個不同的字";

  if (q.type === "input") {
    state.currentOptions = [];
    box.className = "options hidden";
    $("recall-box").classList.remove("hidden");
    $("recall-input").focus();
    $("feedback").className = "feedback hidden";
    $("btn-next").classList.add("hidden");
    return;
  }

  box.className = "options" + (q.charOptions ? "" : " one-col");
  state.currentOptions = shuffle(
    q.options.map((text, i) => ({ text, correct: i === q.answerIndex }))
  );
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

function extractRecallChars(text) {
  return [...new Set(Array.from(text).filter(ch => /[\u3400-\u9FFF\uF900-\uFAFF]/u.test(ch)))];
}

function submitRecall() {
  if (state.locked) return;
  const q = state.queue[state.qIndex];
  if (!q || q.type !== "input") return;

  const chars = extractRecallChars($("recall-input").value);
  const accepted = new Set(q.accepted || []);
  const valid = chars.filter(ch => accepted.has(ch));
  const invalid = chars.filter(ch => !accepted.has(ch));
  const isCorrect = valid.length >= (q.minAnswers || 3);
  state.locked = true;
  if (isCorrect) state.stageCorrect++;

  state.answers.push({
    id:q.id, stage:q.stage, skillType:q.skillType, radical:q.radical,
    difficulty:q.difficulty, chosen:chars.join("、"), correct:isCorrect,
    validRecall:valid, unverifiedRecall:invalid
  });

  $("recall-input").disabled = true;
  $("btn-submit-recall").disabled = true;
  const fb = $("feedback");
  fb.className = "feedback " + (isCorrect ? "good" : "bad");
  $("fb-verdict").textContent = isCorrect ? "◎ 搜索完成" : "✗ 證物還不夠";
  $("fb-line").textContent = isCorrect
    ? `已確認 ${valid.length} 個：${valid.join("、")}`
    : `目前確認 ${valid.length} 個，至少需要 ${q.minAnswers || 3} 個。`;
  $("fb-explain").textContent = invalid.length
    ? `${q.explanation}　你輸入的「${invalid.join("、")}」不在本題答案庫，請交由老師確認。`
    : q.explanation;
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
  ["字義", "字族", "應用", "提取", "推理"].forEach(s => (skillStats[s] = { total: 0, correct: 0 }));
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

  // 五項能力
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
    a.download = `部首字族失竊案_${state.name}_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

bindChoiceGroup("[data-mode]", "mode");

$("btn-start").addEventListener("click", startGame);
$("btn-next").addEventListener("click", nextQuestion);
$("btn-submit-recall").addEventListener("click", submitRecall);
$("recall-input").addEventListener("input", () => {
  const n = extractRecallChars($("recall-input").value).length;
  $("recall-count").textContent = `已輸入 ${n} 個不同的字`;
});
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

function renderDossier() {
  const box = $("dossier-grid");
  box.innerHTML = (window.RADICAL_DOSSIER || []).map(d => `
    <article class="dossier-item">
      <div class="dossier-head"><span class="dossier-char">${escapeHTML(d.key)}</span><span>${escapeHTML(d.kind)}</span></div>
      <p>${escapeHTML(d.meaning)}</p>
      <div class="dossier-examples">${d.examples.map(escapeHTML).join("　")}</div>
    </article>`).join("");
}
renderDossier();
$("btn-dossier").addEventListener("click", () => $("dossier-modal").classList.remove("hidden"));
$("btn-close-dossier").addEventListener("click", () => $("dossier-modal").classList.add("hidden"));
$("dossier-modal").addEventListener("click", e => {
  if (e.target === $("dossier-modal")) $("dossier-modal").classList.add("hidden");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    $("modal").classList.add("hidden");
    $("dossier-modal").classList.add("hidden");
  }
});
