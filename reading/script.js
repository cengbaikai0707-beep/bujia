const $ = id => document.getElementById(id);
const DIMENSIONS = ["問句定位","條件篩選","關係辨認","步驟排序","限制判斷","單位與表徵"];
const DIFF_LABEL = { basic:"基礎", standard:"標準", challenge:"挑戰", mixed:"混合" };
const BAND_LABEL = { middle:"中年級（三、四年級）", upper:"高年級（五、六年級）" };
const DIMENSION_TIPS = {
  "問句定位":"先只讀最後一句，圈出「要找什麼」和答案單位，再回頭找資料。",
  "條件篩選":"把資料分成「一定要用、可能要用、用不到」，不要看到數字就全部計算。",
  "關係辨認":"用短句重說一次：誰比誰多、每份多少、哪一個是總數。",
  "步驟排序":"先用箭頭寫出數量變化，再列算式；每做完一步都回頭看是否已回答問句。",
  "限制判斷":"看到至少、最多、不能超過、剩餘時，算完要用情境檢查答案能不能成立。",
  "單位與表徵":"先鎖定正確表格列，再統一單位；時間題可分段跨整點計算。"
};
const state = {
  name:"", mode:"diagnostic", band:"middle", diff:"mixed", count:8,
  queue:[], index:0, stage:"reading", answers:[], locked:false,
  currentOptions:[], hintUsed:false
};

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}

function show(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  $(screenId).classList.add("active");
  $("topbar").classList.toggle("hidden", screenId !== "screen-game");
  window.scrollTo(0, 0);
}

function selectChoice(selector, button) {
  document.querySelectorAll(selector).forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
}

function updateModeUI() {
  const practice = state.mode === "practice";
  $("practice-settings").classList.toggle("hidden", !practice);
  $("btn-start").textContent = practice ? "開始自由練習" : "開始完整診斷";
  $("mode-summary").textContent = practice ? "自由練習會從原題庫抽題：" : "完整診斷會測六項能力：";
  $("mode-detail").textContent = practice
    ? "適合課堂暖身與反覆熟練；結果只呈現本次練習表現，不把單題失誤當成能力定論。"
    : "問句定位、條件篩選、關係辨認、步驟排序、限制判斷、單位與表徵。";
}

document.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", function () {
  selectChoice("[data-mode]", this);
  state.mode = this.dataset.mode;
  updateModeUI();
}));
document.querySelectorAll("[data-band]").forEach(button => button.addEventListener("click", function () {
  selectChoice("[data-band]", this);
  state.band = this.dataset.band;
}));
document.querySelectorAll("[data-diff]").forEach(button => button.addEventListener("click", function () {
  selectChoice("[data-diff]", this);
  state.diff = this.dataset.diff;
}));
document.querySelectorAll("[data-count]").forEach(button => button.addEventListener("click", function () {
  selectChoice("[data-count]", this);
  state.count = Number(this.dataset.count);
}));

function drawDiagnostic() {
  const bank = window.READING_DIAGNOSTIC_BANK || [];
  return DIMENSIONS.flatMap(dimension => {
    const pool = bank.filter(q => q.band === state.band && q.dimension === dimension);
    return shuffle(pool).slice(0, 2);
  });
}

function isUpperPracticeQuestion(question) {
  const upperSkills = [
    "單位換算","時間順序","分數語意","比例換算","優惠條件","容積換算",
    "長方體體積","倒推","周長面積","估算","至少最多","餘數判斷"
  ];
  return upperSkills.includes(question.skill) || question.difficulty === "挑戰";
}

function drawPractice() {
  const bank = window.READING_QUESTION_BANK || [];
  let pool = bank.filter(q => state.band === "upper" || !isUpperPracticeQuestion(q));
  if (state.diff !== "mixed") {
    const wanted = DIFF_LABEL[state.diff];
    pool = pool.filter(q => q.difficulty === wanted);
  }
  return shuffle(pool).slice(0, Math.min(state.count, pool.length));
}

function startGame() {
  state.name = $("student-name").value.trim() || "無名偵探";
  state.worldSessionId = `reading_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  state.queue = state.mode === "diagnostic" ? drawDiagnostic() : drawPractice();
  const expected = state.mode === "diagnostic" ? 12 : 1;
  if (state.queue.length < expected) {
    alert("題庫內容不足，請確認 questions.js 與 diagnostic-questions.js 都已放在 reading 資料夾。");
    return;
  }
  state.index = 0;
  state.stage = state.mode === "diagnostic" ? "reading" : "practice";
  state.answers = [];
  show("screen-game");
  renderQuestion();
}

function renderStimulus(stimulus) {
  const box = $("stimulus");
  if (!stimulus) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  let html = `<h3>${escapeHTML(stimulus.title || "題目資料")}</h3>`;
  if (stimulus.type === "text") {
    html += `<p>${escapeHTML(stimulus.text)}</p>`;
  } else if (stimulus.type === "table") {
    html += "<div class='table-scroll'><table><thead><tr>";
    html += stimulus.columns.map(col => `<th>${escapeHTML(col)}</th>`).join("");
    html += "</tr></thead><tbody>";
    html += stimulus.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("");
    html += "</tbody></table></div>";
  } else if (stimulus.type === "rules") {
    html += `<ul>${stimulus.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  }
  if (stimulus.note) html += `<p class="stimulus-note">${escapeHTML(stimulus.note)}</p>`;
  box.innerHTML = html;
  box.classList.remove("hidden");
}

function getActivePart(question) {
  if (state.mode === "practice") {
    return {
      prompt:question.q,
      options:question.opts,
      answer:question.ans,
      hint:question.hint,
      explanation:question.exp
    };
  }
  return state.stage === "reading" ? question.stage1 : question.stage2;
}

function renderQuestion() {
  const question = state.queue[state.index];
  const part = getActivePart(question);
  state.locked = false;
  state.hintUsed = false;

  const diagnostic = state.mode === "diagnostic";
  const progressDone = diagnostic
    ? state.index * 2 + (state.stage === "calc" ? 1 : 0)
    : state.index;
  const progressTotal = diagnostic ? state.queue.length * 2 : state.queue.length;
  $("rail-fill").style.width = `${progressDone / progressTotal * 100}%`;
  $("bar-progress").textContent = diagnostic
    ? `${state.index + 1} / ${state.queue.length}`
    : `${state.index + 1} / ${state.queue.length}`;
  $("bar-title").textContent = diagnostic ? `讀題 · ${question.dimension}` : `練習 · ${question.skill}`;
  $("q-meta").textContent = diagnostic
    ? `${BAND_LABEL[state.band]} ｜ ${question.dimension} ｜ ${question.difficulty}`
    : `${question.skill} ｜ ${question.difficulty}`;
  $("stage-badge").textContent = diagnostic
    ? (state.stage === "reading" ? "第 1 關｜讀懂" : "第 2 關｜算對")
    : "自由練習";
  $("stage-badge").className = `stage-badge ${state.stage === "calc" ? "calc" : ""}`;

  renderStimulus(diagnostic ? question.stimulus : null);
  $("q-text").textContent = part.prompt;
  $("hint-box").textContent = part.hint || "再讀一次問句，找出真正要回答的量。";
  $("hint-box").classList.add("hidden");
  $("btn-hint").classList.remove("hidden");

  state.currentOptions = shuffle(part.options.map((text, index) => ({
    text, correct:index === part.answer
  })));
  const optionBox = $("options");
  optionBox.innerHTML = "";
  state.currentOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.innerHTML = `<span class="key">${"ABCD"[index]}</span><span>${escapeHTML(option.text)}</span>`;
    button.addEventListener("click", () => answer(index));
    optionBox.appendChild(button);
  });

  $("feedback").className = "feedback hidden";
  $("btn-next").classList.add("hidden");
}

function answer(optionIndex) {
  if (state.locked) return;
  state.locked = true;
  const question = state.queue[state.index];
  const part = getActivePart(question);
  const chosen = state.currentOptions[optionIndex];

  state.answers.push({
    id:question.id,
    mode:state.mode,
    band:state.band,
    stage:state.stage,
    dimension:question.dimension || question.skill,
    skill:question.skill || question.dimension,
    difficulty:question.difficulty,
    trap:question.trap || "其他",
    chosen:chosen.text,
    correct:chosen.correct,
    hintUsed:state.hintUsed
  });

  $("options").querySelectorAll(".option").forEach((button, index) => {
    button.disabled = true;
    if (state.currentOptions[index].correct) button.classList.add("correct");
    else if (index === optionIndex) button.classList.add("wrong");
  });

  $("feedback").className = `feedback${chosen.correct ? "" : " bad"}`;
  $("fb-title").textContent = chosen.correct ? "✔ 判斷正確" : "✘ 這裡有一個讀題陷阱";
  $("fb-message").textContent = chosen.correct
    ? (state.hintUsed ? "你利用線索完成了這一關。" : "你有抓到這一關的關鍵。")
    : (part.hint || "回到問句，再確認題目真正要找什麼。");
  $("fb-explain").textContent = part.explanation;
  $("btn-hint").classList.add("hidden");
  $("btn-next").classList.remove("hidden");

  const isLastQuestion = state.index === state.queue.length - 1;
  if (state.mode === "diagnostic" && state.stage === "reading") {
    $("btn-next").textContent = "進入第 2 關：算出答案";
  } else {
    $("btn-next").textContent = isLastQuestion ? "查看偵查報告" : "下一題";
  }

  const completed = state.mode === "diagnostic"
    ? state.index * 2 + (state.stage === "reading" ? 1 : 2)
    : state.index + 1;
  const total = state.mode === "diagnostic" ? state.queue.length * 2 : state.queue.length;
  $("rail-fill").style.width = `${completed / total * 100}%`;
}

function nextQuestion() {
  if (!state.locked) return;
  if (state.mode === "diagnostic" && state.stage === "reading") {
    state.stage = "calc";
    renderQuestion();
    return;
  }
  if (state.index < state.queue.length - 1) {
    state.index += 1;
    state.stage = state.mode === "diagnostic" ? "reading" : "practice";
    renderQuestion();
  } else {
    showResult();
  }
}

function rate(records) {
  const total = records.length;
  const correct = records.filter(record => record.correct).length;
  return { total, correct, pct:total ? Math.round(correct / total * 100) : 0 };
}

function groupedStats(records, key) {
  return records.reduce((groups, record) => {
    const name = record[key] || "其他";
    if (!groups[name]) groups[name] = { total:0, correct:0, assisted:0 };
    groups[name].total += 1;
    if (record.correct) groups[name].correct += 1;
    if (record.hintUsed) groups[name].assisted += 1;
    return groups;
  }, {});
}

function renderSkillRows(stats, order) {
  const box = $("r-skills");
  box.innerHTML = "";
  order.filter(name => stats[name]).forEach(name => {
    const item = stats[name];
    const pct = Math.round(item.correct / item.total * 100);
    const row = document.createElement("div");
    row.className = "skill-row";
    row.innerHTML = `
      <div class="skill-top">
        <strong>${escapeHTML(name)}</strong>
        <span>${item.correct}/${item.total}　${pct}%${item.assisted ? `　線索 ${item.assisted}` : ""}</span>
      </div>
      <div class="skill-rail"><div class="skill-fill" style="width:${pct}%"></div></div>`;
    box.appendChild(row);
  });
}

function renderTraps(records) {
  const traps = records.filter(record => !record.correct).reduce((all, record) => {
    all[record.trap] = (all[record.trap] || 0) + 1;
    return all;
  }, {});
  const sorted = Object.entries(traps).sort((a, b) => b[1] - a[1]);
  $("r-traps").innerHTML = sorted.length
    ? `<div class="trap-list">${sorted.map(([name, count]) =>
        `<span class="trap-item">${escapeHTML(name)}（${count} 次）</span>`).join("")}</div>`
    : "<p class='muted'>沒有掉進明顯陷阱，這次讀題很穩。</p>";
  return traps;
}

function diagnosticResult() {
  const readingRecords = state.answers.filter(record => record.stage === "reading");
  const calcRecords = state.answers.filter(record => record.stage === "calc");
  const reading = rate(readingRecords);
  const calc = rate(calcRecords);
  const dimensions = groupedStats(readingRecords, "dimension");

  $("diagnostic-scores").classList.remove("hidden");
  $("practice-score").classList.add("hidden");
  $("skills-title").textContent = "六項讀題能力";
  $("r-reading").textContent = `${reading.pct}%`;
  $("r-reading-count").textContent = `答對 ${reading.correct} / ${reading.total}`;
  $("r-calc").textContent = `${calc.pct}%`;
  $("r-calc-count").textContent = `答對 ${calc.correct} / ${calc.total}`;
  renderSkillRows(dimensions, DIMENSIONS);
  renderTraps(state.answers);

  const weakest = DIMENSIONS
    .filter(name => dimensions[name])
    .sort((a, b) => dimensions[a].correct / dimensions[a].total - dimensions[b].correct / dimensions[b].total)
    .filter(name => dimensions[name].correct < dimensions[name].total)
    .slice(0, 2);
  if (!weakest.length) {
    $("r-next").textContent = "六項能力在本次題組都答對了。下一輪可換另一個年級帶，或進入自由練習增加熟練度。";
  } else {
    $("r-next").textContent = weakest.map(name => `${name}：${DIMENSION_TIPS[name]}`).join("　");
  }
  $("r-note").textContent = "提醒：每項能力本次有 2 次觀察，適合找練習方向，不等同正式心理或學力測驗。線索使用次數也會保留在匯出紀錄中。";

  return { reading, calc, dimensions };
}

function practiceResult() {
  const result = rate(state.answers);
  const skills = groupedStats(state.answers, "skill");
  $("diagnostic-scores").classList.add("hidden");
  $("practice-score").classList.remove("hidden");
  $("skills-title").textContent = "本次練習類型";
  $("r-score").textContent = `${result.pct}%`;
  $("r-count").textContent = `答對 ${result.correct} / ${result.total} 題`;
  renderSkillRows(skills, Object.keys(skills));
  renderTraps(state.answers);

  const weak = Object.keys(skills)
    .sort((a, b) => skills[a].correct / skills[a].total - skills[b].correct / skills[b].total)
    .filter(name => skills[name].correct < skills[name].total)
    .slice(0, 2);
  $("r-next").textContent = weak.length
    ? `可以先回看「${weak.join("、")}」的錯題：圈出問句、劃掉無關資料，再用一句話說出數量關係。`
    : "本次練習全部答對。可以增加題數、提高難度，或改做完整診斷。";
  $("r-note").textContent = "自由練習為隨機抽題；若某類只有 1 題，這次結果只代表該題表現，不直接判定能力強弱。";

  return { practice:result, skills };
}

function showResult() {
  $("r-name").textContent = `${state.name}的偵查報告`;
  $("r-context").textContent = `${state.mode === "diagnostic" ? "完整診斷" : "自由練習"} ｜ ${BAND_LABEL[state.band]} ｜ ${new Date().toLocaleDateString("zh-TW")}`;
  const stats = state.mode === "diagnostic" ? diagnosticResult() : practiceResult();
  state.lastStats = stats;
  const summary = rate(state.answers);
  if (window.DetectiveSystem) {
    window.DetectiveSystem.completeModule("reading", {
      accuracy:summary.pct, correct:summary.correct, total:summary.total,
      mistakes:state.answers.filter(record => !record.correct).map(record => record.trap || record.skill || "問句定位"),
      reasoning:state.mode === "diagnostic", sessionId:state.worldSessionId
    });
  }
  show("screen-result");
}

function exportResult() {
  const data = {
    subject:"reading-comprehension",
    version:"2.0",
    studentName:state.name,
    mode:state.mode,
    band:state.band,
    difficulty:state.mode === "practice" ? state.diff : undefined,
    questionCount:state.queue.length,
    summary:state.lastStats,
    answers:state.answers,
    completedAt:new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `讀題偵探社_${state.name}_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

$("btn-hint").addEventListener("click", () => {
  state.hintUsed = true;
  $("hint-box").classList.remove("hidden");
  $("btn-hint").classList.add("hidden");
});
$("btn-start").addEventListener("click", startGame);
$("btn-next").addEventListener("click", nextQuestion);
$("btn-export").addEventListener("click", exportResult);
$("btn-again").addEventListener("click", startGame);
$("btn-quit").addEventListener("click", () => {
  if (confirm("作答尚未匯出，確定離開？")) location.href = "../index.html";
});

updateModeUI();
