/* 夏日英雄大會師・引擎
   六座試煉場循序解鎖 + 大會師總決賽（抽你答錯過的概念補考）。
   題型：single 單選／multi 多選／order 排序／reason 兩段式（答案＋理由）。
   存檔於 localStorage；偵探幣接全站共用錢包（若有載入）。 */
(function () {
  const BANK = window.SUMMER_BANK || [];
  const DS = window.DetectiveSystem || null;

  const TRIALS = [
    { lv:1, name:"數的王國",   icon:"🏰", desc:"位值、數感與規律" },
    { lv:2, name:"運算意義島", icon:"🌊", desc:"加減乘除到底在做什麼" },
    { lv:3, name:"分數綠洲",   icon:"🌴", desc:"分數與小數的意義" },
    { lv:4, name:"測量高塔",   icon:"🗼", desc:"長度、重量、時間與角度" },
    { lv:5, name:"形狀神殿",   icon:"🏛️", desc:"圖形、周長與面積" },
    { lv:6, name:"資料燈塔",   icon:"🗼", desc:"圖表判讀與數量關係" }
  ];
  const HEROES = [
    { id:"sun",   name:"烈陽劍士", icon:"🌞", perk:"每場一次「再想一次」", buff:"retry" },
    { id:"wave",  name:"浪花法師", icon:"🌊", perk:"每場一次「刪去一個錯的」", buff:"cut" },
    { id:"wind",  name:"微風遊俠", icon:"🍃", perk:"每場一次「看重點提示」", buff:"hint" },
    { id:"shell", name:"貝殼盾衛", icon:"🐚", perk:"答錯不中斷連擊一次",   buff:"shield" }
  ];
  const PASS = 0.6;   // 過關門檻

  const $ = id => document.getElementById(id);
  const el = (t,c,x) => { const e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e; };
  const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const sample = (a,n) => shuffle(a).slice(0,n);
  const show = id => { document.querySelectorAll(".s-screen").forEach(s=>s.classList.toggle("active", s.id===id)); window.scrollTo(0,0); };

  /* ---------- 存檔 ---------- */
  const KEY = "summer_hero_v1";
  let save = { hero:null, stars:{}, cleared:{}, wrongConcepts:{}, best:{} };
  try { const s=localStorage.getItem(KEY); if(s) save=Object.assign(save,JSON.parse(s)); } catch(e){}
  const persist = () => { try{ localStorage.setItem(KEY,JSON.stringify(save)); }catch(e){} };
  const unlocked = lv => lv===1 || !!save.cleared[lv-1];
  const finalsOpen = () => TRIALS.every(t=>save.cleared[t.lv]);

  /* ---------- 首頁 ---------- */
  function renderHome() {
    const hb = $("s-heroes"); hb.textContent="";
    HEROES.forEach(h=>{
      const b = el("button","s-hero"+(save.hero===h.id?" on":""));
      b.type="button";
      b.appendChild(el("span","s-hero-ic",h.icon));
      b.appendChild(el("strong",null,h.name));
      b.appendChild(el("small",null,h.perk));
      b.onclick = ()=>{ save.hero=h.id; persist(); renderHome(); };
      hb.appendChild(b);
    });
    const guide = $("s-hero-guide");
    const chosenHero = HEROES.find(h=>h.id===save.hero);
    guide.textContent = chosenHero
      ? `目前英雄：${chosenHero.icon} ${chosenHero.name}｜${chosenHero.perk}`
      : "請先選擇英雄，再進入試煉場。";
    guide.classList.toggle("warn", !chosenHero);
    const map = $("s-map"); map.textContent="";
    TRIALS.forEach(t=>{
      const open = unlocked(t.lv), st = save.stars[t.lv]||0;
      const c = el("button","s-trial"+(open?"":" locked")+(st?" done":""));
      c.type="button"; c.disabled=!open;
      c.appendChild(el("span","s-trial-ic",t.icon));
      c.appendChild(el("strong",null,t.name));
      c.appendChild(el("small",null,open?t.desc:"通過前一關才會開啟"));
      c.appendChild(el("span","s-suns", open ? "☀".repeat(st)+"·".repeat(3-st) : "🔒"));
      c.onclick = ()=>{
        if(!open) return;
        if(!requireHero()) return;
        startTrial(t.lv);
      };
      map.appendChild(c);
    });
    const fb = $("s-finals");
    fb.disabled = !finalsOpen();
    fb.textContent = finalsOpen() ? "🏆 大會師總決賽（補考你答錯過的概念）" : "🔒 通過六座試煉場才能參加總決賽";
    $("s-progress-line").textContent = `已通過 ${Object.keys(save.cleared).length} / 6 座試煉場`;
    renderMythPanel();
  }
  function renderMythPanel() {
    const box = $("s-myth-panel"); box.textContent="";
    const items = Object.entries(save.wrongConcepts).sort((a,b)=>b[1]-a[1]).slice(0,6);
    if(!items.length){ box.appendChild(el("p","s-muted","目前還沒有累積的弱點紀錄。挑戰試煉場之後，這裡會列出最該補強的概念。")); return; }
    items.forEach(([c,n])=>{
      const r = el("div","s-myth-row");
      r.appendChild(el("span","s-myth-name",c));
      r.appendChild(el("span","s-myth-n",`錯過 ${n} 次`));
      box.appendChild(r);
    });
  }

  /* ---------- 出題 ---------- */
  const st = {};
  function startTrial(lv) {
    const pool = BANK.filter(q=>q.level===lv);
    begin(sample(pool, Math.min(8,pool.length)), { lv, title:TRIALS.find(t=>t.lv===lv).name });
  }
  function startFinals() {
    // 優先抽你答錯過的概念，不足再用高年級題補齊
    const weak = Object.keys(save.wrongConcepts);
    let pool = BANK.filter(q=>weak.includes(q.concept));
    let qs = sample(pool, Math.min(6,pool.length));
    if(qs.length<8){
      const rest = BANK.filter(q=>!qs.includes(q) && q.grade>=3);
      qs = qs.concat(sample(rest, 8-qs.length));
    }
    begin(shuffle(qs), { lv:"final", title:"大會師總決賽" });
  }
  function requireHero() {
    if(save.hero) return true;
    const guide = $("s-hero-guide");
    guide.textContent = "請先選一位英雄，英雄技能會陪你完成每一場試煉。";
    guide.classList.add("warn");
    guide.scrollIntoView({ behavior:"smooth", block:"center" });
    return false;
  }
  function begin(qs, meta) {
    st.qs=qs; st.i=0; st.meta=meta; st.correct=0; st.combo=0; st.best=0;
    st.wrong=[]; st.areas={}; st.usedPerk=false; st.shield=false; st.retryReady=false;
    $("s-play-title").textContent = meta.title;
    $("s-play-sub").textContent = `共 ${qs.length} 題 ｜ 概念為主，算式為輔`;
    renderPerk();
    renderQ();
    show("s-play");
  }
  function renderPerk() {
    const h = HEROES.find(x=>x.id===save.hero);
    const box = $("s-perk"); box.textContent="";
    if(!h) return;
    const b = el("button","s-perk-btn"+(st.usedPerk?" used":""));
    b.type="button"; b.disabled=st.usedPerk;
    b.textContent = `${h.icon} ${h.perk}${st.usedPerk?"（已使用）":""}`;
    b.onclick = ()=>usePerk(h.buff);
    box.appendChild(b);
  }
  function usePerk(buff) {
    if(st.usedPerk) return;
    const q = st.qs[st.i];
    if(buff==="cut"){
      const wrap = $("s-opts");
      const kill = [...wrap.children].filter((c,i)=>!isAnsIndex(q,i) && !c.disabled);
      if(!kill.length) return note("這一題沒有可以刪的選項。");
      const target = kill[Math.floor(Math.random()*kill.length)];
      target.disabled = true;
      target.classList.add("cut");
      note("刪去一個錯的選項！");
    } else if(buff==="hint"){
      note("提示：這題在考「"+q.concept+"」。"+(q.myth?"小心迷思——"+q.myth+"。":""));
    } else if(buff==="shield"){
      st.shield=true; note("護盾就位：下一次答錯不會中斷連擊。");
    } else if(buff==="retry"){
      st.retryReady=true; note("「再想一次」就緒：本場下一次答錯時，可以重答一次。");
    }
    st.usedPerk=true; renderPerk();
  }
  function isAnsIndex(q,i){ return q.type==="multi" ? q.ans.includes(i) : q.ans===i; }
  function note(msg){ const n=$("s-note"); n.textContent=msg; n.classList.remove("hidden"); }

  function head() {
    $("s-count").textContent = `第 ${st.i+1} / ${st.qs.length} 題`;
    $("s-score").textContent = `答對 ${st.correct}${st.combo>1?" ｜ 連擊 ×"+st.combo:""}`;
    $("s-bar-fill").style.width = Math.round(st.i/st.qs.length*100)+"%";
  }
  function renderQ() {
    head();
    $("s-note").classList.add("hidden"); $("s-note").textContent="";
    const q = st.qs[st.i];
    $("s-concept").textContent = `${q.area} ｜ ${q.grade} 年級`;
    $("s-q").textContent = q.q;
    $("s-fb").textContent=""; $("s-fb").className="s-fb hidden";
    const s2=$("s-stage2"); s2.textContent=""; s2.removeAttribute("data-done");  // 不清會讓同場第二題的理由選項點不動
    $("s-next").classList.add("hidden");
    const oldMulti = $("s-multi-go"); if(oldMulti) oldMulti.remove();
    const box = $("s-opts"); box.textContent=""; box.className = "s-opts type-"+q.type;
    st.locked=false; st.picked=[]; st.order=[];
    if(q.type==="order") renderOrder(q,box); else renderChoices(q,box);
    if(q.type==="multi"){
      const sub = el("button","s-btn s-ghost s-block","確定送出（可複選）");
      sub.type="button"; sub.id="s-multi-go";
      sub.onclick = ()=>judgeMulti(q);
      box.after(sub);
    }
  }
  function renderChoices(q,box) {
    q.opts.forEach((t,i)=>{
      const b = el("button","s-opt",t); b.type="button";
      b.onclick = ()=>{
        if(st.locked) return;
        if(q.type==="multi"){
          const k=st.picked.indexOf(i);
          if(k>=0){st.picked.splice(k,1); b.classList.remove("on");}
          else {st.picked.push(i); b.classList.add("on");}
          return;
        }
        judgeSingle(q,i,b);
      };
      box.appendChild(b);
    });
  }
  function renderOrder(q,box) {
    const tip = el("p","s-tip","依序點選，點錯可以按「重排」重來。");
    box.appendChild(tip);
    const row = el("div","s-order-row");
    q.opts.forEach((t,i)=>{
      const b = el("button","s-opt s-ord",t); b.type="button";
      b.onclick = ()=>{
        if(st.locked || st.order.includes(i)) return;
        st.order.push(i); b.classList.add("on");
        b.textContent = `${st.order.length}. ${t}`;
        if(st.order.length===q.opts.length) judgeOrder(q);
      };
      row.appendChild(b);
    });
    box.appendChild(row);
    const re = el("button","s-btn s-ghost s-block","↺ 重排"); re.type="button";
    re.onclick = ()=>{ if(!st.locked) renderQ(); };
    box.appendChild(re);
  }

  /* ---------- 判定 ---------- */
  function judgeSingle(q,i,btn) {
    const ok = i===q.ans;
    if(!ok && st.retryReady){
      st.retryReady=false;
      btn.disabled=true; btn.classList.add("no");
      note("這個不對——用掉「再想一次」，再選一次看看。");
      return;
    }
    lockChoices(q);
    if(!ok) btn.classList.add("no");
    if(q.type==="reason" && ok){ stageReason(q); return; }
    finish(q, ok);
  }
  function judgeMulti(q) {
    if(st.locked) return;
    const a=[...st.picked].sort((x,y)=>x-y).join(","), b=[...q.ans].sort((x,y)=>x-y).join(",");
    lockChoices(q);
    finish(q, a===b);
  }
  function judgeOrder(q) {
    lockChoices(q);
    finish(q, st.order.join(",")===q.ans.join(","));
  }
  function lockChoices(q) {
    st.locked=true;
    [...$("s-opts").querySelectorAll(".s-opt")].forEach((b,i)=>{
      b.disabled=true;
      if(q.type==="order"){ if(q.ans[st.order.indexOf(i)]===i) b.classList.add("ok"); }
      else if(isAnsIndex(q,i)) b.classList.add("ok");
      else if(st.picked.includes(i)) b.classList.add("no");
    });
    const g=$("s-multi-go"); if(g) g.remove();
  }
  // 兩段式：答案對了還要選出理由
  function stageReason(q) {
    const box=$("s-stage2"); box.textContent="";
    box.appendChild(el("p","s-q2","答案對了。那——為什麼？"));
    const wrap=el("div","s-opts");
    q.reasons.forEach((t,i)=>{
      const b=el("button","s-opt s-reason",t); b.type="button";
      b.onclick=()=>{
        if(box.dataset.done) return; box.dataset.done="1";
        [...wrap.children].forEach((c,j)=>{ c.disabled=true; if(j===q.rAns) c.classList.add("ok"); });
        const good = i===q.rAns;
        if(!good) b.classList.add("no");
        finish(q, good, good ? "答案和理由都對，這才是真的懂！" : "答案猜對了，但理由要再想想——");
      };
      wrap.appendChild(b);
    });
    box.appendChild(wrap);
  }
  function finish(q, ok, prefix) {
    if(ok){ st.correct++; st.combo++; st.best=Math.max(st.best,st.combo); }
    else if(st.shield){ st.shield=false; note("護盾擋下：連擊保住了。"); }
    else st.combo=0;
    if(!st.areas[q.area]) st.areas[q.area]=[0,0];
    st.areas[q.area][1]++; if(ok) st.areas[q.area][0]++;
    if(!ok){
      st.wrong.push(q);
      save.wrongConcepts[q.concept]=(save.wrongConcepts[q.concept]||0)+1;
    } else if(save.wrongConcepts[q.concept]){
      save.wrongConcepts[q.concept]--;                 // 答對就把弱點紀錄減回去
      if(save.wrongConcepts[q.concept]<=0) delete save.wrongConcepts[q.concept];
    }
    persist();
    if(ok && DS){
      DS.addCoins(6); DS.save();
      $("s-coins").textContent = "🪙 " + DS.state.coins;
    }
    const fb=$("s-fb");
    fb.className="s-fb "+(ok?"good":"bad");
    fb.textContent="";
    fb.appendChild(el("strong",null,(prefix||(ok?"✔ 正確！":"✘ 再看一次"))));
    fb.appendChild(el("p",null,q.exp));
    if(!ok && q.myth) fb.appendChild(el("p","s-myth-line","常見迷思："+q.myth));
    const nx=$("s-next");
    nx.textContent = st.i<st.qs.length-1 ? "下一題 →" : "看成績";
    nx.classList.remove("hidden");
    head();
  }
  function next() {
    st.i++;
    if(st.i<st.qs.length){ renderQ(); renderPerk(); }
    else result();
  }

  /* ---------- 結算 ---------- */
  function result() {
    const total=st.qs.length, pct=Math.round(st.correct/total*100);
    const stars = pct>=90?3 : pct>=75?2 : pct>=PASS*100?1 : 0;
    if(st.meta.lv!=="final"){
      if(stars>0) save.cleared[st.meta.lv]=true;
      if(stars>(save.stars[st.meta.lv]||0)) save.stars[st.meta.lv]=stars;
      persist();
    }
    $("s-r-title").textContent = stars===3?"🏆 完美通關！你是本屆夏日英雄"
      : stars===2?"🥇 通過試煉！還有一點可以更穩"
      : stars===1?"🥈 低空通過，弱點已經記下來了"
      : "🔥 還沒過關，這些概念再練一次就好";
    $("s-r-sub").textContent = `${st.meta.title} ｜ 答對 ${st.correct}/${total}（${pct}%）｜ 最高連擊 ×${st.best} ｜ ${"☀".repeat(stars)||"—"}`;
    const box=$("s-r-areas"); box.textContent="";
    Object.entries(st.areas).forEach(([a,[c,n]])=>{
      const p=Math.round(c/n*100);
      const row=el("div","s-area-row");
      row.appendChild(el("span","s-area-name",a));
      const track=el("div","s-area-track"); const fill=el("div","s-area-fill");
      fill.style.width=p+"%"; track.appendChild(fill); row.appendChild(track);
      row.appendChild(el("span","s-area-val",`${c}/${n}`));
      box.appendChild(row);
    });
    const mb=$("s-r-myth"); mb.textContent="";
    if(st.wrong.length){
      mb.appendChild(el("h3","s-h3","這次踩到的迷思"));
      st.wrong.forEach(q=>{
        const c=el("div","s-myth-card");
        c.appendChild(el("strong",null,q.concept));
        c.appendChild(el("p",null,q.myth||q.exp));
        mb.appendChild(c);
      });
    } else {
      mb.appendChild(el("p","s-muted","這一場沒有踩到任何迷思，觀念很穩！"));
    }
    show("s-result");
    renderHome();
  }

  /* ---------- 綁定 ---------- */
  function bind() {
    renderHome();
    $("s-next").onclick = next;
    $("s-finals").onclick = ()=>{ if(requireHero()) startFinals(); };
    document.querySelectorAll(".s-home-btn").forEach(b=>b.onclick=()=>{ renderHome(); show("s-home"); });
    if(DS) $("s-coins").textContent = "🪙 " + DS.state.coins;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind); else bind();

  window.__summer = { get st(){return st;}, save, startTrial, startFinals, next, TRIALS, HEROES, BANK };
})();
