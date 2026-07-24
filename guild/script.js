(() => {
  "use strict";
  const DS = window.DetectiveSystem;
  const CASES = window.GUILD_CASES;
  const MYTHS = window.GUILD_MYTH_QUESTIONS;
  const $ = id => document.getElementById(id);
  const state = { id:null, title:"", queue:[], index:0, correct:0, answers:[], locked:false, retryArmed:false, retryUsed:false };

  function show(id) {
    document.querySelectorAll(".screen").forEach(node => node.classList.toggle("active", node.id === id));
    scrollTo(0, 0);
  }
  function shuffle(list) {
    const a = list.slice();
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function caseCard(id, data) {
    const status = DS.sideCaseStatus(id);
    let condition = "";
    let action = "開始調查";
    let disabled = false;
    if (id === "sealedArchive" && !status.unlocked) {
      condition = `需要「封存案件鑰匙」｜背包 ${DS.state.inventory.sideKey || 0} 把`;
      action = (DS.state.inventory.sideKey || 0) ? "使用鑰匙解鎖" : "先到大廳商店買鑰匙";
      disabled = !(DS.state.inventory.sideKey || 0);
    } else if (id === "mythRescue" && !status.available) {
      condition = `累積 3 次迷思後出現｜目前 ${DS.totalMyths()}/3`;
      action = "尚未出現"; disabled = true;
    } else if (id === "grandCase" && !status.unlocked) {
      condition = `需要探索 5 館與 8 枚證據｜目前 ${DS.distinctModules().length}/5 館、${DS.state.evidence}/8 證據`;
      action = "線索不足"; disabled = true;
    } else {
      condition = status.cleared ? "已完成，可再次挑戰（獎勵只領一次）" : "案件已開放";
    }
    return `<article class="case-card ${status.cleared ? "cleared" : ""}">
      <span class="case-icon">${data.icon}</span><div><h2>${data.title}</h2><p>${data.desc}</p><small>${condition}</small></div>
      <button data-case="${id}" ${disabled ? "disabled" : ""}>${action}</button></article>`;
  }
  function renderHome() {
    $("g-name").textContent = DS.state.name;
    $("g-coins").textContent = `🪙 ${DS.state.coins}`;
    $("g-evidence").textContent = `🔹 ${DS.state.evidence}`;
    $("g-modules").textContent = `${DS.distinctModules().length}/7 館`;
    const mythData = {
      title:"迷思救援：錯題怪出沒", icon:"👾",
      desc:"依你的錯題紀錄生成個人化救援任務。破解後會降低迷思通緝次數。"
    };
    $("g-cases").innerHTML = caseCard("sealedArchive", CASES.sealedArchive)
      + caseCard("mythRescue", mythData) + caseCard("grandCase", CASES.grandCase);
    document.querySelectorAll("[data-case]").forEach(button => button.onclick = () => openCase(button.dataset.case));
  }
  function openCase(id) {
    if (id === "sealedArchive" && !DS.sideCaseStatus(id).unlocked) {
      const result = DS.unlockSideCase(id); DS.toast(result.msg);
      renderHome(); if (!result.success) return;
    }
    const status = DS.sideCaseStatus(id);
    if (!status.unlocked) return;
    let queue, title;
    if (id === "mythRescue") {
      const targets = DS.rescueTargets().slice(0, 6);
      queue = targets.map(target => ({ ...MYTHS[target.id], monster:target }));
      title = "迷思救援";
    } else {
      queue = CASES[id].questions;
      title = CASES[id].title;
    }
    state.id=id; state.title=title; state.queue=shuffle(queue); state.index=0; state.correct=0; state.answers=[];
    $("g-case-title").textContent = title;
    show("g-play"); renderQuestion();
  }
  function renderTools() {
    [["g-lens","clueLens"],["g-scan","mythScanner"],["g-retry","retryTicket"]].forEach(([buttonId,item]) => {
      const button=$(buttonId); button.querySelector("b").textContent=`×${DS.state.inventory[item] || 0}`;
      button.disabled = state.locked || (DS.state.inventory[item] || 0) < 1
        || (item === "retryTicket" && (state.retryArmed || state.retryUsed));
    });
  }
  function renderQuestion() {
    const q=state.queue[state.index]; state.locked=false; state.retryArmed=false; state.retryUsed=false;
    $("g-retry").classList.remove("active");
    $("g-progress").textContent=`${state.index+1} / ${state.queue.length}`;
    $("g-domain").textContent=q.domain; $("g-question").textContent=q.q;
    $("g-hint").classList.add("hidden"); $("g-feedback").classList.add("hidden"); $("g-next").classList.add("hidden");
    const monster=$("g-monster");
    if(q.monster){monster.classList.remove("hidden");monster.textContent=`${q.monster.emoji} 本題追蹤：${q.monster.name}（累積 ${q.monster.count} 次）`;}
    else monster.classList.add("hidden");
    const opts=shuffle(q.opts.map((text,index)=>({text,correct:index===q.ans})));
    const box=$("g-options"); box.innerHTML="";
    opts.forEach(opt=>{const button=document.createElement("button");button.className="option";button.textContent=opt.text;button.dataset.correct=opt.correct?"1":"0";button.onclick=()=>answer(button);box.appendChild(button);});
    renderTools();
  }
  function answer(button) {
    if(state.locked)return;
    const q=state.queue[state.index], ok=button.dataset.correct==="1";
    if(!ok && state.retryArmed && !state.retryUsed){
      state.retryUsed=true; state.retryArmed=false; button.disabled=true; button.classList.add("wrong");
      $("g-feedback").className="feedback bad"; $("g-feedback").textContent="時光票已啟動：這個選項先排除，再判斷一次。";
      renderTools(); return;
    }
    state.locked=true;
    document.querySelectorAll("#g-options .option").forEach(node=>{node.disabled=true;if(node.dataset.correct==="1")node.classList.add("correct");});
    if(!ok)button.classList.add("wrong"); else state.correct++;
    state.answers.push({correct:ok,myth:q.monster?.id || q.myth || "unknown_fog"});
    $("g-feedback").className=`feedback ${ok?"":"bad"}`;
    $("g-feedback").textContent=(ok?"判斷成立。":"證據不支持這個判斷。")+q.exp;
    $("g-next").textContent=state.index===state.queue.length-1?"完成案件":"下一份證物 →";
    $("g-next").classList.remove("hidden"); renderTools();
  }
  function useLens() {
    if(state.locked || !DS.useItem("clueLens").success)return;
    const wrong=shuffle([...document.querySelectorAll("#g-options .option")].filter(node=>node.dataset.correct!=="1"&&!node.disabled))[0];
    if(wrong){wrong.disabled=true;wrong.classList.add("eliminated");}
    renderTools();
  }
  function useScanner() {
    if(state.locked || !DS.useItem("mythScanner").success)return;
    const q=state.queue[state.index], monster=DS.monsterFor(q.monster?.id || q.myth || "unknown_fog");
    $("g-hint").textContent=`考點：${q.focus}。小心「${monster.name}」：${monster.desc}`;
    $("g-hint").classList.remove("hidden"); renderTools();
  }
  function armRetry() {
    if(state.locked || state.retryArmed || !DS.useItem("retryTicket").success)return;
    state.retryArmed=true; $("g-retry").classList.add("active"); renderTools();
  }
  function finish() {
    const total=state.queue.length, accuracy=Math.round(state.correct/total*100);
    const firstClear=state.id==="mythRescue" || !DS.state.casesCleared[state.id];
    let reward=null;
    if(accuracy>=70 && firstClear) reward=DS.completeSideCase(state.id,accuracy);
    if(state.id==="mythRescue" && accuracy>=70) {
      state.answers.filter(a=>a.correct).forEach(a=>DS.clearMyth(a.myth,1));
    }
    $("g-result-title").textContent=accuracy>=70?"案件成立，證物已歸檔":"線索還有矛盾，案件暫不結案";
    $("g-result-score").textContent=`${accuracy}%`;
    $("g-result-text").textContent=accuracy>=70
      ? `你完成了 ${state.correct}/${total} 份證物判斷。跨科目的線索已經串成完整推理。`
      : `你完成了 ${state.correct}/${total} 份證物判斷。可以回去整理錯誤，再重新挑戰；不會扣幣。`;
    $("g-result-reward").textContent=reward
      ? `取得 🪙${reward.coins}、🔹${reward.evidence}，新稱號「${reward.title}」`
      : accuracy>=70?"本案獎勵已領取；重玩仍可練習。":"達到 70% 即可結案並取得獎勵。";
    show("g-result");
  }
  $("g-lens").onclick=useLens; $("g-scan").onclick=useScanner; $("g-retry").onclick=armRetry;
  $("g-next").onclick=()=>{if(state.index<state.queue.length-1){state.index++;renderQuestion();}else finish();};
  $("g-quit").onclick=()=>{if(confirm("先保留工具消耗並離開這件案件？")){renderHome();show("g-home");}};
  $("g-home-btn").onclick=()=>{renderHome();show("g-home");};
  renderHome();
})();
