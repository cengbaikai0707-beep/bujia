const $=id=>document.getElementById(id);
const PATH_LABEL={common:"四年級共學",foundation:"基礎補強",extension:"進階延伸"};
const MODE_LABEL={quick:"暖身10題",practice:"練習15題",check:"檢核20題"};
const MODE_COUNT={quick:10,practice:15,check:20};
const SKILLS=["位值","加減","乘法","除法","估算","應用"];
const state={name:"",path:"common",mode:"quick",skill:"all",queue:[],index:0,answers:[],locked:false,current:[],hintUsed:false};

function shuffle(list){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");$("topbar").classList.toggle("hidden",id!=="screen-game");scrollTo(0,0);}

function bindChoices(attr,key){document.querySelectorAll(`[data-${attr}]`).forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(`[data-${attr}]`).forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");state[key]=btn.dataset[attr];}));}
bindChoices("path","path");bindChoices("mode","mode");

function drawQuestions(){
  const bank=window.MATH_QUESTION_BANK||[];
  let pool=bank.filter(q=>q.path===state.path&&q.mode.includes(state.mode)&&(state.skill==="all"||q.skillType===state.skill));
  const count=Math.min(MODE_COUNT[state.mode],pool.length);
  if(state.skill!=="all") return shuffle(pool).slice(0,count);
  const buckets=Object.fromEntries(SKILLS.map(s=>[s,shuffle(pool.filter(q=>q.skillType===s))]));
  const picked=[];
  while(picked.length<count){
    let added=false;
    for(const skill of SKILLS){if(picked.length<count&&buckets[skill].length){picked.push(buckets[skill].pop());added=true;}}
    if(!added)break;
  }
  return shuffle(picked);
}

function startGame(){
  state.name=$("student-name").value.trim()||"無名偵探";state.skill=$("skill-filter").value;state.answers=[];state.index=0;
  state.worldSessionId=`math_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  state.queue=drawQuestions();
  if(!state.queue.length){alert("目前沒有符合條件的題目。");return;}
  render();show("screen-game");
}

function render(){
  const q=state.queue[state.index];state.locked=false;state.hintUsed=false;
  $("bar-title").textContent=`${PATH_LABEL[state.path]} · ${q.skillType}`;
  $("bar-progress").textContent=`${state.index+1} / ${state.queue.length}`;
  $("rail-fill").style.width=`${state.index/state.queue.length*100}%`;
  $("q-meta").textContent=`${q.skillType}｜${q.difficulty}｜${PATH_LABEL[q.path]}`;
  $("q-text").textContent=q.question;
  state.current=shuffle(q.options.map((text,i)=>({text,correct:i===q.answerIndex})));
  const box=$("options");box.innerHTML="";
  state.current.forEach((opt,i)=>{const b=document.createElement("button");b.className="option";b.innerHTML=`<span class="key">${"ABCD"[i]}</span><span>${escapeHTML(opt.text)}</span>`;b.addEventListener("click",()=>answer(i));box.appendChild(b);});
  $("hint-box").classList.add("hidden");$("hint-box").textContent="";$("btn-hint").classList.remove("hidden");
  $("feedback").className="feedback hidden";$("btn-next").classList.add("hidden");$("btn-next").textContent=state.index===state.queue.length-1?"查看結果":"下一題";
}

function showHint(){if(state.locked)return;const q=state.queue[state.index];state.hintUsed=true;$("hint-box").textContent=`提示：${q.wrongHint}`;$("hint-box").classList.remove("hidden");$("btn-hint").classList.add("hidden");}
function answer(index){
  if(state.locked)return;state.locked=true;const q=state.queue[state.index],chosen=state.current[index],ok=chosen.correct;
  state.answers.push({id:q.id,skillType:q.skillType,difficulty:q.difficulty,chosen:chosen.text,correct:ok,hintUsed:state.hintUsed});
  $("options").querySelectorAll(".option").forEach((b,i)=>{b.disabled=true;if(state.current[i].correct)b.classList.add("correct");else if(i===index)b.classList.add("wrong");});
  $("feedback").className=`feedback${ok?"":" bad"}`;$("fb-title").textContent=ok?"判斷正確":"先別急，跟著解析修正";$("fb-message").textContent=ok?q.correctFeedback:q.wrongHint;$("fb-explain").textContent=q.explanation;
  $("btn-hint").classList.add("hidden");$("btn-next").classList.remove("hidden");$("rail-fill").style.width=`${(state.index+1)/state.queue.length*100}%`;
}

function next(){if(state.index<state.queue.length-1){state.index++;render();}else showResult();}
function stats(){
  const total=state.answers.length,correct=state.answers.filter(a=>a.correct).length,accuracy=total?Math.round(correct/total*100):0;
  const skills=Object.fromEntries(SKILLS.map(s=>[s,{total:0,correct:0}]));state.answers.forEach(a=>{skills[a.skillType].total++;if(a.correct)skills[a.skillType].correct++;});
  return{total,correct,accuracy,skills};
}
function showResult(){
  const s=stats();$("r-name").textContent=state.name;$("r-context").textContent=`${PATH_LABEL[state.path]}｜${MODE_LABEL[state.mode]}｜${new Date().toLocaleDateString("zh-TW")}`;$("r-score").textContent=`${s.accuracy}%`;$("r-count").textContent=`答對 ${s.correct} / ${s.total} 題`;
  $("r-skills").innerHTML=SKILLS.filter(k=>s.skills[k].total).map(k=>{const v=s.skills[k],pct=Math.round(v.correct/v.total*100);return`<div class="skill-row"><div class="skill-top"><strong>${k}</strong><span>${v.correct}/${v.total}　${pct}%</span></div><div class="skill-rail"><div class="skill-fill" style="width:${pct}%"></div></div></div>`}).join("");
  const weak=SKILLS.filter(k=>s.skills[k].total).sort((a,b)=>(s.skills[a].correct/s.skills[a].total)-(s.skills[b].correct/s.skills[b].total)).slice(0,2);
  $("r-next").textContent=s.accuracy>=85?`共同核心已穩定，可改走進階延伸；仍可用「${weak.join("、")}」題說明不同解法。`:`下一次先練「${weak.join("、")}」。先做短題，再請同學只給一個線索，最後由自己重說一次方法。`;
  if(window.DetectiveSystem)window.DetectiveSystem.completeModule("math",{accuracy:s.accuracy,correct:s.correct,total:s.total,mistakes:state.answers.filter(a=>!a.correct).map(a=>a.skillType),reasoning:state.path==="extension",sessionId:state.worldSessionId});
  show("screen-result");
}
function exportResult(){const s=stats(),data={subject:"math",studentName:state.name,path:state.path,mode:state.mode,skillFilter:state.skill,...s,answers:state.answers,completedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`數感偵探社_${state.name}_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);}

$("btn-start").addEventListener("click",startGame);$("btn-hint").addEventListener("click",showHint);$("btn-next").addEventListener("click",next);$("btn-export").addEventListener("click",exportResult);$("btn-again").addEventListener("click",startGame);$("btn-quit").addEventListener("click",()=>{if(confirm("這次作答尚未匯出，確定回數學首頁嗎？"))show("screen-home");});
