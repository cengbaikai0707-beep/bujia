/* 舊版平板相容性補強（ES2019 以下裝置）：
   本檔在每個模組都最先載入，因此 polyfill 放這裡即可覆蓋全站。
   若確定所有裝置都在 iOS 13.4 / Chrome 80 以上，可安全刪除這一段。 */
(function () {
  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (fn, thisArg) {
      return this.reduce(function (acc, v, i, arr) {
        var r = fn.call(thisArg, v, i, arr);
        return acc.concat(Array.isArray(r) ? r : [r]);
      }, []);
    };
  }
  if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
      var out = {};
      Array.prototype.forEach.call(entries, function (pair) { out[pair[0]] = pair[1]; });
      return out;
    };
  }
})();

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
      inventory:{
        clueLens:1, retryTicket:0, mythScanner:0, supplyPack:0, sideKey:0,
        petFood:0, petSnack:0, petToy:0, petMed:0
      },
      moduleSeals:{}, moduleBest:{}, myths:{}, titles:[],
      unlocks:{ sealedArchive:false, grandCase:false },
      casesCleared:{}, history:[],
      questDay:"", quest:{ missions:0, evidence:0, modules:[], claimed:{} },
      farmDay:"", farmCount:{},
      pet:null, pets:{}, activePetId:"", petMat:{}, petFrag:{},
      petWishDay:"", petWish:null, petWishes:{}, companionVisible:true,
      petCloset:{ none:true }, petRooms:{ study:true }
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
          first.inventory.clueLens += Number((legacy.inventory || {}).magnifier) || 0;
          first.inventory.retryTicket += Number((legacy.inventory || {}).calmCard) || 0;
          first.inventory.mythScanner += Number((legacy.inventory || {}).detectiveNote) || 0;
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
    this.autoMountCompanion();
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
    profile.farmCount = Object.assign({}, profile.farmCount || {});
    profile.petMat = Object.assign({}, profile.petMat || {});
    profile.petFrag = Object.assign({}, profile.petFrag || {});
    profile.petWishes = Object.assign({}, profile.petWishes || {});
    profile.pets = Object.assign({}, profile.pets || {});
    profile.petCloset = Object.assign({ none:true }, profile.petCloset || {});
    profile.petRooms = Object.assign({ study:true }, profile.petRooms || {});
    // 舊夥伴版只有單一 pet；自動搬進收藏，不讓既有進度消失。
    if (profile.pet && !profile.pets[profile.pet.species]) {
      profile.pets[profile.pet.species] = profile.pet;
    }
    if (!profile.activePetId && profile.pet) profile.activePetId = profile.pet.species;
    if (!profile.activePetId && Object.keys(profile.pets).length) {
      profile.activePetId = Object.keys(profile.pets)[0];
    }
    if (profile.activePetId && profile.pets[profile.activePetId]) {
      profile.pet = profile.pets[profile.activePetId];
    }
    Object.keys(profile.pets).forEach(speciesId => {
      const pet = profile.pets[speciesId];
      pet.species = pet.species || speciesId;
      if (pet.bond == null) pet.bond = Number(pet.care || 0);
      if (!Array.isArray(pet.growthModules)) pet.growthModules = [];
      if (!pet.accessory) pet.accessory = "none";
      if (!pet.room) pet.room = "study";
      if (pet.sick == null) pet.sick = false;
    });
    if (!Array.isArray(profile.titles)) profile.titles = [];
    if (!Array.isArray(profile.history)) profile.history = [];
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.world)); } catch (e) {}
    this.refreshDock();
    this.refreshCompanion();
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
  priceOf(itemId) { return (this.items[itemId] || {}).cost || 0; },

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

  // 依裝置所在地換日；臺灣使用時會在午夜重置，而不是 UTC 的早上 8 點。
  localDateKey(date) {
    const d = date || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  resetDailyQuest() {
    const day = this.localDateKey();
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
    let bonus = "";
    if (id === "mission") {
      this.state.inventory.petFood = (this.state.inventory.petFood || 0) + 1;
      bonus = "、🍖偵探飼料 ×1";
    }
    this.save();
    return { success:true, msg:`委託完成，取得 ${quest.reward} 枚偵探幣${bonus}。` };
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
    // 正確率太低視為亂點，不給幣（但仍記錄迷思、仍給少量經驗，不懲罰認真但答錯的孩子）
    if (accuracy < 40) coins = 0;
    else if (accuracy < 60) coins = Math.floor(coins / 2);
    // 同一館同一天重複完成，第 3 次起收益折半、第 5 次起歸零，避免重跑刷幣
    const today = this.localDateKey();
    if (this.state.farmDay !== today) { this.state.farmDay = today; this.state.farmCount = {}; }
    const runs = (this.state.farmCount[moduleId] || 0);
    if (runs >= 4) coins = 0;
    else if (runs >= 2) coins = Math.floor(coins / 2);
    this.state.farmCount[moduleId] = runs + 1;

    let evidence = accuracy >= 60 ? 1 : 0;
    if (accuracy >= 85) evidence += 1;
    if (summary.reasoning && accuracy >= 70) evidence += 1;
    if (coins > 0 && (this.state.inventory.supplyPack || 0) > 0) {
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

    // 進化材料：85 分以上掉完整材料；70～84 分給碎片，兩片自動合成。
    let petMatDrop = null;
    let petFragDrop = null;
    if (accuracy >= 85 && runs < 2) {
      this.state.petMat[moduleId] = (this.state.petMat[moduleId] || 0) + 1;
      petMatDrop = this.petMaterials[moduleId];
    } else if (accuracy >= 70 && runs < 2) {
      this.state.petFrag[moduleId] = (this.state.petFrag[moduleId] || 0) + 1;
      petFragDrop = this.petMaterials[moduleId];
      if (this.state.petFrag[moduleId] >= 2) {
        this.state.petFrag[moduleId] -= 2;
        this.state.petMat[moduleId] = (this.state.petMat[moduleId] || 0) + 1;
        petMatDrop = this.petMaterials[moduleId];
      }
    }

    const mistakes = Array.isArray(summary.mistakes) ? summary.mistakes.slice(0, 8) : [];
    mistakes.forEach(tag => this.recordMyth(tag));

    this.resetDailyQuest();
    this.state.quest.missions += 1;
    this.state.quest.evidence += evidence;
    if (!this.state.quest.modules.includes(moduleId)) this.state.quest.modules.push(moduleId);
    const wishResult = this.updatePetWish(moduleId, accuracy);

    this.state.history.unshift({
      sessionId, moduleId, accuracy, correct, total, coins, evidence,
      at:new Date().toISOString()
    });
    this.state.history = this.state.history.slice(0, 60);
    this.checkUnlocks();
    this.save();
    const result = { coins, evidence, rank:this.rankFor(), module:this.modules[moduleId], petMatDrop, petFragDrop, wishResult };
    const materialCopy = petMatDrop ? `、＋1 ${petMatDrop.emoji}${petMatDrop.name}` : petFragDrop ? `、＋1/2 ${petFragDrop.emoji}${petFragDrop.name}碎片` : "";
    const wishCopy = wishResult && wishResult.completed ? `、完成夥伴願望` : "";
    this.toast(`完成${result.module.name}：＋${coins} 幣${evidence ? `、＋${evidence} 證據` : ""}${materialCopy}${wishCopy}`);
    this.petReact("complete", wishResult && wishResult.completed ? wishResult.msg : petMatDrop ? `找到${petMatDrop.name}，一起帶回家！` : `完成${result.module.name}，辛苦了！`);
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
    // 支線成就掉落 2 個隨機進化材料
    const matIds = Object.keys(this.petMaterials);
    for (let i = 0; i < 2; i++) {
      const pick = matIds[Math.floor(Math.random() * matIds.length)];
      this.state.petMat[pick] = (this.state.petMat[pick] || 0) + 1;
    }
    this.checkUnlocks(); this.save();
    return reward;
  },
  checkUnlocks() {
    if (this.distinctModules().length >= 5 && this.state.evidence >= 8) {
      this.state.unlocks.grandCase = true;
    }
  },

  /* ---------- 偵探夥伴（電子寵物）系統 ---------- */

  petSpecies: {
    dog: {
      id:"dog", name:"線索犬", stages:["🥚","🐶","🐕","🦮"],
      personality:"熱情又愛探索，最喜歡追著線索球跑。", favorite:"petToy", starter:true
    },
    cat: {
      id:"cat", name:"推理貓", stages:["🥚","🐱","🐈","🐈‍⬛"],
      personality:"安靜但好奇，總愛窩在檔案旁觀察。", favorite:"petSnack", starter:true
    },
    rabbit: {
      id:"rabbit", name:"跳跳兔", stages:["🥚","🐰","🐇","🐇"],
      personality:"敏捷又親人，看到新房間就想四處跳。", favorite:"petFood", starter:true
    },
    hamster: {
      id:"hamster", name:"口袋鼠", stages:["🥚","🐹","🐹","🐹"],
      personality:"喜歡收集小東西，會把證物藏進臉頰。", favorite:"petSnack", starter:true
    },
    owl: {
      id:"owl", name:"檔案鴞", stages:["🥚","🐣","🐦","🦉"],
      personality:"夜裡最有精神，喜歡閱讀完整的證詞。", favorite:"petToy",
      unlock:{ type:"seal", module:"reading", count:2, text:"取得 2 枚讀題館證物" }
    },
    fox: {
      id:"fox", name:"墨燈狐", stages:["🥚","🦊","🦊","🦊"],
      personality:"聰明又神祕，尾巴會在發現新事物時亮起。", favorite:"petSnack",
      unlock:{ type:"modules", count:3, text:"探索 3 個不同館別" }
    },
    bear: {
      id:"bear", name:"守護熊", stages:["🥚","🐻","🐻","🐻"],
      personality:"穩重可靠，喜歡把房間整理得舒舒服服。", favorite:"petFood",
      unlock:{ type:"evidence", count:8, text:"蒐集 8 枚證據" }
    },
    penguin: {
      id:"penguin", name:"整理企鵝", stages:["🥚","🐧","🐧","🐧"],
      personality:"做事井然有序，尤其喜歡數字和分類。", favorite:"petToy",
      unlock:{ type:"seal", module:"math", count:2, text:"取得 2 枚數學館證物" }
    },
    dragon: {
      id:"dragon", name:"神祕幼龍", stages:["🥚","🐲","🐉","🐉"],
      personality:"只願意跟真正走遍偵探世界的人回家。", favorite:"petSnack",
      unlock:{ type:"grand", text:"完成七館聯合案件並探索全部館別" }
    }
  },
  petStageNames: ["偵探蛋","幼年期","少年期","成熟期"],

  petItems: {
    petFood:  { id:"petFood",  name:"偵探飼料",   emoji:"🍖", cost:6,  desc:"補充飽足；喜歡飼料的夥伴效果更好。" },
    petSnack: { id:"petSnack", name:"特調點心",   emoji:"🍮", cost:10, desc:"同時補充飽足與心情。" },
    petToy:   { id:"petToy",   name:"線索玩具",   emoji:"🧶", cost:8,  desc:"陪夥伴玩耍，提升心情。" },
    petMed:   { id:"petMed",   name:"活力飲",     emoji:"🧃", cost:15, desc:"精神低落時，將飽足與心情恢復至 65。" }
  },

  petCosmetics: {
    redCollar: { id:"redCollar", kind:"accessory", name:"紅色領巾", emoji:"🧣", cost:18 },
    bow:       { id:"bow",       kind:"accessory", name:"星星蝴蝶結", emoji:"🎀", cost:22 },
    glasses:   { id:"glasses",   kind:"accessory", name:"圓框眼鏡", emoji:"👓", cost:28 },
    hat:       { id:"hat",       kind:"accessory", name:"偵探帽", emoji:"🎩", cost:38 },
    crown:     { id:"crown",     kind:"accessory", name:"首席皇冠", emoji:"👑", cost:60 },
    garden:    { id:"garden",    kind:"room", name:"陽光庭院", emoji:"🌻", cost:35 },
    library:   { id:"library",   kind:"room", name:"祕密書房", emoji:"📚", cost:42 },
    camp:      { id:"camp",      kind:"room", name:"星空營地", emoji:"⛺", cost:48 },
    cloud:     { id:"cloud",     kind:"room", name:"雲端小屋", emoji:"☁️", cost:55 }
  },

  petMaterials: {
    summer:  { id:"summer",  name:"陽光碎片", emoji:"🌞" },
    chinese: { id:"chinese", name:"文字結晶", emoji:"🖋️" },
    math:    { id:"math",    name:"數字齒輪", emoji:"⚙️" },
    reading: { id:"reading", name:"證詞捲軸", emoji:"📜" },
    party:   { id:"party",   name:"合作徽記", emoji:"🤝" },
    battle:  { id:"battle",  name:"核心碎屑", emoji:"💎" },
    radical: { id:"radical", name:"字族書頁", emoji:"📖" }
  },

  petBondLevels: [
    { min:3,  id:"greet", name:"認得你的呼喚", desc:"點地面時會更快跑過來。" },
    { min:8,  id:"talent", name:"個性小動作", desc:"解鎖每種動物專屬的待機動作。" },
    { min:15, id:"cheer", name:"加油夥伴", desc:"答對與完成任務時會有特別慶祝。" },
    { min:25, id:"trust", name:"完全信任", desc:"解鎖稀有對話與閃亮親密光圈。" }
  ],

  petWishModules: {
    dog:"battle", cat:"reading", rabbit:"summer", hamster:"radical",
    owl:"reading", fox:"chinese", bear:"party", penguin:"math", dragon:"guild"
  },

  // 七館依 2＋2＋3 分散到三個階段；玩家可決定順序，但同館不重複計入。
  petEvolveRules: [
    { mat:2, kinds:2 },
    { mat:2, kinds:2 },
    { mat:3, kinds:3 }
  ],

  // 一週一次使用也不會受到重罰；狀態最低停在安全值，不會因離線生病或死亡。
  PET_HUNGER_RATE: 0.35,
  PET_MOOD_RATE: 0.28,
  PET_MAX_OFFLINE_HOURS: 24 * 14,

  petSpeciesStatus(speciesId) {
    const species = this.petSpecies[speciesId];
    if (!species) return { unlocked:false, reason:"找不到這種夥伴。" };
    if (species.starter || this.state.pets[speciesId]) return { unlocked:true, reason:"可以領養" };
    const rule = species.unlock || {};
    let unlocked = false;
    if (rule.type === "seal") unlocked = (this.state.moduleSeals[rule.module] || 0) >= rule.count;
    if (rule.type === "modules") unlocked = this.distinctModules().length >= rule.count;
    if (rule.type === "evidence") unlocked = this.state.evidence >= rule.count;
    if (rule.type === "grand") {
      unlocked = this.distinctModules().length >= 7 && !!this.state.casesCleared.grandCase;
    }
    return { unlocked, reason:unlocked ? "可以領養" : rule.text };
  },

  ownedPetIds() { return Object.keys(this.state.pets || {}); },

  adoptPet(speciesId, name) {
    const species = this.petSpecies[speciesId];
    if (!species) return { success:false, msg:"請先選擇一顆偵探蛋。" };
    const status = this.petSpeciesStatus(speciesId);
    if (!status.unlocked) return { success:false, msg:`還不能領養：${status.reason}。` };
    if (this.state.pets[speciesId]) {
      this.switchPet(speciesId);
      return { success:true, switched:true, msg:`已切換成「${this.state.pet.name}」。` };
    }
    const clean = String(name || "").trim().slice(0, 10) || species.name;
    const pet = {
      species:speciesId, name:clean, stage:0,
      hunger:80, mood:80, sick:false, zeroHours:0,
      care:0, bond:0, careDay:"", petsToday:0,
      growthModules:[],
      accessory:"none", room:"study",
      lastTick:new Date().toISOString(), adoptedAt:new Date().toISOString()
    };
    this.state.pets[speciesId] = pet;
    this.state.activePetId = speciesId;
    this.state.pet = pet;
    this.save();
    return { success:true, msg:`${species.stages[0]} 偵探蛋「${clean}」已加入偵探社！先自由選擇兩館取得材料，就能孵化。` };
  },

  switchPet(speciesId) {
    if (!this.state.pets[speciesId]) return { success:false, msg:"這位夥伴還沒有加入收藏。" };
    this.state.activePetId = speciesId;
    this.state.pet = this.state.pets[speciesId];
    this.petTick();
    this.save();
    return { success:true, msg:`現在由「${this.state.pet.name}」陪你。` };
  },

  petTick() {
    const pet = this.state.pet;
    if (!pet) return null;
    const now = Date.now();
    const last = Date.parse(pet.lastTick) || now;
    let hours = Math.max(0, (now - last) / 3600000);
    hours = Math.min(hours, this.PET_MAX_OFFLINE_HOURS);
    if (pet.stage > 0 && hours > 0) {
      pet.hunger = Math.max(15, pet.hunger - hours * this.PET_HUNGER_RATE);
      pet.mood = Math.max(20, pet.mood - hours * this.PET_MOOD_RATE);
      pet.zeroHours = 0;
    }
    pet.lastTick = new Date(now).toISOString();
    const day = this.localDateKey();
    if (pet.careDay !== day) { pet.careDay = day; pet.petsToday = 0; }
    this.save();
    return pet;
  },

  petCareOnce(pet) {
    const before = pet.bond || 0;
    pet.care += 1;
    pet.bond = before + 1;
    return this.petBondLevels.filter(level => before < level.min && pet.bond >= level.min);
  },

  petUse(itemId) {
    const pet = this.petTick();
    if (!pet) return { success:false, msg:"還沒有偵探夥伴。" };
    const item = this.petItems[itemId];
    if (!item) return { success:false, msg:"找不到這項用品。" };
    if ((this.state.inventory[itemId] || 0) < 1) return { success:false, msg:`背包裡沒有「${item.name}」，可以到下方補給站購買。` };
    if (itemId === "petFood" && pet.hunger >= 95) return { success:false, msg:`${pet.name} 已經吃得很飽了，晚點再餵吧。` };
    if (itemId === "petToy" && pet.mood >= 95) return { success:false, msg:`${pet.name} 現在心情超好，晚點再玩吧。` };
    if (itemId === "petMed" && !pet.sick && pet.hunger >= 65 && pet.mood >= 65) {
      return { success:false, msg:`${pet.name} 現在很有精神，不需要活力飲。` };
    }
    this.state.inventory[itemId] -= 1;
    let msg = "";
    const species = this.petSpecies[pet.species];
    const favoriteBonus = species.favorite === itemId ? 10 : 0;
    if (itemId === "petFood")  { pet.hunger = Math.min(100, pet.hunger + 35 + favoriteBonus); msg = `${pet.name} 吃得津津有味！`; }
    if (itemId === "petSnack") { pet.hunger = Math.min(100, pet.hunger + 18 + favoriteBonus); pet.mood = Math.min(100, pet.mood + 12 + favoriteBonus); msg = `${pet.name} 開心地舔舔嘴巴。`; }
    if (itemId === "petToy")   { pet.mood = Math.min(100, pet.mood + 30 + favoriteBonus); msg = `${pet.name} 玩得不亦樂乎！`; }
    if (itemId === "petMed")   {
      pet.sick = false; pet.zeroHours = 0;
      pet.hunger = Math.max(pet.hunger, 65); pet.mood = Math.max(pet.mood, 65);
      msg = `${pet.name} 喝完活力飲，重新有精神了！`;
    }
    const unlocked = this.petCareOnce(pet);
    if (unlocked.length) msg += ` 解鎖「${unlocked.map(item => item.name).join("、")}」！`;
    this.save();
    return { success:true, msg, unlocked };
  },

  petPat() {
    const pet = this.petTick();
    if (!pet) return { success:false, msg:"還沒有偵探夥伴。" };
    if (pet.sick) return { success:false, msg:`${pet.name} 看起來沒精神，先給牠一瓶活力飲。` };
    if (pet.petsToday >= 5) return { success:false, msg:`${pet.name} 今天被摸得很滿足了，明天再來吧。` };
    pet.petsToday += 1;
    pet.mood = Math.min(100, pet.mood + 8);
    const unlocked = this.petCareOnce(pet);
    let msg = pet.stage === 0 ? "蛋殼微微發亮，好像感受到你的溫度。" : `${pet.name} 瞇起眼睛蹭蹭你。`;
    if (unlocked.length) msg += ` 解鎖「${unlocked.map(item => item.name).join("、")}」！`;
    this.save();
    return { success:true, msg, unlocked };
  },

  buyPetItem(itemId) {
    const item = this.petItems[itemId];
    if (!item) return { success:false, msg:"找不到這項用品。" };
    if (this.state.coins < item.cost) return { success:false, msg:`偵探幣不足，還差 ${item.cost - this.state.coins} 枚。` };
    this.state.coins -= item.cost;
    this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
    this.save();
    return { success:true, msg:`已購買「${item.name}」。` };
  },

  buyPetCosmetic(itemId) {
    const item = this.petCosmetics[itemId];
    if (!item) return { success:false, msg:"找不到這項布置。" };
    const owned = item.kind === "room" ? this.state.petRooms : this.state.petCloset;
    if (owned[itemId]) return { success:false, msg:`已經擁有「${item.name}」。` };
    if (this.state.coins < item.cost) return { success:false, msg:`偵探幣不足，還差 ${item.cost - this.state.coins} 枚。` };
    this.state.coins -= item.cost;
    owned[itemId] = true;
    this.save();
    return { success:true, msg:`「${item.name}」已加入收藏！` };
  },

  equipPetCosmetic(itemId) {
    const pet = this.state.pet;
    if (!pet) return { success:false, msg:"還沒有偵探夥伴。" };
    if (itemId === "none") { pet.accessory = "none"; this.save(); return { success:true, msg:"已收起配件。" }; }
    if (itemId === "study") { pet.room = "study"; this.save(); return { success:true, msg:"已回到偵探書房。" }; }
    const item = this.petCosmetics[itemId];
    if (!item) return { success:false, msg:"找不到這項布置。" };
    const owned = item.kind === "room" ? this.state.petRooms : this.state.petCloset;
    if (!owned[itemId]) return { success:false, msg:"還沒有取得這項布置。" };
    if (item.kind === "room") pet.room = itemId;
    else pet.accessory = itemId;
    this.save();
    return { success:true, msg:`已換上「${item.name}」。` };
  },

  petMatSummary() {
    const entries = Object.entries(this.state.petMat).filter(([, n]) => n > 0);
    return {
      total: entries.reduce((sum, [, n]) => sum + n, 0),
      kinds: entries.length,
      entries
    };
  },

  petBondStatus(pet) {
    const target = pet || this.state.pet;
    const bond = target ? Number(target.bond || 0) : 0;
    const unlocked = this.petBondLevels.filter(level => bond >= level.min);
    const next = this.petBondLevels.find(level => bond < level.min) || null;
    return { bond, unlocked, next };
  },

  ensurePetWish() {
    const pet = this.state.pet;
    if (!pet || pet.stage === 0) return null;
    const day = this.localDateKey();
    const wishKey = `${day}:${pet.species}`;
    if (this.state.petWishes[wishKey]) {
      this.state.petWishDay = day;
      this.state.petWish = this.state.petWishes[wishKey];
      return this.state.petWish;
    }
    const seed = (day + pet.species).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const preferred = this.petWishModules[pet.species];
    const fallback = Object.keys(this.modules)[seed % Object.keys(this.modules).length];
    const moduleId = this.modules[preferred] ? preferred : fallback;
    const accuracyWish = seed % 3 === 1;
    this.state.petWishDay = day;
    this.state.petWish = {
      day, species:pet.species, type:accuracyWish ? "accuracy" : "module",
      moduleId:accuracyWish ? "" : moduleId, goal:1, progress:0, done:false,
      label:accuracyWish ? "完成任一館，正確率達 70%" : `前往${this.modules[moduleId].name}完成一次任務，正確率達 60%`
    };
    this.state.petWishes[wishKey] = this.state.petWish;
    Object.keys(this.state.petWishes).filter(key => !key.startsWith(day + ":")).forEach(key => delete this.state.petWishes[key]);
    return this.state.petWish;
  },

  petWishStatus() {
    const wish = this.ensurePetWish();
    if (!wish) return null;
    return Object.assign({}, wish, {
      reward:`親密度＋2、${(this.petItems[(this.petSpecies[wish.species] || {}).favorite] || {}).name || "夥伴用品"} ×1`
    });
  },

  updatePetWish(moduleId, accuracy) {
    const pet = this.state.pet;
    const wish = this.ensurePetWish();
    if (!pet || !wish || wish.done) return { completed:false };
    const matched = wish.type === "accuracy" ? accuracy >= 70 : wish.moduleId === moduleId && accuracy >= 60;
    if (!matched) return { completed:false };
    wish.progress = 1;
    wish.done = true;
    const before = pet.bond || 0;
    pet.bond = before + 2;
    const favorite = (this.petSpecies[pet.species] || {}).favorite || "petFood";
    this.state.inventory[favorite] = (this.state.inventory[favorite] || 0) + 1;
    const unlocks = this.petBondLevels.filter(level => before < level.min && pet.bond >= level.min);
    const item = this.petItems[favorite];
    const extra = unlocks.length ? `，並解鎖「${unlocks.map(level => level.name).join("、")}」` : "";
    return { completed:true, msg:`${pet.name}的今日小願望完成！親密度＋2，取得${item.emoji}${item.name}${extra}。`, unlocks };
  },

  rotatingCosmetics(date) {
    const all = Object.values(this.petCosmetics);
    const accessories = all.filter(item => item.kind === "accessory");
    const rooms = all.filter(item => item.kind === "room");
    const d = date || new Date();
    const week = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 604800000);
    const rotate = (items, count, offset) => Array.from({ length:Math.min(count, items.length) }, (_, index) => items[(week + offset + index) % items.length]);
    return { accessories:rotate(accessories, 3, 0), rooms:rotate(rooms, 2, 2), week };
  },

  petRouteFor(pet, stage) {
    if (!pet) return [];
    const used = new Set(Array.isArray(pet.growthModules) ? pet.growthModules : []);
    return Object.keys(this.modules).filter(id => !used.has(id));
  },

  petRouteNames(route) {
    return route.map(id => `${(this.modules[id] || {}).icon || "🏛️"}${(this.modules[id] || {}).name || id}`);
  },

  petEvolveCheck(selectedModules) {
    const pet = this.state.pet;
    if (!pet) return { ready:false, msg:"還沒有偵探夥伴。" };
    if (pet.stage >= 3) return { ready:false, done:true, msg:"已經是成熟期的名偵探夥伴了。" };
    const rule = this.petEvolveRules[pet.stage];
    const route = this.petRouteFor(pet);
    const available = route.filter(id => (this.state.petMat[id] || 0) >= 1);
    const selected = [...new Set(Array.isArray(selectedModules) ? selectedModules : [])]
      .filter(id => route.includes(id) && (this.state.petMat[id] || 0) >= 1);
    const lacks = [];
    if (available.length < rule.kinds) lacks.push(`尚需 ${rule.kinds - available.length} 個未使用過的館別材料`);
    else if (selected.length !== rule.kinds) lacks.push(`請親自選擇 ${rule.kinds} 個館別材料（目前選了 ${selected.length} 個）`);
    if (pet.sick) lacks.push("需要先治好生病");
    if (pet.hunger < 40 || pet.mood < 40) lacks.push("飽足與心情需達 40 以上");
    const action = pet.stage === 0 ? "孵化" : "進化";
    return lacks.length
      ? { ready:false, rule:Object.assign({}, rule, { modules:selected, eligible:route, available }), msg:`本階段可從尚未使用的館別自選 ${rule.kinds} 館。${lacks.join("、")}` }
      : { ready:true, rule:Object.assign({}, rule, { modules:selected, eligible:route }), msg:`已取得 ${this.petRouteNames(selected).join("、")} 的材料，可以${action}！` };
  },

  petEvolve(selectedModules) {
    const pet = this.petTick();
    const check = this.petEvolveCheck(selectedModules);
    if (!check.ready) return { success:false, msg:check.msg };
    // 扣除本階段自選館別各 1 個，並記錄為已使用；後續階段改練其他館。
    check.rule.modules.forEach(id => {
      this.state.petMat[id] -= 1;
      if (!this.state.petMat[id]) delete this.state.petMat[id];
      if (!pet.growthModules.includes(id)) pet.growthModules.push(id);
    });
    pet.stage += 1;
    pet.hunger = 100; pet.mood = 100;
    this.save();
    const species = this.petSpecies[pet.species];
    const verb = pet.stage === 1 ? "孵化成" : "進化為";
    return { success:true, msg:`${pet.name} ${verb}${this.petStageNames[pet.stage]}的${species.name} ${species.stages[pet.stage]}！` };
  },

  petStatus() {
    const pet = this.petTick();
    if (!pet) return null;
    const species = this.petSpecies[pet.species];
    return {
      pet, species,
      emoji: species.stages[pet.stage],
      stageName: this.petStageNames[pet.stage],
      hunger: Math.round(pet.hunger),
      mood: Math.round(pet.mood),
      sick: pet.sick,
      evolve: this.petEvolveCheck(),
      accessory:pet.accessory || "none",
      room:pet.room || "study",
      bond:pet.bond || 0,
      bondStatus:this.petBondStatus(pet),
      wish:this.petWishStatus(),
      ownedCount:this.ownedPetIds().length
    };
  },

  exportActive() {
    return JSON.stringify({ type:"yl-detective-profile", version:3, profile:this.state }, null, 2);
  },
  downloadActive() {
    const blob = new Blob([this.exportActive()], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `偵探檔案_${this.state.name}_${this.localDateKey()}.json`;
    link.click(); URL.revokeObjectURL(url);
  },
  importProfile(text) {
    let data;
    try { data = typeof text === "string" ? JSON.parse(text) : text; } catch (e) {
      return { success:false, msg:"檔案格式無法讀取。" };
    }
    const raw = (data && data.profile) || data;
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

  assetBase() {
    if (this._assetBase) return this._assetBase;
    if (typeof document === "undefined" || typeof location === "undefined") return "";
    const script = [...document.scripts].find(item => /detective-system\.js(?:\?|$)/.test(item.src));
    this._assetBase = script ? new URL("./", script.src).href : new URL("./", location.href).href;
    return this._assetBase;
  },
  petImageUrl(speciesId) {
    return `${this.assetBase()}assets/pets/${speciesId || "dog"}.png`;
  },

  setCompanionVisible(visible) {
    this.state.companionVisible = visible !== false;
    this.save();
    return this.state.companionVisible;
  },

  toggleCompanionVisible() {
    return this.setCompanionVisible(!this.state.companionVisible);
  },

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
  autoMountCompanion() {
    if (typeof document === "undefined") return;
    const run = () => {
      this.mountCompanion();
      this.observeAnswerFeedback();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
  },
  mountCompanion() {
    if (!document.body || document.getElementById("ds-companion-zone")) {
      this.refreshCompanion();
      return;
    }
    const style = document.createElement("style");
    style.id = "ds-companion-style";
    style.textContent = `
      #ds-companion-zone{position:fixed;z-index:970;left:0;right:0;bottom:46px;height:105px;
        overflow:visible;pointer-events:none;contain:layout style}
      #ds-companion{--face:1;position:absolute;left:18px;bottom:0;width:78px;height:94px;
        border:0;padding:0;background:transparent;pointer-events:auto;cursor:pointer;user-select:none;touch-action:manipulation;
        transition:left 3s linear;filter:drop-shadow(0 5px 5px #17232d38)}
      #ds-companion-visual{display:block;width:100%;height:100%}
      #ds-companion[data-stage="1"] #ds-companion-visual{transform:scale(.84);transform-origin:center bottom}
      #ds-companion[data-stage="2"] #ds-companion-visual{transform:scale(1);transform-origin:center bottom}
      #ds-companion[data-stage="3"] #ds-companion-visual{transform:scale(1.1);transform-origin:center bottom;filter:drop-shadow(0 0 6px #ffd65c)}
      #ds-companion[data-bond="trust"] #ds-companion-visual{filter:drop-shadow(0 0 8px #ffd65c) drop-shadow(0 0 4px #fff)}
      #ds-companion img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:pixelated;
        transform:scaleX(var(--face));transform-origin:center bottom}
      #ds-companion .ds-pet-egg{display:grid;place-items:center;width:100%;height:100%;font-size:54px}
      #ds-companion-bubble{position:absolute;left:50%;bottom:88px;translate:-50% 0;min-width:88px;
        max-width:180px;padding:7px 9px;border:2px solid #263c4b;border-radius:12px;background:#fffdf4;
        color:#263c4b;text-align:center;font:800 12px/1.35 "Microsoft JhengHei",sans-serif;
        box-shadow:0 4px 10px #0002;opacity:0;transform:translateY(5px);transition:.18s;
        pointer-events:none;white-space:nowrap}
      #ds-companion-bubble.show{opacity:1;transform:translateY(0)}
      #ds-companion-toy{position:absolute;left:14px;bottom:2px;width:34px;height:34px;border:2px solid #385366;
        border-radius:50%;background:#fff9dc;padding:0;display:grid;place-items:center;font-size:19px;
        pointer-events:auto;cursor:grab;touch-action:none;box-shadow:0 3px 8px #0002;transition:transform .15s}
      #ds-companion-toy:active{cursor:grabbing;transform:scale(1.12)}
      #ds-companion.walk img{animation:ds-pet-walk .38s steps(2,end) infinite}
      #ds-companion.idle img{animation:ds-pet-idle 1.8s ease-in-out infinite}
      #ds-companion.sleep img{animation:ds-pet-sleep 2.4s ease-in-out infinite;filter:saturate(.75)}
      #ds-companion.excited img{animation:ds-pet-jump .48s ease-in-out 2}
      #ds-companion.comfort img{animation:ds-pet-comfort .65s ease-in-out 2}
      #ds-companion.quirk-hop #ds-companion-visual{animation:ds-pet-quirk-hop .72s ease-in-out 2}
      #ds-companion.quirk-spin #ds-companion-visual{animation:ds-pet-quirk-spin .9s ease-in-out}
      #ds-companion.quirk-peek #ds-companion-visual{animation:ds-pet-quirk-peek 1.1s ease-in-out}
      @keyframes ds-pet-walk{50%{transform:scaleX(var(--face)) translateY(-4px) rotate(-1deg)}}
      @keyframes ds-pet-idle{50%{transform:scaleX(var(--face)) translateY(-2px)}}
      @keyframes ds-pet-sleep{50%{transform:scaleX(var(--face)) translateY(2px) scale(.98)}}
      @keyframes ds-pet-jump{45%{transform:scaleX(var(--face)) translateY(-20px) rotate(4deg)}}
      @keyframes ds-pet-comfort{35%{transform:scaleX(var(--face)) rotate(-5deg)}70%{transform:scaleX(var(--face)) rotate(5deg)}}
      @keyframes ds-pet-quirk-hop{45%{translate:0 -15px}70%{translate:0 0}}
      @keyframes ds-pet-quirk-spin{50%{rotate:12deg;scale:1.08}100%{rotate:0deg;scale:1}}
      @keyframes ds-pet-quirk-peek{35%{translate:10px 0;rotate:5deg}70%{translate:-7px 0;rotate:-4deg}}
      @media(max-width:600px){
        #ds-companion-zone{bottom:48px;height:82px}
        #ds-companion{width:62px;height:76px}
        #ds-companion-bubble{bottom:70px;font-size:11px;max-width:145px}
        #ds-companion-toy{width:30px;height:30px;font-size:16px}
      }
      @media(prefers-reduced-motion:reduce){
        #ds-companion{transition:none!important}
        #ds-companion img{animation:none!important}
      }
    `;
    document.head.appendChild(style);
    const zone = document.createElement("div");
    zone.id = "ds-companion-zone";
    zone.setAttribute("aria-live", "polite");
    zone.innerHTML = `<button id="ds-companion" type="button" aria-label="和偵探夥伴互動">
      <span id="ds-companion-visual"></span><span id="ds-companion-bubble"></span></button>
      <button id="ds-companion-toy" type="button" aria-label="拖曳線索球讓夥伴追逐">🧶</button>`;
    document.body.appendChild(zone);
    const pet = document.getElementById("ds-companion");
    pet.addEventListener("click", () => {
      const result = this.petPat();
      this.petReact(result.success ? "pat" : "idle", result.msg);
    });
    this.bindCompanionInteractions();
    this.refreshCompanion();
    this.scheduleCompanion();
  },
  bindCompanionInteractions() {
    if (this._companionInteractionsBound) return;
    this._companionInteractionsBound = true;
    const toy = document.getElementById("ds-companion-toy");
    if (toy) {
      let dragging = false;
      const moveToy = event => {
        if (!dragging) return;
        const max = Math.max(12, window.innerWidth - toy.offsetWidth - 12);
        toy.style.left = `${Math.max(12, Math.min(max, event.clientX - toy.offsetWidth / 2))}px`;
      };
      toy.addEventListener("pointerdown", event => {
        dragging = true;
        toy.setPointerCapture(event.pointerId);
        moveToy(event);
      });
      toy.addEventListener("pointermove", moveToy);
      toy.addEventListener("pointerup", event => {
        if (!dragging) return;
        dragging = false;
        toy.releasePointerCapture(event.pointerId);
        this.companionMoveTo(event.clientX, "抓到線索球了！");
      });
    }
    document.addEventListener("click", event => {
      if (event.clientY < window.innerHeight - 170) return;
      if (event.target.closest("button,a,input,textarea,select,label,#ds-companion-zone")) return;
      this.companionMoveTo(event.clientX, "你在叫我嗎？");
    });
  },
  companionMoveTo(clientX, message) {
    const pet = document.getElementById("ds-companion");
    if (!pet) return;
    clearTimeout(this._companionTimer);
    clearTimeout(this._companionMoveTimer);
    const max = Math.max(18, window.innerWidth - pet.offsetWidth - 18);
    const current = parseFloat(pet.style.left) || 18;
    const target = Math.max(18, Math.min(max, clientX - pet.offsetWidth / 2));
    const species = this.state && this.state.pet && this.state.pet.species;
    const baseSpeed = ({ dog:1.18, cat:.9, rabbit:1.3, hamster:.78, owl:.85, fox:1.12, bear:.7, penguin:.82, dragon:1.02 })[species] || 1;
    const speed = baseSpeed * ((this.state.pet.bond || 0) >= 3 ? 1.2 : 1);
    const duration = Math.min(4.8, Math.max(.75, Math.abs(target - current) / (95 * speed)));
    pet.className = "walk";
    pet.style.setProperty("--face", target < current ? "-1" : "1");
    pet.style.transitionDuration = `${duration}s`;
    pet.style.left = `${target}px`;
    this._companionMoveTimer = setTimeout(() => this.petReact("correct", message || "我來了！"), duration * 1000 + 80);
  },
  refreshCompanion() {
    if (typeof document === "undefined") return;
    const zone = document.getElementById("ds-companion-zone");
    const visual = document.getElementById("ds-companion-visual");
    if (!zone || !visual) return;
    const pet = this.state && this.state.pet;
    const inPetRoom = typeof location !== "undefined" && /\/pet\/(?:index\.html)?$/.test(location.pathname);
    zone.style.display = pet && !inPetRoom && this.state.companionVisible !== false ? "" : "none";
    if (!pet) return;
    const visualKey = `${pet.species}:${pet.stage === 0 ? "egg" : "pet"}`;
    if (visual.dataset.key !== visualKey) {
      visual.dataset.key = visualKey;
      visual.innerHTML = pet.stage === 0
        ? `<span class="ds-pet-egg">🥚</span>`
        : `<img src="${this.petImageUrl(pet.species)}" alt="${String(pet.name || "偵探夥伴").replace(/"/g, "&quot;")}">`;
    }
    const button = document.getElementById("ds-companion");
    if (button) {
      button.setAttribute("aria-label", `和${pet.name}互動`);
      button.dataset.stage = String(pet.stage || 0);
      button.dataset.species = pet.species;
      button.dataset.bond = (pet.bond || 0) >= 25 ? "trust" : "normal";
    }
    const toy = document.getElementById("ds-companion-toy");
    if (toy) toy.style.display = pet.stage > 0 ? "" : "none";
  },
  scheduleCompanion(delay) {
    if (typeof window === "undefined") return;
    clearTimeout(this._companionTimer);
    this._companionTimer = setTimeout(() => {
      const pet = document.getElementById("ds-companion");
      const zone = document.getElementById("ds-companion-zone");
      if (!pet || !zone || zone.style.display === "none") {
        this.scheduleCompanion(2500);
        return;
      }
      const roll = Math.random();
      const status = this.petStatus();
      if (status && status.pet.stage > 0 && roll < .18 && status.hunger < 38) {
        this.petReact("idle", "肚子有點餓，回房間看看食盆吧。");
        return;
      }
      if (status && status.pet.stage > 0 && roll < .18 && status.mood < 38) {
        this.petReact("idle", "我想玩一下線索球！");
        return;
      }
      if (status && status.pet.stage > 0 && status.bond >= 8 && roll > .82) {
        const moments = {
          dog:["quirk-hop","聞到新線索了！"], cat:["quirk-peek","我先觀察一下。"],
          rabbit:["quirk-hop","跳去看看！"], hamster:["quirk-spin","把小線索收好。"],
          owl:["quirk-peek","讓我仔細讀讀。"], fox:["quirk-spin","尾巴亮起來了！"],
          bear:["quirk-peek","慢慢來，我陪你。"], penguin:["quirk-spin","排整齊就清楚了。"],
          dragon:["quirk-hop","這條線索很有意思！"]
        };
        const moment = moments[status.pet.species] || ["quirk-hop","一起找線索！"];
        this.petReact("idle", moment[1]);
        pet.className = moment[0];
        return;
      }
      pet.className = roll < .58 ? "walk" : roll < .82 ? "idle" : "sleep";
      if (roll < .58) {
        const max = Math.max(18, window.innerWidth - pet.offsetWidth - 18);
        const current = parseFloat(pet.style.left) || 18;
        const target = 18 + Math.random() * Math.max(1, max - 18);
        const species = this.state && this.state.pet && this.state.pet.species;
        const speed = ({ dog:1.18, cat:.9, rabbit:1.3, hamster:.78, owl:.85, fox:1.12, bear:.7, penguin:.82, dragon:1.02 })[species] || 1;
        const duration = Math.min(5.5, Math.max(1.5, Math.abs(target - current) / (65 * speed)));
        pet.style.setProperty("--face", target < current ? "-1" : "1");
        pet.style.transitionDuration = `${duration}s`;
        pet.style.left = `${target}px`;
        this.scheduleCompanion(duration * 1000 + 700);
      } else {
        this.scheduleCompanion(1800 + Math.random() * 2600);
      }
    }, delay == null ? 1200 + Math.random() * 1600 : delay);
  },
  petReact(type, message) {
    if (typeof document === "undefined") return;
    const pet = document.getElementById("ds-companion");
    const bubble = document.getElementById("ds-companion-bubble");
    if (!pet || !bubble) return;
    clearTimeout(this._companionTimer);
    clearTimeout(this._companionReactTimer);
    const copy = {
      correct:"答對了！一起追下一條線索！",
      wrong:"沒關係，我陪你再看一次。",
      complete:"帶著新材料回家囉！",
      pat:"我有感覺到你摸摸我！",
      idle:"我在這裡陪你。"
    };
    const closeBond = this.state && this.state.pet ? Number(this.state.pet.bond || 0) : 0;
    pet.className = type === "correct" || type === "complete" ? (closeBond >= 15 ? "excited quirk-hop" : "excited") :
      type === "wrong" ? "comfort" : "idle";
    bubble.textContent = message || copy[type] || copy.idle;
    bubble.classList.add("show");
    this._companionReactTimer = setTimeout(() => {
      bubble.classList.remove("show");
      this.scheduleCompanion(500);
    }, type === "wrong" ? 2100 : 1600);
  },
  observeAnswerFeedback() {
    if (typeof MutationObserver === "undefined" || this._answerObserver || !document.body) return;
    const inspect = node => {
      if (!(node instanceof Element)) return;
      const nodes = [node, ...node.querySelectorAll(
        '[class*="feedback"].good,[class*="feedback"].bad,.s-fb.good,.s-fb.bad,.b-fb.good,.b-fb.bad'
      )];
      const hit = nodes.find(item =>
        item.matches('[class*="feedback"].good,[class*="feedback"].bad,.s-fb.good,.s-fb.bad,.b-fb.good,.b-fb.bad')
      );
      if (!hit || hit.classList.contains("hidden")) return;
      const now = Date.now();
      if (now - (this._lastAnswerReaction || 0) < 450) return;
      this._lastAnswerReaction = now;
      this.petReact(hit.classList.contains("good") ? "correct" : "wrong");
    };
    this._answerObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") inspect(mutation.target);
        mutation.addedNodes.forEach(inspect);
      });
    });
    this._answerObserver.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:["class"] });
    window.addEventListener("detective:answer", event => this.petReact(event.detail && event.detail.correct ? "correct" : "wrong"));
  },
  mountDock(moduleId) {
    const style = document.createElement("style");
    style.textContent = `
      #ds-world-dock{position:fixed;z-index:999;right:12px;bottom:12px;display:flex;gap:7px;
        align-items:center;padding:8px 10px;border-radius:999px;background:#17232d;color:#fff;
        box-shadow:0 4px 18px #0004;font:600 12px/1.2 "Microsoft JhengHei",sans-serif}
      #ds-world-dock a{color:#ffd36b;text-decoration:none}#ds-world-dock .ds-p{max-width:110px;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #ds-world-dock .ds-focus{border:0;border-radius:999px;background:#ffffff18;color:#fff;padding:3px 7px;
        font:700 11px "Microsoft JhengHei",sans-serif;cursor:pointer}
      #ds-toast{position:fixed;z-index:1001;left:50%;bottom:70px;transform:translateX(-50%);
        background:#17232d;color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 5px 20px #0004;
        font:700 14px "Microsoft JhengHei",sans-serif;transition:.2s}
      @media(max-width:520px){#ds-world-dock .ds-rank{display:none}}
    `;
    document.head.appendChild(style);
    const dock = document.createElement("div"); dock.id = "ds-world-dock";
    dock.innerHTML = `<span class="ds-p"></span><span class="ds-rank"></span><span class="ds-coins"></span><span class="ds-evidence"></span><button class="ds-focus" type="button"></button><a href="../index.html">大廳</a>`;
    document.body.appendChild(dock);
    dock.querySelector(".ds-focus").addEventListener("click", () => {
      const visible = this.toggleCompanionVisible();
      this.toast(visible ? "🐾 夥伴重新回到畫面。" : "已開啟上課專注模式；再按一次即可顯示夥伴。");
    });
    this.refreshDock();
  },
  refreshDock() {
    if (typeof document === "undefined") return;
    const dock = document.getElementById("ds-world-dock"); if (!dock || !this.state) return;
    dock.querySelector(".ds-p").textContent = this.state.type === "team" ? `👥 ${this.state.name}` : `🕵️ ${this.state.name}`;
    dock.querySelector(".ds-rank").textContent = this.rankFor().name;
    dock.querySelector(".ds-coins").textContent = `🪙${this.state.coins}`;
    dock.querySelector(".ds-evidence").textContent = `🔹${this.state.evidence}`;
    const focus = dock.querySelector(".ds-focus");
    if (focus) {
      focus.textContent = this.state.companionVisible === false ? "🐾 顯示" : "◌ 專注";
      focus.setAttribute("aria-label", this.state.companionVisible === false ? "顯示偵探夥伴" : "開啟上課專注模式");
    }
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
