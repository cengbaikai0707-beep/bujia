/* 部件大亂鬥・引擎 v2
   題型：辨認/部件意義/修復(組字+字義)/字族連鎖/情境鑑識/冒牌字；
   三能力值：字形完整度 shape、字義穩定度 meaning、語境清晰度 context；
   Boss：形近怪(配對本形)、月肉/左右阝(分類)、聲旁變色龍(依義配字)；
   關卡循序解鎖 + localStorage + 教師自由模式。所有互動皆點選式、可離線。 */
(function () {
  const BANK = window.COMPONENT_BANK || [];
  const FAM = window.FAMILY_DATA || [];
  const CTX = window.CONTEXT_DATA || [];
  const IMP = window.IMPOSTER_DATA || [];

  const AREA = { 1: "自然之力", 2: "身體與心", 3: "手與動作", 4: "生活器物", 5: "蟲獸與神怪", 6: "聲旁字族", 7: "高年級字族" };
  const NODES = [
    { id: "a1", type: "level", lv: 1 }, { id: "a2", type: "level", lv: 2 },
    { id: "b1", type: "boss", boss: "形近" },
    { id: "a3", type: "level", lv: 3 }, { id: "a4", type: "level", lv: 4 },
    { id: "b2", type: "boss", boss: "月肉" },
    { id: "a5", type: "level", lv: 5 }, { id: "a6", type: "level", lv: 6 },
    { id: "b3", type: "boss", boss: "左右阝" },
    { id: "a7", type: "level", lv: 7 },
    { id: "b4", type: "boss", boss: "聲旁" }
  ];
  const BOSS_INFO = {
    "形近": { title: "形近怪", desc: "把變形部件送回它的本形", color: "#b5643c" },
    "月肉": { title: "月肉雙面怪", desc: "分辨「月亮／時間」與「身體／肉」", color: "#3c7bb5" },
    "左右阝": { title: "左右阝迷宮", desc: "左阝＝地形、右阝＝城邑", color: "#6a9a4c" },
    "聲旁": { title: "聲旁變色龍", desc: "同一個「青」，依字義配出正確的字", color: "#8a6cc4" }
  };

  const $ = id => document.getElementById(id);
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const sample = (a, n) => shuffle(a).slice(0, n);
  const uniq = a => [...new Set(a)];
  const byComp = c => BANK.find(x => x.comp === c);
  const charComps = {}; BANK.forEach(c => c.examples.forEach(ch => (charComps[ch] = charComps[ch] || []).push(c.comp)));

  // ---------- 存檔 ----------
  const KEY = "bujia_battle_v2";
  let save = { cleared: {}, teacher: false, stars: {} };
  try { const s = localStorage.getItem(KEY); if (s) save = Object.assign(save, JSON.parse(s)); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
  const nodeIndex = id => NODES.findIndex(n => n.id === id);
  const unlocked = id => { if (save.teacher) return true; const i = nodeIndex(id); return i === 0 || save.cleared[NODES[i - 1].id]; };

  const showScreen = id => { document.querySelectorAll(".b-screen").forEach(s => s.classList.toggle("active", s.id === id)); window.scrollTo(0, 0); };

  // ================= 首頁：關卡地圖 =================
  function renderHome() {
    $("b-intro").textContent = "文字大陸被部件小偷入侵，形旁被偷走亂貼。扮演文字勇者，辨認部件、修復文字、組成字族、放回句子驗證，一步步奪回文字！";
    $("b-teacher").checked = !!save.teacher;
    const grid = $("b-nodes"); grid.textContent = "";
    NODES.forEach(n => {
      const open = unlocked(n.id), done = save.cleared[n.id];
      const card = el("button", "b-node" + (n.type === "boss" ? " boss" : "") + (open ? "" : " locked") + (done ? " done" : ""));
      if (n.type === "level") {
        const cnt = BANK.filter(c => c.level === n.lv).length;
        card.appendChild(el("span", "b-node-tag", "區域"));
        card.appendChild(el("strong", null, AREA[n.lv]));
        card.appendChild(el("small", null, open ? `${cnt} 個部件` : "未解鎖"));
      } else {
        const bi = BOSS_INFO[n.boss];
        card.appendChild(el("span", "b-node-tag", "BOSS"));
        card.appendChild(el("strong", null, bi.title));
        card.appendChild(el("small", null, open ? bi.desc : "未解鎖"));
      }
      if (done) card.appendChild(el("span", "b-node-done", "✔"));
      card.disabled = !open;
      card.onclick = () => open && (n.type === "level" ? startLevel(n) : startBoss(n));
      grid.appendChild(card);
    });
  }

  // ================= 一般關卡 =================
  const state = {};
  function newTaskOf(type, lv) {
    const comps = BANK.filter(c => c.level === lv);
    if (type === "recognize" || type === "meaning") return { type, comp: pick(comps) };
    if (type === "repair" || type === "chain") return { type, fam: pick(FAM) };
    if (type === "context") return { type, item: pick(CTX) };
    return { type: "imposter", item: pick(IMP) };
  }
  function buildTasks(lv) {
    const order = ["recognize", "repair", "meaning", "context", "chain", "imposter", "recognize"];
    const tasks = order.map(t => newTaskOf(t, lv));
    shuffle(tasks.map((_, i) => i)).slice(0, Math.ceil(tasks.length / 3)).forEach(i => tasks[i].evidence = true);
    return tasks;
  }
  function startLevel(node) {
    state.node = node; state.lv = node.lv; state.ti = 0;
    state.tasks = buildTasks(node.lv);
    state.stat = { shape: [0, 0], meaning: [0, 0], context: [0, 0] };
    state.correct = 0; state.combo = 0; state.newComps = new Set();
    dealSkills();
    $("b-play-title").textContent = `${AREA[node.lv]}`;
    $("b-play-sub").textContent = `本區 ${BANK.filter(c => c.level === node.lv).length} 個部件 ｜ 本次任務 ${state.tasks.length} 題`;
    renderTask();
    showScreen("b-play");
  }
  function progressText() { $("b-task-progress").textContent = `任務 ${state.ti + 1} / ${state.tasks.length} ｜ 答對 ${state.correct}${state.combo > 1 ? " ｜ 連擊 ×" + state.combo : ""}`; }
  function addStat(k, ok) { state.stat[k][1]++; if (ok) state.stat[k][0]++; }

  function renderTask() {
    const box = $("b-task"); box.textContent = ""; progressText();
    const t = state.tasks[state.ti];
    cur.hint = hintFor(t); cur.example = exampleFor(t);
    renderSkills();
    ({ recognize: tRecognize, meaning: tMeaning, repair: tRepair, chain: tChain, context: tContext, imposter: tImposter }[t.type])(t, box);
  }
  let lastAns = -1;
  function optButtons(box, opts, ansIndex, onPick, big) {
    lastAns = ansIndex;
    const wrap = el("div", "b-options" + (big ? " big" : ""));
    opts.forEach((o, i) => {
      const b = el("button", "b-opt", o);
      b.onclick = () => {
        if (wrap.dataset.done) return; wrap.dataset.done = "1";
        [...wrap.children].forEach((c, j) => { c.disabled = true; if (j === ansIndex) c.classList.add("ok"); });
        if (i !== ansIndex) b.classList.add("no");
        onPick(i === ansIndex, i);
      };
      wrap.appendChild(b);
    });
    box.appendChild(wrap);
    return wrap;
  }
  function feedback(box, ok, msg) {
    box.appendChild(el("div", "b-fb " + (ok ? "good" : "bad"), (ok ? "✨ " : "✗ ") + msg));
    $("b-scene").className = "b-scene " + (ok ? "win" : "hit");
  }
  function afterAnswer(box, ok, statKey, evidence) {
    if (ok) { state.correct++; state.combo++; }
    else if (state.shield) { state.shield = false; renderSkills(); }
    else state.combo = 0;
    if (Array.isArray(statKey)) statKey.forEach(k => addStat(k, ok)); else addStat(statKey, ok);
    const next = el("button", "b-btn b-primary b-block", "下一步 →");
    next.onclick = () => { if (evidence && ok) askEvidence(); else advance(); };
    box.appendChild(next);
  }
  function askEvidence() {
    const box = $("b-task"); box.textContent = "";
    box.appendChild(el("h2", "b-q", "你剛才主要根據哪一種線索判斷？"));
    const wrap = optButtons(box, ["部件的外形", "部件的字義", "讀音線索", "句子語境"], -1, () => {}, false);
    [...wrap.children].forEach(b => b.onclick = () => {
      if (wrap.dataset.done) return; wrap.dataset.done = "1";
      wrap.querySelectorAll(".b-opt").forEach(x => x.disabled = true); b.classList.add("ok");
      state.combo++;
      box.appendChild(el("div", "b-fb good", "能說出判斷依據，就是真正的偵探！連擊 ×" + state.combo));
      const n = el("button", "b-btn b-primary b-block", "下一步 →"); n.onclick = advance; box.appendChild(n);
    });
  }
  function advance() { state.ti++; if (state.ti < state.tasks.length) renderTask(); else levelResult(); }

  // ---------- 部件技能卡 ----------
  const SKILLS = {
    wash: { comp: "氵", name: "沖洗線索", desc: "刪掉一個錯的選項" },
    observe: { comp: "目", name: "仔細觀察", desc: "看一次提示" },
    witness: { comp: "言", name: "詢問證人", desc: "看例字或提示句" },
    reroll: { comp: "辶", name: "換一條路", desc: "換一題同類型的" },
    calm: { comp: "忄", name: "保持冷靜", desc: "下一次答錯保留連擊" }
  };
  const cur = { hint: "", example: "" };
  function dealSkills() { state.skills = sample(Object.keys(SKILLS), 2); state.shield = false; }
  function renderSkills() {
    const bar = $("b-skills"); if (!bar) return; bar.textContent = "";
    bar.appendChild(el("span", "b-skill-lead", (state.shield ? "🛡 護盾中 · " : "") + "技能卡"));
    if (!state.skills || !state.skills.length) { bar.appendChild(el("span", "b-skill-empty", "已用完")); return; }
    state.skills.forEach(id => {
      const s = SKILLS[id];
      const b = el("button", "b-skill"); b.type = "button"; b.title = s.desc;
      b.appendChild(el("span", "b-skill-comp", s.comp));
      b.appendChild(el("span", "b-skill-name", s.name));
      b.onclick = () => applySkill(id);
      bar.appendChild(b);
    });
  }
  function useSkill(id) { state.skills = state.skills.filter(x => x !== id); renderSkills(); }
  function skillNote(msg, good) { $("b-task").appendChild(el("div", "b-fb " + (good === false ? "bad" : "good"), "🃏 " + msg)); }
  function applySkill(id) {
    const liveWrap = [...$("b-task").querySelectorAll(".b-options")].find(w => !w.dataset.done);
    if (id === "wash") {
      if (!liveWrap) return skillNote("這一題沒有可以刪的選項，卡片先留著。", false);
      const wrongs = [...liveWrap.children].filter((c, i) => i !== lastAns && !c.disabled);
      if (!wrongs.length) return skillNote("已經沒有可刪的錯選項了。", false);
      const v = pick(wrongs); v.disabled = true; v.classList.add("washed");
      useSkill("wash"); skillNote("沖掉了一個錯選項！");
    } else if (id === "observe") {
      if (!cur.hint) return skillNote("這一題暫時沒有更多提示。", false);
      useSkill("observe"); skillNote("提示：" + cur.hint);
    } else if (id === "witness") {
      if (!cur.example) return skillNote("這一題沒有可問的例句。", false);
      useSkill("witness"); skillNote("證人說：" + cur.example);
    } else if (id === "reroll") {
      const t = state.tasks[state.ti];
      state.tasks[state.ti] = Object.assign(newTaskOf(t.type, state.lv), { evidence: t.evidence });
      useSkill("reroll"); renderTask();
    } else if (id === "calm") {
      state.shield = true; useSkill("calm"); skillNote("保持冷靜：下一次答錯會保留連擊。");
    }
  }
  function hintFor(t) {
    if (t.type === "recognize" || t.type === "meaning") return t.comp.note || `「${t.comp.comp}」和「${t.comp.meaning}」有關`;
    if (t.type === "repair") return `聲旁「${t.fam.sheng}」只提示讀音，先想要表達的意思，再選形旁`;
    if (t.type === "chain") return `每個字的聲旁都是「${t.fam.sheng}」，看提示的『部件』來配`;
    if (t.type === "context") return t.item.clue;
    return "句子裡有一個字，部件雖然像、意思卻和句子不合";
  }
  function exampleFor(t) {
    if (t.type === "recognize" || t.type === "meaning") return `「${t.comp.comp}」的字：${t.comp.examples.slice(0, 6).join("、")}`;
    if (t.type === "repair" || t.type === "chain") return `「${t.fam.sheng}」族：${t.fam.members.map(m => m.char).join("、")}`;
    if (t.type === "context") return "把每個選項輪流讀進句子，看哪個意思最通順";
    return "逐字檢查：哪個字的部件和句子要說的意思不合？";
  }

  // 辨認 → 字形
  function tRecognize(t, box) {
    const c = t.comp, correct = pick(c.examples.slice(0, 8));
    const pool = uniq(BANK.filter(x => x !== c && x.level < 8).flatMap(x => x.examples)).filter(ch => ch !== correct && !(charComps[ch] || []).includes(c.comp));
    const opts = shuffle([correct, ...sample(pool, 3)]);
    box.appendChild(el("h2", "b-q", `下列哪個字用到部件「${c.comp}」（${c.meaning}）？`));
    state.newComps.add(c.comp);
    optButtons(box, opts, opts.indexOf(correct), ok => {
      bumpStar(c.comp, ok);
      feedback(box, ok, ok ? `「${correct}」有「${c.comp}」，${c.meaning}。` : `正解是「${correct}」。${c.note || c.comp + "：" + c.meaning}`);
      afterAnswer(box, ok, "shape", t.evidence);
    }, true);
  }
  // 部件意義 → 字義
  function tMeaning(t, box) {
    const c = t.comp, others = uniq(BANK.filter(x => x !== c).map(x => x.meaning)).filter(m => m !== c.meaning);
    const opts = shuffle([c.meaning, ...sample(others, 3)]);
    box.appendChild(el("h2", "b-q", `部件「${c.comp}」在字裡多和什麼有關？`));
    if (c.note) box.appendChild(el("p", "b-hint-line", c.note));
    state.newComps.add(c.comp);
    optButtons(box, opts, opts.indexOf(c.meaning), ok => {
      bumpStar(c.comp, ok);
      feedback(box, ok, `「${c.comp}」：${c.meaning}。例：${c.examples.slice(0, 4).join("、")}。`);
      afterAnswer(box, ok, "meaning", t.evidence);
    });
  }
  // 修復（選形旁組字 → 確認字義）→ 字形+字義
  function tRepair(t, box) {
    const f = t.fam, m = pick(f.members);
    box.appendChild(el("h2", "b-q", `文字被小偷拆散了！「${f.sheng}」要修復成一個表示「${m.mean}」的字，該裝回哪個部件？`));
    const others = uniq(FAM.flatMap(x => x.members).map(x => x.part)).filter(p => p !== m.part);
    const opts = shuffle([m.part, ...sample(others, 3)]);
    optButtons(box, opts, opts.indexOf(m.part), ok => {
      if (!ok) { feedback(box, false, `要表示「${m.mean}」，應該用「${m.part}」，組成「${m.char}」。`); afterAnswer(box, false, ["shape", "meaning"], t.evidence); return; }
      feedback(box, true, `${m.part}＋${f.sheng}＝${m.char}！`);
      const stage2 = el("div", "b-stage2");
      stage2.appendChild(el("p", "b-q2", `修好了「${m.char}」。它的意思最接近哪一個？`));
      box.appendChild(stage2);
      const sibs = f.members.filter(x => x !== m);
      const mopts = shuffle([m.mean, ...sample(sibs.map(x => x.mean), Math.min(3, sibs.length))]);
      optButtons(stage2, mopts, mopts.indexOf(m.mean), ok2 => {
        feedback(stage2, ok2, ok2 ? `沒錯，「${m.char}」＝${m.mean}。「${f.sheng}」只提示讀音，字義要看「${m.part}」。` : `「${m.char}」的意思是「${m.mean}」。`);
        afterAnswer(stage2, ok2, ["shape", "meaning"], t.evidence);
      });
    });
  }
  // 字族連鎖 → 字形（連擊）
  function tChain(t, box) {
    const f = t.fam, members = shuffle(f.members).slice(0, Math.min(4, f.members.length));
    box.appendChild(el("h2", "b-q", `字族連鎖！同一個聲旁「${f.sheng}」配上不同部件，依提示點出正確的字：`));
    const stepBox = el("div", "b-chain"); box.appendChild(stepBox);
    let idx = 0, correctSteps = 0;
    const others = uniq(FAM.flatMap(x => x.members).map(x => x.char));
    function step() {
      stepBox.textContent = "";
      if (idx >= members.length) {
        const passed = correctSteps >= Math.ceil(members.length * 0.75);
        feedback(box, passed, `${passed ? "字族連鎖完成" : "字族還需要再修復"}！答對 ${correctSteps}/${members.length}。「${f.sheng}」族：${members.map(x => x.char).join("、")}。`);
        afterAnswer(box, passed, "shape", t.evidence); return;
      }
      const m = members[idx];
      stepBox.appendChild(el("p", "b-q2", `第 ${idx + 1}/${members.length} 個：表示「${m.mean}」（部件「${m.part}」）`));
      const distract = sample(others.filter(ch => ch !== m.char && !members.some(mm => mm.char === ch)), 3);
      const opts = shuffle([m.char, ...distract]);
      optButtons(stepBox, opts, opts.indexOf(m.char), ok => {
        if (ok) { correctSteps++; state.combo++; progressText(); idx++; setTimeout(step, 450); }
        else { stepBox.appendChild(el("div", "b-fb bad", `這個是「${m.char}」才對（${m.mean}）。`)); setTimeout(() => { idx++; step(); }, 850); }
      }, true);
    }
    step();
  }
  // 情境鑑識 → 語境
  function tContext(t, box) {
    const it = t.item;
    box.appendChild(el("h2", "b-q", "情境鑑識：把正確的字放回句子。"));
    box.appendChild(el("p", "b-sentence", it.sentence));
    optButtons(box, it.options.slice(), it.ans, ok => {
      feedback(box, ok, ok ? it.clue + " 但仍要回到句子確認，才不會被形近字騙。" : `正解：「${it.options[it.ans]}」。${it.clue}`);
      afterAnswer(box, ok, "context", t.evidence);
    }, true);
  }
  // 冒牌字 → 語境+字義
  // 冒牌字：先點出用錯的字（位置）→ 再改對 → 語境+字義
  const PUNCT = "，。、？！；：「」";
  function tImposter(t, box) {
    const it = t.item, wrongIdx = it.sentence.indexOf(it.wrong);
    box.appendChild(el("h2", "b-q", "冒牌字鑑識：這句話裡有一個字用錯了，點出用錯的那個字。"));
    const line = el("p", "b-charpick");
    [...it.sentence].forEach((ch, i) => {
      if (PUNCT.includes(ch)) { line.appendChild(el("span", "b-punct", ch)); return; }
      const s = el("button", "b-char", ch); s.type = "button";
      s.onclick = () => {
        if (line.dataset.done) return;
        if (i === wrongIdx) {
          line.dataset.done = "1";
          line.querySelectorAll(".b-char").forEach(x => x.disabled = true);
          s.classList.add("found");
          feedback(box, true, `找到了！「${it.wrong}」在這裡用錯了。`);
          imposterFix(t, box);
        } else {
          s.classList.add("miss"); s.disabled = true;
          let fb = box.querySelector(".b-charpick-fb");
          if (!fb) { fb = el("div", "b-fb bad b-charpick-fb"); box.appendChild(fb); }
          fb.textContent = "✗ 這個字沒問題，再找找看。";
        }
      };
      line.appendChild(s);
    });
    box.appendChild(line);
  }
  function imposterFix(t, box) {
    const it = t.item, st2 = el("div", "b-stage2");
    st2.appendChild(el("p", "b-q2", `應該把「${it.wrong}」改成哪個字？`));
    box.appendChild(st2);
    const distract = uniq(BANK.flatMap(c => c.examples)).filter(ch => ch !== it.right && ch !== it.wrong);
    const opts = shuffle([it.right, ...sample(distract, 3)]);
    optButtons(st2, opts, opts.indexOf(it.right), ok => {
      feedback(st2, ok, ok ? `對！改成「${it.right}」就通順了。${it.why}` : `正解是「${it.right}」。${it.why}`);
      afterAnswer(st2, ok, ["context", "meaning"], t.evidence);
    }, true);
  }

  function bumpStar(comp, ok) { if (!ok) return; const s = save.stars[comp] || 0; if (s < 3) { save.stars[comp] = s + 1; persist(); } }

  // 關卡結算：三能力值
  function levelResult() {
    const total = state.tasks.length, pct = Math.round(state.correct / total * 100);
    const passed = pct >= 60;
    if (passed) { save.cleared[state.node.id] = true; persist(); }
    const stat = state.stat;
    const rate = k => stat[k][1] ? Math.round(stat[k][0] / stat[k][1] * 100) : null;
    const labels = { shape: "字形完整度", meaning: "字義穩定度", context: "語境清晰度" };
    const vals = Object.keys(labels).map(k => ({ k, v: rate(k) })).filter(x => x.v != null);
    const best = vals.slice().sort((a, b) => b.v - a.v)[0], weak = vals.slice().sort((a, b) => a.v - b.v)[0];
    $("b-result-title").textContent = pct >= 80 ? "🏆 這一區的文字修復完成！" : passed ? "🛡️ 通過任務，再加強一下！" : "👾 尚未通過，再挑戰一次！";
    $("b-result-detail").textContent = `${AREA[state.lv]} ｜ 正確率 ${pct}%（${state.correct}/${total}）`;
    const bars = $("b-result-bars"); bars.textContent = "";
    vals.forEach(({ k, v }) => {
      const row = el("div", "b-stat-row");
      row.appendChild(el("span", "b-stat-name", labels[k]));
      const track = el("div", "b-stat-track"); const fill = el("div", "b-stat-fill"); fill.style.width = v + "%"; track.appendChild(fill); row.appendChild(track);
      row.appendChild(el("span", "b-stat-val", v + "%"));
      bars.appendChild(row);
    });
    const note = $("b-result-note"); note.textContent = "";
    if (best) note.appendChild(el("p", "b-good-line", `最穩定：${labels[best.k]}`));
    if (weak && weak.v < 100) note.appendChild(el("p", "b-weak-line", `最需補強：${labels[weak.k]}`));
    const newC = [...state.newComps]; if (newC.length) note.appendChild(el("p", null, "本次練到的部件：" + newC.join("、")));
    const nxt = NODES[nodeIndex(state.node.id) + 1];
    if (!passed) {
      $("b-next-node").style.display = "";
      $("b-next-node").textContent = "重新挑戰 →";
      $("b-next-node").onclick = () => startLevel(state.node);
    } else {
      $("b-next-node").style.display = nxt && unlocked(nxt.id) ? "" : "none";
      $("b-next-node").textContent = "下一關 →";
      if (nxt) $("b-next-node").onclick = () => nxt.type === "level" ? startLevel(nxt) : startBoss(nxt);
    }
    showScreen("b-result");
    renderHome();
  }

  // ================= Boss =================
  function bossQueue(kind) {
    if (kind === "形近") {
      const pairs = [["氵", "水"], ["扌", "手"], ["忄", "心"], ["灬", "火"], ["刂", "刀"], ["礻", "示"]];
      const bases = pairs.map(p => p[1]);
      return pairs.map(([v, b]) => ({ big: true, prompt: `變形部件「${v}」的本形是哪一個？`, options: shuffle([b, ...sample(bases.filter(x => x !== b), 3)]), ansVal: b, exp: `「${v}」是「${b}」的變形。` }));
    }
    if (kind === "月肉" || kind === "左右阝") {
      const isMoon = kind === "月肉";
      const A = byComp(isMoon ? "月" : "阝左"), B = byComp(isMoon ? "肉" : "阝右");
      const labelA = isMoon ? "月亮／時間" : "左阝・地形", labelB = isMoon ? "身體／肉" : "右阝・城邑";
      const items = shuffle([...sample(A.examples, 4).map(ch => ({ ch, g: 0 })), ...sample(B.examples, 4).map(ch => ({ ch, g: 1 }))]);
      return items.map(it => ({ big: true, prompt: `「${it.ch}」應該送到哪一邊？`, options: [labelA, labelB], ans: it.g, exp: isMoon ? "表示身體的部件在現代字形常寫得像「月」，要看字義。" : "阝在左邊來自阜(地形)，在右邊來自邑(城邑)。" }));
    }
    const f = FAM.find(x => x.sheng === "青"), chars = f.members.map(m => m.char);
    return f.members.map(m => ({ big: true, prompt: `聲旁都是「青」，表示「${m.mean}」的是哪個字？`, options: shuffle([m.char, ...sample(chars.filter(c => c !== m.char), 3)]), ansVal: m.char, exp: `「${m.char}」＝${m.mean}（部件「${m.part}」）。` }));
  }
  function startBoss(node) {
    state.node = node; state.boss = node.boss;
    state.queue = bossQueue(node.boss); state.qi = 0; state.solved = 0; state.tries = 0;
    const bi = BOSS_INFO[node.boss];
    $("b-boss-title").textContent = bi.title; $("b-boss-desc").textContent = bi.desc;
    document.documentElement.style.setProperty("--boss", bi.color);
    renderBossStep();
    showScreen("b-boss");
  }
  function renderBossStep() {
    const total = state.queue.length;
    $("b-boss-bar-fill").style.width = Math.round(state.solved / total * 100) + "%";
    $("b-boss-bar-text").textContent = `修復進度 ${state.solved} / ${total}`;
    const box = $("b-boss-task"); box.textContent = "";
    const q = state.queue[state.qi];
    box.appendChild(el("h2", "b-q", q.prompt));
    const ansIndex = q.ans != null ? q.ans : q.options.indexOf(q.ansVal);
    optButtons(box, q.options, ansIndex, ok => {
      if (ok) {
        state.solved++;
        feedback(box, true, q.exp);
        const n = el("button", "b-btn b-primary b-block", state.qi + 1 < total ? "繼續修復 →" : "完成！");
        n.onclick = () => { state.qi++; if (state.qi < total) renderBossStep(); else bossWin(); };
        box.appendChild(n);
      } else {
        state.tries++;
        feedback(box, false, "再看一次線索：" + q.exp);
        const r = el("button", "b-btn b-ghost b-block", "重新判斷");
        r.onclick = renderBossStep;
        box.appendChild(r);
      }
    }, q.big);
  }
  function bossWin() {
    save.cleared[state.node.id] = true; persist();
    $("b-result-title").textContent = "🏆 Boss 擊退，區域打通！";
    $("b-result-detail").textContent = `${BOSS_INFO[state.boss].title} ｜ 修復 ${state.queue.length} 字，重試 ${state.tries} 次`;
    $("b-result-bars").textContent = ""; $("b-result-note").textContent = "";
    const nxt = NODES[nodeIndex(state.node.id) + 1];
    $("b-next-node").style.display = nxt && unlocked(nxt.id) ? "" : "none";
    if (nxt) $("b-next-node").onclick = () => nxt.type === "level" ? startLevel(nxt) : startBoss(nxt);
    showScreen("b-result"); renderHome();
  }

  // ================= 圖鑑 =================
  function renderAtlas() {
    const box = $("b-atlas-content"); box.textContent = "";
    Object.keys(AREA).forEach(lv => {
      const comps = BANK.filter(c => c.level === +lv); if (!comps.length) return;
      box.appendChild(el("h3", "b-atlas-h", `${AREA[lv]}`));
      comps.forEach(c => {
        const got = (save.stars[c.comp] || save.teacher);
        const card = el("div", "b-atlas-card" + (got ? "" : " locked"));
        card.appendChild(el("span", "b-atlas-comp", got ? c.comp : "？"));
        const body = el("span", "b-atlas-body");
        if (got) {
          body.appendChild(el("b", null, c.meaning));
          if (c.base && c.base !== c.comp) body.appendChild(el("span", "b-atlas-base", `本形：${c.base}（${c.role}）`));
          if (c.note) body.appendChild(el("span", "b-atlas-note", c.note));
          body.appendChild(el("span", "b-atlas-ex", "例：" + c.examples.join("　")));
          const st = save.stars[c.comp] || 0; body.appendChild(el("span", "b-atlas-star", "熟練：" + "★".repeat(st) + "☆".repeat(3 - st)));
        } else body.appendChild(el("span", "b-atlas-lock", "尚未解鎖，練習後顯示"));
        card.appendChild(body); box.appendChild(card);
      });
    });
    showScreen("b-atlas");
  }

  // ================= 綁定 =================
  function bind() {
    renderHome();
    $("b-atlas-btn").onclick = renderAtlas;
    $("b-teacher").onchange = e => { save.teacher = e.target.checked; persist(); renderHome(); };
    document.querySelectorAll(".b-home-btn").forEach(b => b.onclick = () => { renderHome(); showScreen("b-home"); });
    document.querySelectorAll(".b-quit").forEach(b => b.onclick = () => { renderHome(); showScreen("b-home"); });
  }
  if (!BANK.length) { document.addEventListener("DOMContentLoaded", () => { const i = $("b-intro"); if (i) i.textContent = "找不到部件資料。"; }); }
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();

  window.__battle = { startLevel, startBoss, renderAtlas, renderTask, NODES, applySkill, get state() { return state; }, get skills() { return state.skills; }, get lastAns() { return lastAns; }, save };
})();
