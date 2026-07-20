/* 同樂會零食大盜：遊戲引擎（純前端，不聯網、不依賴後端） */
const STORY = window.PARTY_STORY;
const $ = id => document.getElementById(id);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s == null ? "" : s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const normalize = s => String(s || "").replace(/[\s\u3000]/g, "");

const state = { mode: null, route: null, ci: 0, hp: 5, firstTryCount: 0, chapterHadWrong: false, bossCorrect: 0, quiz: null };

function showScreen(id) {
  document.querySelectorAll(".p-screen").forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0);
}

/* ---------- 題庫讀取（相容處理：欄位名不同也能用） ---------- */
function bankOf(name) {
  const map = { chinese: window.QUESTION_BANK, math: window.MATH_QUESTION_BANK, reading: window.READING_QUESTION_BANK };
  return Array.isArray(map[name]) ? map[name] : [];
}
// 把不同題庫的欄位統一：支援 question/q、options/opts、answerIndex/ans、skillType/skill/type、explanation/exp、wrongHint/hint
function normQ(r) {
  return {
    id: r.id,
    question: r.question != null ? r.question : r.q,
    options: r.options || r.opts,
    answerIndex: r.answerIndex != null ? r.answerIndex : r.ans,
    skillType: r.skillType || r.skill || r.type,
    difficulty: r.difficulty,
    explanation: r.explanation || r.exp,
    correctFeedback: r.correctFeedback,
    wrongHint: r.wrongHint || r.hint
  };
}
function valid(q) { return q && Array.isArray(q.options) && q.options.length >= 2 && typeof q.answerIndex === "number" && q.options[q.answerIndex] !== undefined; }
function pickQuestions(name, preferred, count) {
  const bank = bankOf(name).map(normQ).filter(valid);
  if (!bank.length) return [];
  const skillOK = q => preferred && preferred.length && preferred.includes(q.skillType);
  const hard = q => q.difficulty && q.difficulty !== "基礎"; // 中偏難優先，不硬塞基礎題
  // 四層優先序：技能符合且偏難 → 技能符合 → 偏難 → 其他（各層洗牌）
  const tiers = [
    shuffle(bank.filter(q => skillOK(q) && hard(q))),
    shuffle(bank.filter(q => skillOK(q) && !hard(q))),
    shuffle(bank.filter(q => !skillOK(q) && hard(q))),
    shuffle(bank.filter(q => !skillOK(q) && !hard(q)))
  ];
  const out = [], seen = new Set();
  for (const q of [].concat(...tiers)) { if (out.length >= count) break; if (!seen.has(q.id)) { seen.add(q.id); out.push(q); } }
  return out;
}
function pickMixed(count) {
  let out = []; const per = Math.ceil(count / 3);
  ["reading", "math", "chinese"].forEach(n => { out = out.concat(pickQuestions(n, [], per)); });
  return shuffle(out).slice(0, count);
}
function bankError() { $("p-error-msg").textContent = "找不到題庫，請確認 questions.js 是否載入。"; showScreen("p-error"); }

/* ---------- 通用問答（章節題／補救題／Boss 共用） ---------- */
let timerId = null;
function startTimer(sec) {
  const el = $("p-timer"); el.classList.remove("hidden"); let t = sec;
  const fmt = s => `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  el.textContent = fmt(t); stopTimer();
  timerId = setInterval(() => { t--; el.textContent = fmt(t); if (t <= 0) { stopTimer(); const Q = state.quiz; if (Q && !Q.done && Q.opts.onDone) { Q.done = true; Q.opts.onDone(Q.correct, Q.qs.length); } } }, 1000);
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
function hideTimer() { $("p-timer").classList.add("hidden"); stopTimer(); }

function runQuiz(questions, opts) {
  state.quiz = { qs: questions, i: 0, correct: 0, locked: false, done: false, opts: opts || {} };
  if (opts && opts.timer) startTimer(opts.timer); else hideTimer();
  renderQ();
  showScreen("p-game");
}
function updateProgress() {
  const Q = state.quiz; if (!Q) return;
  const ev = $("p-evidence").children.length;
  $("p-progress").textContent = `第 ${Q.i + 1} / ${Q.qs.length} 題　·　已取得證據卡 ${ev} 張`;
}
function renderQ() {
  const Q = state.quiz, q = Q.qs[Q.i];
  updateProgress();
  $("p-question").textContent = q.question;
  Q.shuffled = shuffle(q.options.map((t, idx) => ({ t, correct: idx === q.answerIndex })));
  const box = $("p-options"); box.innerHTML = "";
  Q.shuffled.forEach((o, idx) => { const b = document.createElement("button"); b.className = "p-opt"; b.textContent = o.t; b.onclick = () => pick(idx); box.appendChild(b); });
  $("p-feedback").textContent = ""; $("p-feedback").className = "p-feedback";
  $("p-next").classList.add("hidden");
}
function pick(idx) {
  const Q = state.quiz; if (Q.locked) return; Q.locked = true;
  const q = Q.qs[Q.i], chosen = Q.shuffled[idx], btns = [...$("p-options").children];
  btns.forEach((b, i) => { b.disabled = true; if (Q.shuffled[i].correct) b.classList.add("ok"); });
  if (chosen.correct) {
    Q.correct++;
    $("p-feedback").textContent = q.correctFeedback || "答對了！這條線索到手。";
    $("p-feedback").className = "p-feedback good";
    if (Q.opts.evidenceList && Q.opts.evidenceList[Q.i]) addEvidence(Q.opts.evidenceList[Q.i]);
  } else {
    btns[idx].classList.add("no");
    $("p-feedback").textContent = q.explanation || q.wrongHint || "再想想看，回到題目重讀一次。";
    $("p-feedback").className = "p-feedback bad";
  }
  $("p-next").classList.remove("hidden");
}
function nextQ() {
  const Q = state.quiz; if (Q.done) return; Q.locked = false; Q.i++;
  if (Q.i < Q.qs.length) renderQ();
  else { Q.done = true; stopTimer(); (Q.opts.onDone || (() => {}))(Q.correct, Q.qs.length); }
}
function addEvidence(text) {
  const box = $("p-evidence");
  const d = document.createElement("div"); d.className = "ev-card";
  d.innerHTML = `<span class="ev-dot">✔</span><span>${esc(text)}</span>`;
  box.appendChild(d);
  updateProgress();
}

/* ---------- 章節流程 ---------- */
function setHeader() {
  $("p-hp").textContent = "❤".repeat(Math.max(0, state.hp)) + "♡".repeat(Math.max(0, STORY.hp - state.hp));
  $("p-mode-label").textContent = state.mode === "coop"
    ? (STORY.routeMeta[state.route].icon + STORY.routeMeta[state.route].name) : "🎬 單機故事";
}
function startChapter() {
  const ch = STORY.chapters[state.ci];
  state.chapterHadWrong = false;
  $("p-chapter-title").textContent = ch.title;
  $("p-chapter-intro").textContent = ch.intro;
  $("p-evidence").innerHTML = "";
  setHeader();
  if (state.mode === "coop") {
    const rm = STORY.routeMeta[state.route];
    const qs = pickQuestions(rm.bank, rm.preferredSkills, 6);
    if (!qs.length) return bankError();
    runQuiz(qs, { evidenceList: ch.routes[state.route].evidence, onDone: showFragment });
  } else {
    const qs = pickMixed(8);
    if (!qs.length) return bankError();
    runQuiz(qs, { onDone: soloAfterChapter });
  }
}
function showFragment() {
  const ch = STORY.chapters[state.ci], rm = STORY.routeMeta[state.route];
  $("p-frag-route").textContent = rm.icon + " " + rm.name;
  $("p-frag-secret").textContent = ch.routes[state.route].secret;
  showScreen("p-fragment");
}
function showPasscode() {
  $("p-pass-chapter").textContent = STORY.chapters[state.ci].title;
  $("p-pass-input").value = ""; $("p-pass-hint").textContent = "";
  showScreen("p-passcode");
}
function submitPasscode() {
  const ch = STORY.chapters[state.ci];
  if (normalize($("p-pass-input").value) === normalize(ch.passcode)) showFinal();
  else $("p-pass-hint").textContent = "通關碼不對。再問問隊友，每條路線各拿到哪一個字？";
}
function soloAfterChapter(correct) {
  if (correct >= 6) showFinal();
  else cooldown("這一章答對不到 6 題，先冷靜重查，再看完整線索。", showFinal);
}
function allEvidenceHTML(ch) {
  return STORY.routes.map(r => {
    const rm = STORY.routeMeta[r];
    return `<div class="clue-row"><b>${rm.icon}${esc(rm.name)}</b>：${esc(ch.routes[r].evidence.join("／"))}</div>`;
  }).join("");
}
function showFinal() {
  const ch = STORY.chapters[state.ci], fq = ch.finalQuestion;
  $("p-final-title").textContent = ch.title + "・章末推理";
  $("p-final-q").textContent = fq.question;
  const clue = $("p-final-clue");
  if (state.mode === "solo") { clue.innerHTML = allEvidenceHTML(ch); clue.classList.remove("hidden"); }
  else clue.classList.add("hidden");
  state.finalShuffled = shuffle(fq.options.map((t, i) => ({ t, correct: i === fq.answerIndex })));
  const box = $("p-final-options"); box.innerHTML = "";
  state.finalShuffled.forEach((o, i) => { const b = document.createElement("button"); b.className = "p-opt"; b.textContent = o.t; b.onclick = () => pickFinal(i); box.appendChild(b); });
  $("p-final-feedback").textContent = ""; $("p-final-feedback").className = "p-feedback";
  $("p-final-next").classList.add("hidden");
  state.finalLocked = false;
  showScreen("p-final");
}
function pickFinal(i) {
  if (state.finalLocked) return; state.finalLocked = true;
  const fq = STORY.chapters[state.ci].finalQuestion, chosen = state.finalShuffled[i], btns = [...$("p-final-options").children];
  btns.forEach((b, idx) => { b.disabled = true; if (state.finalShuffled[idx].correct) b.classList.add("ok"); });
  const nx = $("p-final-next");
  if (chosen.correct) {
    if (!state.chapterHadWrong) state.firstTryCount++;
    $("p-final-feedback").textContent = fq.correct; $("p-final-feedback").className = "p-feedback good";
    nx.textContent = "繼續 →"; nx.classList.remove("hidden"); nx.onclick = advanceChapter;
  } else {
    btns[i].classList.add("no");
    state.chapterHadWrong = true;
    $("p-final-feedback").textContent = fq.wrong; $("p-final-feedback").className = "p-feedback bad";
    loseHp();
    if (state.hp <= 0) { nx.textContent = "看結局"; nx.classList.remove("hidden"); nx.onclick = endGame; return; }
    nx.textContent = "冷靜重查"; nx.classList.remove("hidden");
    nx.onclick = () => cooldown("偵探不能只看最明顯的線索。請冷靜重查，再判斷一次。", showFinal);
  }
}
function advanceChapter() {
  state.ci++;
  if (state.ci < STORY.chapters.length) startChapter();
  else startBoss();
}
function loseHp() { state.hp--; setHeader(); }

/* ---------- 冷靜重查（補救題） ---------- */
function cooldown(reason, done) {
  $("p-cool-reason").textContent = reason;
  showScreen("p-cooldown");
  $("p-cool-go").onclick = () => {
    let qs;
    if (state.mode === "coop") { const rm = STORY.routeMeta[state.route]; qs = pickQuestions(rm.bank, rm.preferredSkills, 3); }
    else qs = pickMixed(3);
    if (!qs.length) { done(); return; }
    runQuiz(qs, { onDone: () => done() });
  };
}

/* ---------- Boss 戰 ---------- */
function startBoss() {
  const b = STORY.boss;
  let qs = [];
  b.picks.forEach(p => { qs = qs.concat(pickQuestions(p.bank, [], p.count)); });
  qs = shuffle(qs);
  if (!qs.length) return bankError();
  $("p-chapter-title").textContent = b.title;
  $("p-chapter-intro").textContent = b.intro;
  $("p-evidence").innerHTML = "";
  setHeader();
  runQuiz(qs, { timer: b.seconds, onDone: c => { state.bossCorrect = c; endGame(); } });
}

/* ---------- 結局 ---------- */
function endGame() {
  hideTimer();
  let key;
  if (state.hp <= 0) key = "suspense";
  else if (state.bossCorrect >= STORY.boss.passScore && state.hp >= 4 && state.firstTryCount >= 3) key = "perfect";
  else if (state.bossCorrect >= STORY.boss.passScore && state.hp >= 2) key = "normal";
  else key = "suspense";
  const e = STORY.endings[key];
  $("p-ending-name").textContent = e.name;
  $("p-ending-text").textContent = e.text;
  $("p-ending-reveal").textContent = STORY.boss.reveal;
  $("p-ending-score").textContent = `章末推理一次答對 ${state.firstTryCount}/3　Boss ${state.bossCorrect}/6　剩餘 ${Math.max(0, state.hp)} 心`;
  showScreen("p-ending");
}

/* ---------- 首頁與綁定 ---------- */
function chooseMode(m) {
  state.mode = m;
  $("p-mode-solo").classList.toggle("sel", m === "solo");
  $("p-mode-coop").classList.toggle("sel", m === "coop");
  $("p-routes").classList.toggle("hidden", m !== "coop");
  refreshStart();
}
function chooseRoute(r) {
  state.route = r;
  document.querySelectorAll("[data-route]").forEach(b => b.classList.toggle("sel", b.dataset.route === r));
  refreshStart();
}
function refreshStart() {
  const ok = state.mode === "solo" || (state.mode === "coop" && state.route);
  $("p-start").disabled = !ok;
}
function startGame() {
  state.ci = 0; state.hp = STORY.hp; state.firstTryCount = 0; state.chapterHadWrong = false; state.bossCorrect = 0;
  startChapter();
}
function backHome() { hideTimer(); showScreen("p-home"); }

function bind() {
  $("p-intro-text").textContent = STORY.intro;
  $("p-mode-solo").onclick = () => chooseMode("solo");
  $("p-mode-coop").onclick = () => chooseMode("coop");
  document.querySelectorAll("[data-route]").forEach(b => b.onclick = () => chooseRoute(b.dataset.route));
  $("p-start").onclick = startGame;
  $("p-next").onclick = nextQ;
  $("p-frag-go").onclick = showPasscode;
  $("p-pass-submit").onclick = submitPasscode;
  $("p-pass-input").addEventListener("keydown", e => { if (e.key === "Enter") submitPasscode(); });
  $("p-again").onclick = () => showScreen("p-home");
  $("p-error-home").onclick = () => showScreen("p-home");
  document.querySelectorAll(".p-quit").forEach(b => b.onclick = backHome);
  refreshStart();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();
