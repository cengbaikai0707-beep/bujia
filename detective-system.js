/**
 * 永齡學習偵探社・共用世界系統 v3
 * 純前端：多個個人／小隊檔案、偵探幣、證據、背包、迷思、任務與跨館解鎖。
 */
const DetectiveSystem = {
  KEY: "yl_detective_world_v3",
  LEGACY_KEY: "daohue_detective_state",
  world: null,
  state: null,

  modules: {
    summer:  { name:"夏日英雄", icon:"☀️", relic:"英雄徽章" },
    chinese: { name:"部件偵探社", icon:"文", relic:"文字證物" },
    math:    { name:"數感偵探社", icon:"數", relic:"數字密碼" },
    reading: { name:"讀題偵探社", icon:"讀", relic:"證詞紀錄" },
    party:   { name:"零食大盜", icon:"案", relic:"合作線索" },
    battle:  { name:"部件大亂鬥", icon:"鬥", relic:"怪物核心" },
    radical: { name:"部首字族案", icon:"字", relic:"字族檔案" }
  },

  ranks: [
    { min:0, name:"見習偵探" }, { min:80, name:"線索調查員" },
    { min:180, name:"資深探員" }, { min:340, name:"案件指揮官" },
    { min:560, name:"首席偵探" }
  ],

  items: {
    clueLens: {
      id:"clueLens", name:"條件放大鏡", emoji:"🔍", cost:12,
      desc:"在聯合案件中排除一個錯誤選項。"
    },
    retryTicket: {
      id:"retryTicket", name:"時光票", emoji:"⏳", cost:18,
      desc:"在聯合案件中答錯後，可以重新判斷一次。"
    },
    mythScanner: {
      id:"mythScanner", name:"迷思掃描器", emoji:"📡", cost:14,
      desc:"顯示聯合案件目前題目的考點與常見迷思。"
    },
    supplyPack: {
      id:"supplyPack", name:"遠征補給箱", emoji:"🎒", cost:22,
      desc:"下一次完成任一館任務時，偵探幣獎勵增加 50%。"
    },
    sideKey: {
      id:"sideKey", name:"封存案件鑰匙", emoji:"🗝️", cost:35,
      desc:"用來解鎖一份永久開放的神祕支線案件。"
    }
  },

  trapMonsters: {
    question_thief:   { id:"question_thief", name:"問句小偷", emoji:"🕵️", desc:"偷走題目真正要問的量。" },
    among_beast:      { id:"among_beast", name:"條件混合怪", emoji:"🌀", desc:"把包含、另外與先後條件混在一起。" },
    remainder_ghost:  { id:"remainder_ghost", name:"剩下幽靈", emoji:"👻", desc:"讓人忘記剩餘量或餘數的意義。" },
    comparison_ninja: { id:"comparison_ninja", name:"比較忍者", emoji:"🥷", desc:"把誰多誰少的方向偷偷調換。" },
    distractor_slime: { id:"distractor_slime", name:"干擾史萊姆", emoji:"🟢", desc:"把用不到的資料黏進推理裡。" },
    unit_imp:         { id:"unit_imp", name:"換算小妖", emoji:"📏", desc:"在單位、刻度與時間之間製造混亂。" },
    step_snail:       { id:"step_snail", name:"漏步蝸牛", emoji:"🐌", desc:"讓人做到第一步就急著停下。" },
    bound_golem:      { id:"bound_golem", name:"限制石像", emoji:"🗿", desc:"藏在至少、最多與不能超過裡。" },
    unknown_fog:      { id:"unknown_fog", name:"未知迷霧", emoji:"🌫️", desc:"還沒完成歸檔的錯誤線索。" }
  },

  trapMap: {
    "問句忽略":"question_thief", "問句定位":"question_thief", "把剩下當成送出":"question_thief",
    "其中條件":"among_beast", "條件對應":"among_beast", "條件整合":"among_beast",
    "多條件整合":"among_beast", "分數條件":"among_beast", "優惠條件":"among_beast",
    "漏看表格外條件":"among_beast", "把不符合條件的資料也加入":"among_beast",
    "剩下概念":"remainder_ghost", "剩下的幾分之幾":"remainder_ghost", "餘數處理":"remainder_ghost",
    "有餘數卻沒有加一":"remainder_ghost", "餘數處理錯誤":"remainder_ghost",
    "比較對象":"comparison_ninja", "比較方向":"comparison_ninja", "比較方向顛倒":"comparison_ninja",
    "比較基準弄錯":"comparison_ninja", "比值對應顛倒":"comparison_ninja",
    "干擾資訊":"distractor_slime", "無關資訊":"distractor_slime", "單位干擾":"distractor_slime",
    "把無關數字拿來算":"distractor_slime",
    "單位換算":"unit_imp", "時間進位":"unit_imp", "時間差":"unit_imp", "單位未統一":"unit_imp",
    "容量單位未統一":"unit_imp", "讀錯資料列或時間倒推":"unit_imp",
    "步驟遺漏":"step_snail", "平均分":"step_snail", "每份數量":"step_snail",
    "只完成第一步":"step_snail", "增減順序混亂":"step_snail",
    "至少陷阱":"bound_golem", "至少最多":"bound_golem", "最多限制":"bound_golem",
    "只看除法商、不檢查限制":"bound_golem", "混用人數限制與價格":"bound_golem"
  },

  emptyProfile(id, name, type) {
    return {
      id, name:name || "本機偵探", type:type || "individual",
      createdAt:new Date().toISOString(), coins:20, evidence:0, xp:0,
      inventory:{ clueLens:1, retryTicket:0, mythScanner:0, supplyPack:0, sideKey:0 },
      moduleSeals:{}, moduleBest:{}, myths:{}, titles:[],
      unlocks:{ sealedArchive:false, grandCase:false },
      casesCleared:{}, history:[],
      questDay:"", quest:{ missions:0, evidence:0, modules:[], claimed:{} }
    };
  },

  init() {
    let loaded = null;
    try { loaded = JSON.parse(localStorage.getItem(this.KEY) || "null"); } catch (e) {}
    if (!loaded || loaded.version !== 3 || !loaded.profiles) {
      const id = "p_" + Date.now().toString(36);
      const first = this.emptyProfile(id, "本機偵探", "individual");
      try {
        const legacy = JSON.parse(localStorage.getItem(this.LEGACY_KEY) || "null");
        if (legacy) {
          first.coins = Math.max(20, Number(legacy.coins) || 0);
          first.inventory.clueLens += Number(legacy.inventory?.magnifier) || 0;
          first.inventory.retryTicket += Number(legacy.inventory?.calmCard) || 0;
          first.inventory.mythScanner += Number(legacy.inventory?.detectiveNote) || 0;
          first.myths = Object.assign({}, legacy.trapStats || {});
          first.titles = Array.isArray(legacy.titles) ? legacy.titles.slice() : [];
        }
      } catch (e) {}
      loaded = { version:3, activeId:id, profiles:{ [id]:first } };
    }
    this.world = loaded;
    if (!this.world.profiles[this.world.activeId]) {
      this.world.activeId = Object.keys(this.world.profiles)[0];
    }
    this.state = this.world.profiles[this.world.activeId];
    this.normalize(this.state);
    this.resetDailyQuest();
    this.save();
    this.autoMountDock();
    return this.state;
  },

  normalize(profile) {
    const base = this.emptyProfile(profile.id, profile.name, profile.type);
    Object.keys(base).forEach(key => {
      if (profile[key] == null) profile[key] = base[key];
    });
    profile.inventory = Object.assign(base.inventory, profile.inventory || {});
    profile.moduleSeals = Object.assign({}, profile.moduleSeals || {});
    profile.moduleBest = Object.assign({}, profile.moduleBest || {});
    profile.myths = Object.assign({}, profile.myths || {});
    profile.unlocks = Object.assign(base.unlocks, profile.unlocks || {});
    profile.casesCleared = Object.assign({}, profile.casesCleared || {});
    if (!Array.isArray(profile.titles)) profile.titles = [];
    if (!Array.isArray(profile.history)) profile.history = [];
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.world)); } catch (e) {}
    this.refreshDock();
  },

  listProfiles() { return Object.values(this.world.profiles); },
  activeProfile() { return this.state; },
  createProfile(name, type="individual") {
    const clean = String(name || "").trim().slice(0, 16);
    if (!clean) return { success:false, msg:"請輸入偵探或小隊名稱。" };
    const id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const profile = this.emptyProfile(id, clean, type);
    this.world.profiles[id] = profile;
    this.world.activeId = id;
    this.state = profile;
    this.resetDailyQuest();
    this.save();
    return { success:true, profile };
  },
  switchProfile(id) {
    if (!this.world.profiles[id]) return false;
    this.world.activeId = id; this.state = this.world.profiles[id];
    this.normalize(this.state); this.resetDailyQuest(); this.save(); return true;
  },
  renameProfile(name) {
    const clean = String(name || "").trim().slice(0, 16);
    if (!clean) return false;
    this.state.name = clean; this.save(); return true;
  },

  rankFor(xp=this.state.xp) {
    return this.ranks.slice().reverse().find(rank => xp >= rank.min) || this.ranks[0];
  },
  nextRank() {
    return this.ranks.find(rank => rank.min > this.state.xp) || null;
  },
  distinctModules() {
    return Object.keys(this.state.moduleSeals).filter(id => this.state.moduleSeals[id] > 0);
  },

  addCoins(amount) {
    this.state.coins = Math.max(0, Math.round(this.state.coins + Number(amount || 0)));
    this.save(); return this.state.coins;
  },
  addEvidence(amount) {
    this.state.evidence = Math.max(0, this.state.evidence + Number(amount || 0));
    this.save(); return this.state.evidence;
  },

  buyItem(itemId) {
    const legacy = { magnifier:"clueLens", calmCard:"retryTicket", detectiveNote:"mythScanner" };
    itemId = legacy[itemId] || itemId;
    const item = this.items[itemId];
    if (!item) return { success:false, msg:"找不到這項補給。" };
    if (this.state.coins < item.cost) {
      return { success:false, msg:`偵探幣不足，還差 ${item.cost - this.state.coins} 枚。` };
    }
    this.state.coins -= item.cost;
    this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
    this.save();
    return { success:true, msg:`已將「${item.name}」放進背包。` };
  },
  useItem(itemId) {
    if ((this.state.inventory[itemId] || 0) < 1) return { success:false, msg:"背包裡沒有這項道具。" };
    this.state.inventory[itemId] -= 1; this.save(); return { success:true };
  },
  priceOf(itemId) { return this.items[itemId]?.cost || 0; },

  monsterFor(tag) {
    const id = this.trapMap[tag] || (this.trapMonsters[tag] ? tag : "unknown_fog");
    return this.trapMonsters[id];
  },
  recordTrap(tag) { return this.recordMyth(tag); },
  recordMyth(tag) {
    const monster = this.monsterFor(tag);
    this.state.myths[monster.id] = (this.state.myths[monster.id] || 0) + 1;
    this.save(); return monster;
  },
  totalMyths() { return Object.values(this.state.myths).reduce((sum, n) => sum + n, 0); },
  rescueTargets() {
    return Object.entries(this.state.myths)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({ ...this.trapMonsters[id] || this.trapMonsters.unknown_fog, count }));
  },
  clearMyth(id, amount=1) {
    if (!this.state.myths[id]) return;
    this.state.myths[id] = Math.max(0, this.state.myths[id] - amount);
    if (!this.state.myths[id]) delete this.state.myths[id];
    this.save();
  },

  resetDailyQuest() {
    const day = new Date().toISOString().slice(0, 10);
    if (this.state.questDay === day) return;
    this.state.questDay = day;
    this.state.quest = { missions:0, evidence:0, modules:[], claimed:{} };
  },
  questDefinitions() {
    return [
      { id:"mission", label:"完成任一館任務", now:this.state.quest.missions, goal:1, reward:8 },
      { id:"evidence", label:"取得 2 枚證據", now:this.state.quest.evidence, goal:2, reward:12 },
      { id:"explore", label:"探索 2 個不同館別", now:this.state.quest.modules.length, goal:2, reward:15 }
    ];
  },
  claimQuest(id) {
    const quest = this.questDefinitions().find(item => item.id === id);
    if (!quest || quest.now < quest.goal || this.state.quest.claimed[id]) {
      return { success:false, msg:"這項委託還不能領取。" };
    }
    this.state.quest.claimed[id] = true;
    this.state.coins += quest.reward;
    this.state.xp += 5;
    this.save();
    return { success:true, msg:`委託完成，取得 ${quest.reward} 枚偵探幣。` };
  },

  completeModule(moduleId, summary={}) {
    if (!this.modules[moduleId]) moduleId = "reading";
    const accuracy = Math.max(0, Math.min(100, Number(summary.accuracy || 0)));
    const correct = Number(summary.correct || 0);
    const total = Number(summary.total || 0);
    const sessionId = summary.sessionId || `${moduleId}_${Date.now()}`;
    if (this.state.history.some(entry => entry.sessionId === sessionId)) {
      return { duplicate:true, coins:0, evidence:0 };
    }

    let coins = 6 + Math.floor(accuracy / 10);
    let evidence = accuracy >= 60 ? 1 : 0;
    if (accuracy >= 85) evidence += 1;
    if (summary.reasoning && accuracy >= 70) evidence += 1;
    if ((this.state.inventory.supplyPack || 0) > 0) {
      this.state.inventory.supplyPack -= 1;
      coins = Math.ceil(coins * 1.5);
    }
    this.state.coins += coins;
    this.state.evidence += evidence;
    this.state.xp += correct * 2 + evidence * 10 + 4;
    if (accuracy >= 60) {
      this.state.moduleSeals[moduleId] = (this.state.moduleSeals[moduleId] || 0) + 1;
    }
    this.state.moduleBest[moduleId] = Math.max(this.state.moduleBest[moduleId] || 0, accuracy);

    const mistakes = Array.isArray(summary.mistakes) ? summary.mistakes.slice(0, 8) : [];
    mistakes.forEach(tag => this.recordMyth(tag));

    this.resetDailyQuest();
    this.state.quest.missions += 1;
    this.state.quest.evidence += evidence;
    if (!this.state.quest.modules.includes(moduleId)) this.state.quest.modules.push(moduleId);

    this.state.history.unshift({
      sessionId, moduleId, accuracy, correct, total, coins, evidence,
      at:new Date().toISOString()
    });
    this.state.history = this.state.history.slice(0, 60);
    this.checkUnlocks();
    this.save();
    const result = { coins, evidence, rank:this.rankFor(), module:this.modules[moduleId] };
    this.toast(`完成${result.module.name}：＋${coins} 幣${evidence ? `、＋${evidence} 證據` : ""}`);
    return result;
  },

  sideCaseStatus(id) {
    if (id === "sealedArchive") {
      return { available:true, unlocked:!!this.state.unlocks.sealedArchive, cleared:!!this.state.casesCleared[id] };
    }
    if (id === "mythRescue") {
      return { available:this.totalMyths() >= 3, unlocked:this.totalMyths() >= 3, cleared:false };
    }
    if (id === "grandCase") {
      const available = this.distinctModules().length >= 5 && this.state.evidence >= 8;
      return { available, unlocked:available || !!this.state.unlocks.grandCase, cleared:!!this.state.casesCleared[id] };
    }
    return { available:false, unlocked:false, cleared:false };
  },
  unlockSideCase(id) {
    if (id === "sealedArchive") {
      if (this.state.unlocks[id]) return { success:true, msg:"這份案件已經解鎖。" };
      if ((this.state.inventory.sideKey || 0) < 1) return { success:false, msg:"需要一把「封存案件鑰匙」。" };
      this.state.inventory.sideKey -= 1;
      this.state.unlocks[id] = true;
      this.save(); return { success:true, msg:"封存案件已永久解鎖！" };
    }
    const status = this.sideCaseStatus(id);
    if (!status.available) return { success:false, msg:"還沒收集到足夠的跨館證據。" };
    this.state.unlocks[id] = true; this.save(); return { success:true, msg:"案件已解鎖。" };
  },
  completeSideCase(id, accuracy=100) {
    const rewards = {
      sealedArchive:{ coins:35, evidence:2, title:"封存檔案解讀者" },
      mythRescue:{ coins:20, evidence:1, title:"迷思救援員" },
      grandCase:{ coins:60, evidence:4, title:"七館聯合偵探" }
    };
    const reward = rewards[id]; if (!reward) return null;
    this.state.coins += reward.coins;
    this.state.evidence += reward.evidence;
    this.state.xp += 30;
    if (id !== "mythRescue") this.state.casesCleared[id] = true;
    if (!this.state.titles.includes(reward.title)) this.state.titles.push(reward.title);
    this.checkUnlocks(); this.save();
    return reward;
  },
  checkUnlocks() {
    if (this.distinctModules().length >= 5 && this.state.evidence >= 8) {
      this.state.unlocks.grandCase = true;
    }
  },

  exportActive() {
    return JSON.stringify({ type:"yl-detective-profile", version:3, profile:this.state }, null, 2);
  },
  downloadActive() {
    const blob = new Blob([this.exportActive()], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `偵探檔案_${this.state.name}_${new Date().toISOString().slice(0,10)}.json`;
    link.click(); URL.revokeObjectURL(url);
  },
  importProfile(text) {
    let data;
    try { data = typeof text === "string" ? JSON.parse(text) : text; } catch (e) {
      return { success:false, msg:"檔案格式無法讀取。" };
    }
    const raw = data?.profile || data;
    if (!raw || !raw.name) return { success:false, msg:"這不是有效的偵探檔案。" };
    const id = "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
    const profile = Object.assign(this.emptyProfile(id, raw.name, raw.type), raw, { id });
    this.normalize(profile);
    this.world.profiles[id] = profile; this.world.activeId = id; this.state = profile;
    this.save(); return { success:true, profile };
  },

  // 舊版相容：不再因答錯扣幣。
  baseCoinFor(difficulty) { return difficulty === "挑戰" ? 6 : 4; },
  calculateReward(baseCoin, isCorrect) {
    const earned = isCorrect ? Math.max(1, Number(baseCoin || 0)) : 0;
    if (earned) this.addCoins(earned);
    return {
      earnedCoins:earned, penalty:0,
      message:isCorrect ? `取得 ${earned} 枚偵探幣。` : "這次不扣幣，錯誤已轉成待調查線索。",
      currentCoins:this.state.coins
    };
  },
  revengeTargets() {
    return this.rescueTargets().filter(item => item.count >= 3);
  },
  completeRevenge(monsterId) {
    const monster = this.trapMonsters[monsterId]; if (!monster) return null;
    this.clearMyth(monsterId, 3);
    const title = monster.name + "剋星";
    if (!this.state.titles.includes(title)) this.state.titles.push(title);
    this.state.coins += 20; this.save(); return title;
  },
  todayEvent() { return { id:"normal", name:"探索日", desc:"完成任務、蒐集證據、開啟支線。", coinMul:1, shopMul:1 }; },

  detectModule() {
    const path = location.pathname;
    return Object.keys(this.modules).find(id => path.includes(`/${id === "radical" ? "radical-case" : id}/`)) || null;
  },
  autoMountDock() {
    if (typeof document === "undefined") return;
    const run = () => {
      const moduleId = this.detectModule();
      if (moduleId && !document.getElementById("ds-world-dock")) this.mountDock(moduleId);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
  },
  mountDock(moduleId) {
    const style = document.createElement("style");
    style.textContent = `
      #ds-world-dock{position:fixed;z-index:999;right:12px;bottom:12px;display:flex;gap:7px;
        align-items:center;padding:8px 10px;border-radius:999px;background:#17232d;color:#fff;
        box-shadow:0 4px 18px #0004;font:600 12px/1.2 "Microsoft JhengHei",sans-serif}
      #ds-world-dock a{color:#ffd36b;text-decoration:none}#ds-world-dock .ds-p{max-width:110px;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #ds-toast{position:fixed;z-index:1001;left:50%;bottom:70px;transform:translateX(-50%);
        background:#17232d;color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 5px 20px #0004;
        font:700 14px "Microsoft JhengHei",sans-serif;transition:.2s}
      @media(max-width:520px){#ds-world-dock .ds-rank{display:none}}
    `;
    document.head.appendChild(style);
    const dock = document.createElement("div"); dock.id = "ds-world-dock";
    dock.innerHTML = `<span class="ds-p"></span><span class="ds-rank"></span><span class="ds-coins"></span><span class="ds-evidence"></span><a href="../index.html">大廳</a>`;
    document.body.appendChild(dock);
    this.refreshDock();
  },
  refreshDock() {
    if (typeof document === "undefined") return;
    const dock = document.getElementById("ds-world-dock"); if (!dock || !this.state) return;
    dock.querySelector(".ds-p").textContent = this.state.type === "team" ? `👥 ${this.state.name}` : `🕵️ ${this.state.name}`;
    dock.querySelector(".ds-rank").textContent = this.rankFor().name;
    dock.querySelector(".ds-coins").textContent = `🪙${this.state.coins}`;
    dock.querySelector(".ds-evidence").textContent = `🔹${this.state.evidence}`;
  },
  toast(message) {
    if (typeof document === "undefined" || !document.body) return;
    let toast = document.getElementById("ds-toast");
    if (!toast) { toast = document.createElement("div"); toast.id = "ds-toast"; document.body.appendChild(toast); }
    toast.textContent = message; toast.style.opacity = "1";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 3500);
  }
};

if (typeof window !== "undefined") {
  window.DetectiveSystem = DetectiveSystem;
  DetectiveSystem.init();
}
if (typeof module !== "undefined") module.exports = DetectiveSystem;
