const $ = id => document.getElementById(id);
const DIFF_LABEL = { basic:"基礎", standard:"標準", challenge:"挑戰", mixed:"混合" };
const state = { name:"", diff:"mixed", count:8, queue:[], index:0, answers:[], locked:false, current:[] };

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
  state.locked = true;
  const q = state.queue[state.index];
  const chosen = state.current[idx];
  const correct = chosen.correct;

  state.answers.push({
    id:q.id, skill:q.skill, difficulty:q.difficulty,
    trap:q.trap || "其他", chosen:chosen.text, correct
  });

  const btns = $("options").querySelectorAll(".option");
  btns.forEach((b,i)=>{
    b.disabled = true;
    if(state.current[i].correct) b.classList.add("correct");
    else if(i === idx) b.classList.add("wrong");
  });

  const fb = $("feedback");
  fb.className = "feedback" + (correct ? "" : " bad");
  $("fb-title").textContent = correct ? "✔ 判斷正確" : "✘ 審題線索漏掉了";
  $("fb-message").textContent = correct ? "很好，你有抓到題目的關鍵。" : q.hint;
  $("fb-explain").textContent = q.exp;
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
  $("r-context").textContent = `難度：${DIFF_LABEL[state.diff]} ｜ ${state.queue.length} 題 ｜ ${new Date().toLocaleDateString("zh-TW")}`;
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
  const sortedTraps = Object.entries(s.traps).sort((a,b)=>b[1]-a[1]);
  if(sortedTraps.length){
    trapBox.innerHTML = `<div class="trap-list">${sortedTraps.map(([t,n])=>`<span class="trap-item">${escapeHTML(t)}（${n}次）</span>`).join("")}</div>`;
  } else {
    trapBox.innerHTML = "<p class='muted'>沒有掉進明顯陷阱，審題很穩。</p>";
  }

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

$("btn-start").addEventListener("click",startGame);
$("btn-next").addEventListener("click",nextQuestion);
$("btn-export").addEventListener("click",exportResult);
$("btn-again").addEventListener("click",startGame);
$("btn-quit").addEventListener("click",()=>{
  if(confirm("作答尚未匯出，確定離開？")) location.href="../hub.html";
});
