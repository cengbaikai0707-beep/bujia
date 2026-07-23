const $ = id => document.getElementById(id);
const DIFF_LABEL = { basic:"基礎", standard:"標準", challenge:"挑戰", mixed:"混合" };
const state = { name:"", diff:"mixed", count:8, queue:[], index:0, answers:[], locked:false, current:[],
                bet:"steady", shielded:false, sessionCoins:0, revenge:null };
const DS = window.DetectiveSystem;

function shuffle(a){
  const b=a.slice();
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]];
  }
  return b;
}
function escapeHTML(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  $("topbar").classList.toggle("hidden", id !== "screen-game");
  scrollTo(0,0);
}

document.querySelectorAll("[data-diff]").forEach(b=>b.addEventListener("click",function(){
  document.querySelectorAll("[data-diff]").forEach(x=>x.classList.remove("selected"));
  this.classList.add("selected");
  state.diff=this.dataset.diff;
}));
document.querySelectorAll("[data-count]").forEach(b=>b.addEventListener("click",function(){
  document.querySelectorAll("[data-count]").forEach(x=>x.classList.remove("selected"));
  this.classList.add("selected");
  state.count=parseInt(this.dataset.count,10);
}));

function drawQuestions(){
  const bank = window.READING_QUESTION_BANK || [];
  let pool = bank;
  if(state.diff === "basic") pool = bank.filter(q => q.difficulty === "基礎");
  else if(state.diff === "standard") pool = bank.filter(q => q.difficulty === "標準");
  else if(state.diff === "challenge") pool = bank.filter(q => q.difficulty === "挑戰");
  return shuffle(pool).slice(0, Math.min(state.count, pool.length));
}

function startGame(){
  state.name = $("student-name").value.trim() || "無名偵探";
  state.revenge = null;
  state.sessionCoins = 0;
  state.queue = drawQuestions();
  if(!state.queue.length){
    alert("目前沒有符合的題目，請檢查 reading/questions.js。");
    return;
  }
  state.answers = [];
  state.index = 0;
  renderQuestion();
  show("screen-game");
}

function renderQuestion(){
  const q = state.queue[state.index];
  state.locked = false;
  state.shielded = false;
  setBet("steady");
  $("betting-zone").classList.remove("hidden");
  $("monster-alert").classList.add("hidden");
  $("monster-alert").textContent = "";
  updateDetectiveUI();
  $("bar-title").textContent = `審題 · ${q.skill}`;
  $("bar-progress").textContent = `${state.index+1} / ${state.queue.length}`;
  $("rail-fill").style.width = `${state.index/state.queue.length*100}%`;
  $("q-meta").textContent = `${q.skill} ｜ ${q.difficulty}`;
  $("q-text").textContent = q.q;

  state.current = shuffle(q.opts.map((text,i)=>({ text, correct:i === q.ans })));
  const box = $("options");
  box.innerHTML = "";
  state.current.forEach((opt,i)=>{
    const b = document.createElement("button");
    b.className = "option";
    b.innerHTML = `<span class="key">${"ABCD"[i]}</span><span>${escapeHTML(opt.text)}</span>`;
    b.addEventListener("click",()=>answer(i));
    box.appendChild(b);
  });

  $("feedback").className = "feedback hidden";
  $("btn-next").classList.add("hidden");
  $("btn-next").textContent = state.index === state.queue.length-1 ? "查看結果" : "下一題";
}

function answer(idx){
  if(state.locked) return;
  const q = state.queue[state.index];
  // 保險：作答當下扣款，幣不足則自動改為穩健
  if(state.bet === "insurance"){
    if(DS.state.coins < DS.BET.insurance.cost){
      setBet("steady");
      flashShop("偵探幣不足 5 枚，本題自動改為穩健調查。");
    } else {
      DS.addCoins(-DS.BET.insurance.cost);
    }
  }
  state.locked = true;
  $("betting-zone").classList.add("hidden");
  const chosen = state.current[idx];
  const correct = chosen.correct;

  state.answers.push({
    id:q.id, skill:q.skill, difficulty:q.difficulty,
    trap:q.trap || "其他", chosen:chosen.text, correct, bet:state.bet
  });

  const btns = $("options").querySelectorAll(".option");
  btns.forEach((b,i)=>{
    b.disabled = true;
    if(state.current[i].correct) b.classList.add("correct");
    else if(i === idx) b.classList.add("wrong");
  });

  // 偵探幣結算
  const res = DS.calculateReward(DS.baseCoinFor(q.difficulty), correct, state.bet, state.shielded);
  state.sessionCoins += res.earnedCoins - res.penalty;

  // 答錯 → 記錄並顯示陷阱怪
  if(!correct){
    const m = DS.recordTrap(q.trap || "");
    const box = $("monster-alert");
    box.textContent = "";
    const t = document.createElement("strong");
    t.textContent = `${m.emoji} 遭到「${m.name}」襲擊！`;
    const d = document.createElement("small");
    d.textContent = m.desc;
    box.appendChild(t); box.appendChild(d);
    box.classList.remove("hidden");
  }

  const fb = $("feedback");
  fb.className = "feedback" + (correct ? "" : " bad");
  $("fb-title").textContent = correct ? "✔ 判斷正確" : "✘ 審題線索漏掉了";
  $("fb-message").textContent = correct ? "很好，你有抓到題目的關鍵。" : q.hint;
  $("fb-explain").textContent = q.exp;
  $("fb-coins").textContent = `🪙 ${res.message}（目前 ${res.currentCoins} 枚）`;
  updateDetectiveUI();
  $("btn-next").classList.remove("hidden");
  $("rail-fill").style.width = `${(state.index+1)/state.queue.length*100}%`;
}

function nextQuestion(){
  if(state.index < state.queue.length-1){
    state.index++;
    renderQuestion();
  } else {
    showResult();
  }
}

function buildStats(){
  const total = state.answers.length;
  const correct = state.answers.filter(a=>a.correct).length;
  const accuracy = total ? Math.round(correct/total*100) : 0;
  const skills = {};
  const traps = {};
  state.answers.forEach(a=>{
    if(!skills[a.skill]) skills[a.skill] = {total:0, correct:0};
    skills[a.skill].total++;
    if(a.correct) skills[a.skill].correct++;
    else traps[a.trap] = (traps[a.trap] || 0) + 1;
  });
  return { total, correct, accuracy, skills, traps };
}

function showResult(){
  const s = buildStats();
  $("r-name").textContent = state.name;
  $("r-context").textContent = `難度：${state.revenge ? "復仇任務" : DIFF_LABEL[state.diff]} ｜ ${state.queue.length} 題 ｜ 本次偵探幣 ${state.sessionCoins >= 0 ? "+" : ""}${state.sessionCoins} ｜ ${new Date().toLocaleDateString("zh-TW")}`;
  $("r-score").textContent = `${s.accuracy}%`;
  $("r-count").textContent = `答對 ${s.correct} / ${s.total} 題`;

  const skillBox = $("r-skills");
  skillBox.innerHTML = "";
  Object.keys(s.skills).forEach(k=>{
    const st = s.skills[k];
    const pct = st.total ? Math.round(st.correct/st.total*100) : 0;
    const d = document.createElement("div");
    d.className = "skill-row";
    d.innerHTML = `<div class="skill-top"><strong>${escapeHTML(k)}</strong><span>${st.correct}/${st.total}　${pct}%</span></div><div class="skill-rail"><div class="skill-fill" style="width:${pct}%"></div></div>`;
    skillBox.appendChild(d);
  });

  const trapBox = $("r-traps");
  trapBox.textContent = "";
  const sortedTraps = Object.entries(s.traps).sort((a,b)=>b[1]-a[1]);
  if(sortedTraps.length){
    const list = document.createElement("div");
    list.className = "trap-list";
    // 依陷阱怪家族彙整，顯示「你剛才遭到 X 攻擊」而不是「第幾題錯」
    const byMonster = {};
    sortedTraps.forEach(([tag,n])=>{
      const m = DS.monsterFor(tag);
      if(!byMonster[m.id]) byMonster[m.id] = { m, n:0, tags:[] };
      byMonster[m.id].n += n;
      byMonster[m.id].tags.push(tag);
    });
    Object.values(byMonster).sort((a,b)=>b.n-a.n).forEach(({m,n,tags})=>{
      const item = document.createElement("span");
      item.className = "trap-item";
      item.textContent = `${m.emoji} 遭到「${m.name}」攻擊 ${n} 次（${tags.join("、")}）`;
      list.appendChild(item);
    });
    trapBox.appendChild(list);
  } else {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "沒有掉進明顯陷阱，審題很穩。";
    trapBox.appendChild(p);
  }
  renderRevenge();

  const weak = Object.keys(s.skills).sort((a,b)=>{
    const pa = s.skills[a].correct / s.skills[a].total;
    const pb = s.skills[b].correct / s.skills[b].total;
    return pa - pb;
  });
  $("r-next").textContent = s.accuracy >= 85
    ? "表現穩定。考前可以把錯題重看一次，確認不是因為粗心讀錯。"
    : `建議優先加強「${weak.slice(0,2).join("、")}」，答題前先圈出題目問句與關鍵條件。`;
  show("screen-result");
}

function exportResult(){
  const s = buildStats();
  const data = {
    subject:"reading",
    studentName:state.name,
    difficulty:state.diff,
    count:state.queue.length,
    total:s.total,
    correct:s.correct,
    accuracy:s.accuracy,
    skills:s.skills,
    traps:s.traps,
    answers:state.answers,
    completedAt:new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `讀題偵探社_${state.name}_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================= 偵探系統 UI ================= */
function updateDetectiveUI(){
  $("coin-count").textContent = DS.state.coins;
  $("home-coins").textContent = DS.state.coins;
  ["magnifier","calmCard","detectiveNote"].forEach(k=>{
    $("count-" + k).textContent = DS.state.inventory[k] || 0;
  });
}
function setBet(mode){
  state.bet = mode;
  document.querySelectorAll("[data-bet]").forEach(b=>b.classList.toggle("selected", b.dataset.bet === mode));
}
function flashShop(msg){
  const box = $("shop-msg");
  box.textContent = msg;
  setTimeout(()=>{ if(box.textContent === msg) box.textContent = ""; }, 3000);
}
function toolNote(msg){
  const box = $("monster-alert");
  box.textContent = msg;
  box.classList.remove("hidden");
}

/* ---- 商店 ---- */
function renderShop(){
  const ev = DS.todayEvent();
  $("shop-event").textContent = `今日：${ev.name}｜${ev.desc}`;
  const list = $("shop-list");
  list.textContent = "";
  Object.keys(DS.items).forEach(id=>{
    const it = DS.items[id], price = DS.priceOf(id);
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.className = "shop-info";
    const nm = document.createElement("strong");
    nm.textContent = `${it.emoji} ${it.name}`;
    const ds = document.createElement("small");
    ds.textContent = it.desc;
    info.appendChild(nm); info.appendChild(ds);
    const buy = document.createElement("button");
    buy.className = "buy-btn";
    buy.textContent = `${price} 幣　購買`;
    buy.addEventListener("click", ()=>{
      const r = DS.buyItem(id);
      flashShop(r.msg);
      updateDetectiveUI();
    });
    row.appendChild(info); row.appendChild(buy);
    list.appendChild(row);
  });
}
function toggleShop(){
  const shop = $("shop-modal");
  const opening = shop.classList.contains("hidden");
  if(opening) renderShop();
  shop.classList.toggle("hidden");
}

/* ---- 道具使用 ---- */
function useMagnifier(){
  if(state.locked) return toolNote("這一題已經作答，放大鏡留到下一題吧。");
  const wrong = [...$("options").querySelectorAll(".option")]
    .filter((b,i)=>!state.current[i].correct && !b.classList.contains("removed"));
  if(wrong.length <= 1) return toolNote("已經沒有可以排除的錯誤選項了。");
  if(!DS.useItem("magnifier").success) return toolNote("還沒有放大鏡，先去商店買。");
  const target = wrong[Math.floor(Math.random()*wrong.length)];
  target.classList.add("removed");
  target.disabled = true;
  toolNote("🔍 放大鏡發揮作用，排除了一個錯誤選項。");
  updateDetectiveUI();
}
function useCalmCard(){
  if(state.locked) return toolNote("這一題已經作答了。");
  if(state.shielded) return toolNote("這一題已經有冷靜卡保護了。");
  if(!DS.useItem("calmCard").success) return toolNote("還沒有冷靜卡，先去商店買。");
  state.shielded = true;
  toolNote("🛡️ 冷靜卡就位：這一題答錯不扣偵探幣。");
  updateDetectiveUI();
}
function useNote(){
  if(state.locked) return toolNote("這一題已經作答了。");
  if(!DS.useItem("detectiveNote").success) return toolNote("還沒有偵探筆記，先去商店買。");
  const q = state.queue[state.index];
  const m = DS.monsterFor(q.trap || "");
  toolNote(`📜 偵探筆記：這一題埋伏著「${m.name}」——${m.desc}`);
  updateDetectiveUI();
}

/* ---- 每日事件與圖鑑 ---- */
function renderDailyEvent(){
  const ev = DS.todayEvent();
  $("daily-event").textContent = `📅 今日偵探社：${ev.name}——${ev.desc}`;
}
function renderTitles(){
  const box = $("home-titles");
  box.textContent = "";
  if(!DS.state.titles.length) return;
  DS.state.titles.forEach(t=>{
    const s = document.createElement("span");
    s.className = "title-chip";
    s.textContent = "🏅 " + t;
    box.appendChild(s);
  });
}
function renderBestiary(){
  const box = $("bestiary");
  box.textContent = "";
  Object.values(DS.trapMonsters).forEach(m=>{
    const n = DS.state.trapStats[m.id] || 0;
    const card = document.createElement("div");
    card.className = "beast-card" + (n ? "" : " locked");
    const face = document.createElement("span");
    face.className = "beast-face";
    face.textContent = n ? m.emoji : "？";
    const body = document.createElement("span");
    body.className = "beast-body";
    const nm = document.createElement("strong");
    nm.textContent = n ? m.name : "尚未遭遇";
    const ds = document.createElement("small");
    ds.textContent = n ? m.desc : "在練習中掉進這個陷阱後，就會記錄下來。";
    body.appendChild(nm); body.appendChild(ds);
    if(n){
      const cnt = document.createElement("small");
      cnt.className = "beast-count";
      cnt.textContent = DS.state.avenged[m.id] ? `遭遇 ${n} 次 ｜ 已復仇 🏅` : `遭遇 ${n} 次`;
      body.appendChild(cnt);
    }
    card.appendChild(face); card.appendChild(body);
    box.appendChild(card);
  });
}

/* ---- 復仇任務 ---- */
function renderRevenge(){
  const box = $("r-revenge");
  box.textContent = "";
  box.classList.add("hidden");

  // 剛完成的復仇任務結算
  if(state.revenge){
    const allRight = state.answers.length && state.answers.every(a=>a.correct);
    const m = DS.trapMonsters[state.revenge];
    const p = document.createElement("p");
    if(allRight){
      const title = DS.completeRevenge(state.revenge);
      p.textContent = `🏅 復仇成功！你擊退了「${m.name}」，獲得稱號「${title}」與 30 枚偵探幣。`;
    } else {
      p.textContent = `「${m.name}」這次沒被打倒——復仇任務要 3 題全對。再挑戰一次！`;
    }
    box.appendChild(p);
    box.classList.remove("hidden");
    renderTitles();
    return;
  }

  const targets = DS.revengeTargets();
  if(!targets.length) return;
  const m = targets[0];
  const head = document.createElement("p");
  head.textContent = `${m.emoji} 你已經被「${m.name}」攻擊 ${DS.state.trapStats[m.id]} 次了。要不要展開復仇任務？（3 題同類型，全對即可獲得稱號）`;
  const btn = document.createElement("button");
  btn.className = "primary";
  btn.textContent = `⚔️ 挑戰「${m.name}」`;
  btn.addEventListener("click", ()=>startRevenge(m.id));
  box.appendChild(head); box.appendChild(btn);
  box.classList.remove("hidden");
}
function startRevenge(monsterId){
  const bank = window.READING_QUESTION_BANK || [];
  const pool = bank.filter(q => DS.monsterFor(q.trap || "").id === monsterId);
  if(pool.length < 3) return;
  state.revenge = monsterId;
  state.sessionCoins = 0;
  state.queue = shuffle(pool).slice(0,3);
  state.answers = [];
  state.index = 0;
  renderQuestion();
  show("screen-game");
}

/* ---- 綁定 ---- */
$("btn-shop").addEventListener("click", toggleShop);
$("btn-shop-close").addEventListener("click", toggleShop);
$("use-magnifier").addEventListener("click", useMagnifier);
$("use-calmCard").addEventListener("click", useCalmCard);
$("use-detectiveNote").addEventListener("click", useNote);
document.querySelectorAll("[data-bet]").forEach(b=>b.addEventListener("click", function(){ setBet(this.dataset.bet); }));
$("btn-bestiary").addEventListener("click", ()=>{
  const box = $("bestiary");
  if(box.classList.contains("hidden")) renderBestiary();
  box.classList.toggle("hidden");
});

renderDailyEvent();
renderTitles();
updateDetectiveUI();

$("btn-start").addEventListener("click",startGame);
$("btn-next").addEventListener("click",nextQuestion);
$("btn-export").addEventListener("click",exportResult);
$("btn-again").addEventListener("click",startGame);
$("btn-quit").addEventListener("click",()=>{
  if(confirm("作答尚未匯出，確定離開？")) location.href="../hub.html";
});

// 供自動化測試取用（不影響遊玩）
window.__reading = { get state(){ return state; }, DS };
