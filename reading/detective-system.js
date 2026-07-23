/**
 * 讀題偵探社・偵探系統核心
 * 負責：偵探幣、道具商店、信心押注計算、陷阱怪對照與圖鑑、復仇任務、每日事件。
 * 純邏輯模組，不碰 DOM，資料存於 localStorage。
 */
const DetectiveSystem = {
  KEY: "daohue_detective_state",

  state: {
    coins: 0,
    inventory: { magnifier: 0, calmCard: 0, detectiveNote: 0 },
    trapStats: {},   // 陷阱怪累積遭遇次數 { monsterId: n }
    avenged: {},     // 已完成復仇的陷阱怪 { monsterId: true }
    titles: []       // 已獲得的稱號
  },

  /* ---------- 陷阱怪圖鑑 ---------- */
  trapMonsters: {
    question_thief:   { id: "question_thief",   name: "問句小偷",   emoji: "🕵️", desc: "專門偷走最後一句問題，讓你算出正確數字卻答錯題。" },
    among_beast:      { id: "among_beast",      name: "其中怪",     emoji: "🌀", desc: "把「其中」偽裝成「另外」，讓你把範圍算錯。" },
    remainder_ghost:  { id: "remainder_ghost",  name: "剩下幽靈",   emoji: "👻", desc: "讓你把用掉的數量看成剩下的數量，或忘了倒著推回去。" },
    comparison_ninja: { id: "comparison_ninja", name: "比較忍者",   emoji: "🥷", desc: "偷偷把「誰比誰多」的方向顛倒過來。" },
    distractor_slime: { id: "distractor_slime", name: "干擾史萊姆", emoji: "🟢", desc: "把用不到的數字黏進算式裡干擾你。" },
    unit_imp:         { id: "unit_imp",         name: "換算小妖",   emoji: "📏", desc: "在公分、公尺、分、時之間偷換單位。" },
    step_snail:       { id: "step_snail",       name: "漏步蝸牛",   emoji: "🐌", desc: "讓你算完第一步就停下，忘了題目還有第二步。" },
    bound_golem:      { id: "bound_golem",      name: "至少最多獸", emoji: "🗿", desc: "在「至少」「最多」上動手腳，讓你少算或多算一份。" },
    unknown_fog:      { id: "unknown_fog",      name: "迷霧干擾怪", emoji: "🌫️", desc: "還沒歸檔的審題干擾，先記下來再觀察。" }
  },

  // 題庫的中文 trap 標籤 → 陷阱怪。未列出者歸「迷霧干擾怪」。
  trapMap: {
    "問句忽略": "question_thief", "問句": "question_thief",
    "其中條件": "among_beast", "條件對應": "among_beast", "條件整合": "among_beast",
    "多條件整合": "among_beast", "分數條件": "among_beast", "優惠條件": "among_beast",
    "剩下概念": "remainder_ghost", "剩下的幾分之幾": "remainder_ghost", "數量變少": "remainder_ghost",
    "餘數處理": "remainder_ghost", "倒推順序": "remainder_ghost",
    "比較對象": "comparison_ninja", "比較方向": "comparison_ninja", "連續比較": "comparison_ninja",
    "差距問題": "comparison_ninja", "比較後合計": "comparison_ninja", "差距與周長": "comparison_ninja",
    "干擾資訊": "distractor_slime", "無關資訊": "distractor_slime", "單位干擾": "distractor_slime",
    "單位換算": "unit_imp", "時間進位": "unit_imp", "時間差": "unit_imp", "比例換算": "unit_imp",
    "步驟遺漏": "step_snail", "平均分": "step_snail", "每份數量": "step_snail", "每盒幾個": "step_snail",
    "每組幾個": "step_snail", "每排概念": "step_snail", "公式混淆": "step_snail", "估算要求": "step_snail",
    "至少陷阱": "bound_golem", "至少最多": "bound_golem", "最多限制": "bound_golem", "數量變多": "bound_golem"
  },

  /* ---------- 商店道具 ---------- */
  items: {
    magnifier:     { id: "magnifier",     name: "放大鏡",   emoji: "🔍", cost: 15, desc: "隨機排除一個錯誤選項" },
    calmCard:      { id: "calmCard",      name: "冷靜卡",   emoji: "🛡️", cost: 20, desc: "本題答錯不扣偵探幣" },
    detectiveNote: { id: "detectiveNote", name: "偵探筆記", emoji: "📜", cost: 10, desc: "提前揭露本題的陷阱怪種類" }
  },

  /* ---------- 每日事件 ---------- */
  events: {
    normal:   { id: "normal",   name: "平靜的一天", desc: "一切照常，專心審題。", coinMul: 1, shopMul: 1 },
    fog:      { id: "fog",      name: "霧夜調查",   desc: "陷阱難辨，但偵探幣加倍！", coinMul: 2, shopMul: 1 },
    discount: { id: "discount", name: "道具折扣日", desc: "商店所有道具半價。",     coinMul: 1, shopMul: 0.5 }
  },
  todayEvent() {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return this.events[["normal", "fog", "discount"][seed % 3]];
  },
  priceOf(itemId) {
    const it = this.items[itemId];
    return it ? Math.ceil(it.cost * this.todayEvent().shopMul) : 0;
  },

  /* ---------- 存讀檔 ---------- */
  init() {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved) {
        const p = JSON.parse(saved);
        this.state = Object.assign({}, this.state, p);
        this.state.inventory = Object.assign({ magnifier: 0, calmCard: 0, detectiveNote: 0 }, p.inventory || {});
      }
    } catch (e) { /* 讀不到就用新紀錄 */ }
    return this.state;
  },
  save() { try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); } catch (e) {} },

  /* ---------- 偵探幣 ---------- */
  addCoins(amount) {
    this.state.coins = Math.max(0, this.state.coins + amount);
    this.save();
    return this.state.coins;
  },
  baseCoinFor(difficulty) { return difficulty === "挑戰" ? 14 : difficulty === "基礎" ? 8 : 10; },

  /* ---------- 商店 ---------- */
  buyItem(itemId) {
    const item = this.items[itemId];
    if (!item) return { success: false, msg: "找不到這個道具" };
    const price = this.priceOf(itemId);
    if (this.state.coins < price) return { success: false, msg: `偵探幣不足！還差 ${price - this.state.coins} 枚。` };
    this.state.coins -= price;
    this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
    this.save();
    return { success: true, msg: `買到「${item.name}」了！`, coins: this.state.coins };
  },
  useItem(itemId) {
    if ((this.state.inventory[itemId] || 0) <= 0) return { success: false, msg: "這個道具還沒有喔，先去商店買。" };
    this.state.inventory[itemId] -= 1;
    this.save();
    return { success: true };
  },

  /* ---------- 陷阱怪 ---------- */
  monsterFor(trapTag) {
    const id = this.trapMap[trapTag] || "unknown_fog";
    return this.trapMonsters[id];
  },
  recordTrap(trapTag) {
    const m = this.monsterFor(trapTag);
    this.state.trapStats[m.id] = (this.state.trapStats[m.id] || 0) + 1;
    this.save();
    return m;
  },
  // 遭遇 3 次以上且尚未復仇的陷阱怪
  revengeTargets() {
    return Object.keys(this.state.trapStats)
      .filter(id => this.state.trapStats[id] >= 3 && !this.state.avenged[id] && id !== "unknown_fog")
      .map(id => this.trapMonsters[id]);
  },
  completeRevenge(monsterId) {
    const m = this.trapMonsters[monsterId];
    if (!m) return null;
    this.state.avenged[monsterId] = true;
    const title = m.name + "剋星";
    if (!this.state.titles.includes(title)) this.state.titles.push(title);
    this.addCoins(30);
    this.save();
    return title;
  },

  /* ---------- 信心押注 ----------
     betMode：steady 穩健／gamble 孤注一擲／insurance 購買保險
     不使用生命值，賭注一律以偵探幣結算（幣數不會低於 0）。 */
  BET: {
    steady:    { name: "穩健調查",   cost: 0, winMul: 1, losePenalty: 3 },
    gamble:    { name: "孤注一擲",   cost: 0, winMul: 2, losePenalty: 8 },
    insurance: { name: "購買保險",   cost: 5, winMul: 1, losePenalty: 0 }
  },
  calculateReward(baseCoin, isCorrect, betMode, shielded) {
    const bet = this.BET[betMode] || this.BET.steady;
    const mul = this.todayEvent().coinMul;
    let earned = 0, penalty = 0, message = "";
    if (isCorrect) {
      earned = baseCoin * bet.winMul * mul;
      message = betMode === "gamble" ? `孤注一擲成功！獲得 ${earned} 枚偵探幣。`
        : betMode === "insurance" ? `回答正確，獲得 ${earned} 枚偵探幣（保險費已付）。`
        : `回答正確，獲得 ${earned} 枚偵探幣。`;
    } else {
      penalty = shielded ? 0 : bet.losePenalty;
      message = shielded ? "冷靜卡發動，這次答錯不扣偵探幣。"
        : penalty ? `答錯了，被陷阱怪咬走 ${penalty} 枚偵探幣。`
        : "保險發動，這次答錯不扣偵探幣。";
    }
    if (earned) this.addCoins(earned);
    if (penalty) this.addCoins(-penalty);
    return { earnedCoins: earned, penalty, message, currentCoins: this.state.coins };
  }
};

if (typeof window !== "undefined") { window.DetectiveSystem = DetectiveSystem; DetectiveSystem.init(); }
if (typeof module !== "undefined") module.exports = DetectiveSystem;
