(() => {
  "use strict";
  const DATA = window.WEDNESDAY_REVIEW_DATA;
  const DS = window.DetectiveSystem;
  const STORAGE_KEY = "yl_wednesday_review_v1";
  const $ = id => document.getElementById(id);
  const state = { student:"", bank:[], queue:[], index:0, answers:[], locked:false, baseCount:12, repairs:0, sessionId:"" };

  function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);}
  function normalizeName(value){return String(value||"").replace(/[\s　]/g,"").trim();}
  function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function hash(value){return String(value||"").split("").reduce((sum,ch)=>(sum*31+ch.charCodeAt(0))>>>0,7);}
  function questionSignature(item){return item.dynamic?item.stem:`${item.stem}||${(item.options||[]).join("|")}`;}
  function instantiate(base, usedSignatures, salt=0){
    let item=null;
    for(let attempt=0;attempt<20;attempt++){
      const seed=Date.now()+hash(base.id)+salt*1009+attempt*7919+Math.floor(Math.random()*1000000);
      item=DATA.materialize(base,seed);
      if(!usedSignatures.has(questionSignature(item)))break;
    }
    if(!item||usedSignatures.has(questionSignature(item)))return null;
    usedSignatures.add(questionSignature(item));
    return Object.assign({},item,{sessionOptions:shuffle(item.options)});
  }
  function loadProgress(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")||{};}catch(e){return {};}}
  function saveProgress(all){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(all));}catch(e){}}
  function studentProgress(name){const all=loadProgress();return all[name]||{seen:{},wrong:{},errors:{},history:[],rewardWeeks:{}};}
  function weekKey(date=new Date()){
    const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
    const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function availableFor(name){return (DATA.banks[name]||[]).filter(item=>item.status==="verified"||item.status==="provisional");}
  function coverage(name){
    const bank=DATA.banks[name]||[];
    return { total:bank.length,verified:bank.filter(q=>q.status==="verified").length,provisional:bank.filter(q=>q.status==="provisional").length,pending:bank.filter(q=>q.status==="pending").length,ready:availableFor(name).length };
  }
  function unitStatus(name,unit){
    const questions=(DATA.banks[name]||[]).filter(q=>q.unit===unit);
    if(questions.some(q=>q.status==="verified"))return "ready";
    if(questions.some(q=>q.status==="provisional"))return "provisional";
    return "pending";
  }

  function renderCoverage(){
    $("student-list").innerHTML=Object.keys(DATA.students).map(name=>`<option value="${esc(name)}"></option>`).join("");
    $("coverage-rows").innerHTML=Object.keys(DATA.students).map(name=>{const c=coverage(name);return `<tr><td>${esc(name)}</td><td>${c.total}</td><td>${c.ready}</td><td>${c.verified}</td><td>${c.provisional}</td><td>${c.pending}</td></tr>`;}).join("");
  }

  function findStudent(){
    const typed=normalizeName($("student-name").value);
    const name=Object.keys(DATA.students).find(item=>normalizeName(item)===typed);
    if(!name){$("student-card").classList.add("hidden");$("lookup-message").textContent="找不到這個姓名，請確認是否使用偵探社登記的名字。";return;}
    state.student=name;state.bank=DATA.banks[name];
    const config=DATA.students[name],c=coverage(name);
    $("lookup-message").textContent="";$("student-title").textContent=`${name}的週三題庫`;$("student-note").textContent=config.note;$("ready-count").textContent=c.ready;
    $("student-plan").innerHTML=config.plan.map(([unit,count])=>{const status=unitStatus(name,unit);const bankTopic=(state.bank.find(item=>item.unit===unit)||{}).topic;const topic=bankTopic||(DATA.unitMeta[unit]||{}).topic||(unit==="mixed"?"跨單元綜合應用":"綜合應用練習");const label=status==="ready"?"正式可練":status==="provisional"?"可練習（範圍暫定）":"尚未建立";return `<div class="plan-item ${status}"><strong>${esc(unit)}｜${count} 題</strong><small>${esc(topic)}</small><small>${label}</small></div>`;}).join("");
    const warning=$("coverage-warning");warning.classList.toggle("hidden",c.pending===0);
    warning.textContent=c.pending?`目前有 ${c.pending} 題尚未建立，不會抽給學生；本次會使用 ${c.ready} 題可練內容。`:"所有 50 題都可以練習。";
    const countSelect=$("question-count"),countOptions=[...countSelect.options];
    countOptions.forEach(option=>{option.disabled=Number(option.value)>c.ready;});
    if(countSelect.selectedOptions[0]&&countSelect.selectedOptions[0].disabled){
      const fallback=countOptions.filter(option=>!option.disabled).pop();
      if(fallback)countSelect.value=fallback.value;
    }
    $("start-review").disabled=c.ready<10;
    if(c.ready<10)$("lookup-message").textContent="這位學生目前不足 10 題可用題目；補上單元總表後才能開始，避免抽到錯誤單元。";
    $("student-card").classList.remove("hidden");
  }

  function ensureDetectiveProfile(name){
    const profile=DS.listProfiles().find(item=>normalizeName(item.name)===normalizeName(name));
    if(profile)DS.switchProfile(profile.id);else DS.createProfile(name,"individual");
  }
  function chooseQuestions(name,count){
    const available=availableFor(name),progress=studentProgress(name);
    const priority=available.filter(q=>(progress.wrong[q.id]||0)>0).sort((a,b)=>(progress.wrong[b.id]||0)-(progress.wrong[a.id]||0));
    const unseen=shuffle(available.filter(q=>!progress.seen[q.id]&&!priority.includes(q)));
    const seen=shuffle(available.filter(q=>progress.seen[q.id]&&!priority.includes(q)));
    const ordered=[...priority,...unseen,...seen],picked=[],groups=new Set();
    ordered.forEach(q=>{if(picked.length<count&&!groups.has(q.variantGroup)){picked.push(q);groups.add(q.variantGroup);}});
    ordered.forEach(q=>{if(picked.length<count&&!picked.includes(q))picked.push(q);});
    const usedSignatures=new Set(),questions=[];
    const candidates=[...shuffle(picked.slice(0,Math.min(count,available.length))),...shuffle(ordered.filter(question=>!picked.includes(question)))];
    candidates.forEach((question,index)=>{if(questions.length>=count)return;const item=instantiate(question,usedSignatures,index);if(item)questions.push(item);});
    return questions;
  }

  function startReview(){
    const count=Math.min(Number($("question-count").value)||12,15);ensureDetectiveProfile(state.student);
    state.baseCount=count;state.queue=chooseQuestions(state.student,count);state.index=0;state.answers=[];state.repairs=0;state.locked=false;state.sessionId=`wed_${state.student}_${Date.now()}`;
    $("screen-lookup").classList.add("hidden");$("screen-result").classList.add("hidden");$("screen-quiz").classList.remove("hidden");$("quiz-student").textContent=`${state.student}的數學總複習`;renderQuestion();
  }
  function typeLabel(type){return ({concept:"概念辨識",basic:"基本操作",application:"生活應用",error:"找錯訂正",transfer:"遷移挑戰"})[type]||"數學練習";}
  function renderQuestion(){
    const item=state.queue[state.index];state.locked=false;
    $("quiz-position").textContent=`${state.index+1} / ${state.queue.length}`;$("quiz-score").textContent=`目前答對 ${state.answers.filter(a=>a.correct).length}`;$("progress-fill").style.width=`${state.index/state.queue.length*100}%`;
    $("question-unit").textContent=`${item.unit} ${item.topic}`;$("question-skill").textContent=item.skill;$("question-level").textContent=`${typeLabel(item.questionType)}｜難度 ${item.difficulty}`;$("question-status").textContent=`${item.status==="provisional"?"暫定範圍":"已核定"}${item.dynamic?"｜動態數字":"｜固定診斷"}`;
    $("repair-label").classList.toggle("hidden",!item.remedial);$("question-stem").textContent=item.stem;
    $("options").innerHTML=item.sessionOptions.map((option,index)=>`<button class="option" data-option="${index}" type="button">${esc(option)}</button>`).join("");
    document.querySelectorAll("[data-option]").forEach(button=>button.onclick=()=>answer(Number(button.dataset.option)));
    $("show-hint").classList.remove("hidden");$("hint-box").classList.add("hidden");$("feedback").className="feedback hidden";$("next-question").classList.add("hidden");
  }
  function scheduleRepair(item){
    const distance=3+Math.floor(Math.random()*3),at=Math.min(state.queue.length,state.index+distance);
    const pool=state.bank.filter(q=>(q.status==="verified"||q.status==="provisional")&&q.skill===item.skill);
    const candidate=shuffle(pool.filter(q=>q.id!==item.id&&!state.queue.some(current=>current.id===q.id)))[0]||shuffle(pool.filter(q=>q.id!==item.id))[0]||(item.dynamic?pool[0]:null);
    if(candidate&&state.queue.length<15){
      const used=new Set(state.queue.map(questionSignature));const repair=instantiate(candidate,used,state.repairs+state.index+41);
      if(repair&&questionSignature(repair)!==questionSignature(item)){state.queue.splice(at,0,Object.assign({},repair,{remedial:true}));state.repairs+=1;return true;}
    }
    const futureIndex=state.queue.findIndex((q,index)=>index>state.index&&q.skill===item.skill&&q.id!==item.id);
    if(futureIndex<0)return false;
    const existing=state.queue[futureIndex],base=state.bank.find(q=>q.id===existing.id)||existing;
    const used=new Set(state.queue.filter((_,index)=>index!==futureIndex).map(questionSignature));
    const refreshed=instantiate(base,used,state.repairs+state.index+73);if(!refreshed)return false;
    state.queue.splice(futureIndex,1);const target=Math.min(state.queue.length,at);state.queue.splice(target,0,Object.assign({},refreshed,{remedial:true}));state.repairs+=1;return true;
  }
  function answer(index){
    if(state.locked)return;state.locked=true;const item=state.queue[state.index],chosen=item.sessionOptions[index],correct=chosen===item.answer;
    state.answers.push({id:item.id,skill:item.skill,errorCode:item.errorCode,correct,remedial:!!item.remedial,status:item.status});
    document.querySelectorAll("[data-option]").forEach((button,i)=>{button.disabled=true;const value=item.sessionOptions[i];if(value===item.answer)button.classList.add("correct");else if(i===index)button.classList.add("wrong");});
    const repairAdded=!correct&&scheduleRepair(item);$("feedback").className=`feedback ${correct?"good":"bad"}`;$("feedback-title").textContent=correct?"判斷正確":"先修復這條數學線索";$("feedback-explanation").textContent=item.explanation;$("feedback-error").textContent=correct?`能力：${item.skill}`:`常見錯誤：${item.errorCode}${repairAdded?"；後面會再出一題同技能換題修復。":"；已記入下次優先複習。"}`;
    $("show-hint").classList.add("hidden");$("next-question").classList.remove("hidden");$("next-question").textContent=state.index===state.queue.length-1?"查看本次診斷":"下一題";
  }
  function updateStoredProgress(){
    const all=loadProgress(),progress=studentProgress(state.student);state.answers.forEach(answer=>{progress.seen[answer.id]=(progress.seen[answer.id]||0)+1;if(answer.correct)progress.wrong[answer.id]=Math.max(0,(progress.wrong[answer.id]||0)-1);else{progress.wrong[answer.id]=(progress.wrong[answer.id]||0)+1;progress.errors[answer.errorCode]=(progress.errors[answer.errorCode]||0)+1;}});
    const correct=state.answers.filter(a=>a.correct).length,accuracy=Math.round(correct/state.answers.length*100);progress.history.unshift({at:new Date().toISOString(),correct,total:state.answers.length,accuracy});progress.history=progress.history.slice(0,20);all[state.student]=progress;saveProgress(all);return {all,progress,correct,accuracy};
  }
  function finishReview(){
    const saved=updateStoredProgress(),week=weekKey();let rewardText="";
    if(!saved.progress.rewardWeeks[week]){
      saved.progress.rewardWeeks[week]=true;saved.all[state.student]=saved.progress;saveProgress(saved.all);
      const mistakes=state.answers.filter(a=>!a.correct).map(a=>a.errorCode);
      const result=DS.completeModule("math",{accuracy:saved.accuracy,correct:saved.correct,total:state.answers.length,mistakes,reasoning:true,sessionId:state.sessionId});
      rewardText=`本週主要獎勵已結算：＋${result.coins||0} 偵探幣、＋${result.evidence||0} 證據${result.petMatDrop?`、＋1 ${result.petMatDrop.emoji}${result.petMatDrop.name}`:result.petFragDrop?`、＋1/2 ${result.petFragDrop.emoji}${result.petFragDrop.name}碎片`:""}。`;
    }else rewardText="本週主要獎勵已領取；這次練習仍會更新錯題與能力紀錄。";
    $("screen-quiz").classList.add("hidden");$("screen-result").classList.remove("hidden");$("result-title").textContent=`${state.student}完成本次複習`;$("result-summary").textContent=saved.accuracy>=85?"核心線索掌握穩定，可以挑戰變化題。":saved.accuracy>=70?"基本概念正在穩定，錯題修復後會更扎實。":"已找到需要回補的能力，下一次會優先重現。";$("result-accuracy").textContent=`${saved.accuracy}%`;$("result-correct").textContent=`${saved.correct}/${state.answers.length}`;$("result-repairs").textContent=state.answers.filter(a=>a.remedial).length;
    const stats={};state.answers.forEach(a=>{stats[a.skill]=stats[a.skill]||{correct:0,total:0};stats[a.skill].total++;if(a.correct)stats[a.skill].correct++;});
    $("skill-results").innerHTML=Object.entries(stats).sort((a,b)=>a[1].correct/a[1].total-b[1].correct/b[1].total).map(([skill,s])=>{const pct=Math.round(s.correct/s.total*100);return `<div class="skill-row"><div><strong>${esc(skill)}</strong><small>${s.correct}/${s.total} 題正確</small></div><b class="${pct>=70?"good":"need"}">${pct>=70?"穩定":"需回補"}</b></div>`;}).join("");
    $("reward-result").textContent=rewardText;
  }

  $("find-student").onclick=findStudent;$("student-name").addEventListener("keydown",event=>{if(event.key==="Enter")findStudent();});$("start-review").onclick=startReview;
  $("show-hint").onclick=()=>{const item=state.queue[state.index];$("hint-box").textContent=`先想想：${item.prerequisite||item.skill}`;$("hint-box").classList.remove("hidden");$("show-hint").classList.add("hidden");};
  $("next-question").onclick=()=>{if(state.index<state.queue.length-1){state.index++;renderQuestion();}else finishReview();};
  $("retry-review").onclick=()=>{state.queue=chooseQuestions(state.student,state.baseCount);state.index=0;state.answers=[];state.repairs=0;state.sessionId=`wed_${state.student}_${Date.now()}`;$("screen-result").classList.add("hidden");$("screen-quiz").classList.remove("hidden");renderQuestion();};
  renderCoverage();
})();
