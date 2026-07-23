/* 部件大亂鬥・題目資料（全部人工確認為存在且適合國小三～六年級的字）
   FAMILY_DATA 聲旁字族白名單、CONTEXT_DATA 情境鑑識、IMPOSTER_DATA 冒牌字鑑識。
   不以程式動態拼字，避免造出不存在的漢字。 */

const FAMILY_DATA = [
  { sheng: "青", note: "「青」常提示讀音，字義要看另一個部件",
    members: [
      { part: "氵", char: "清", mean: "水乾淨、清澈" },
      { part: "日", char: "晴", mean: "天氣好、出太陽" },
      { part: "忄", char: "情", mean: "心情、感情" },
      { part: "言", char: "請", mean: "說話、邀請" },
      { part: "目", char: "睛", mean: "眼睛" } ],
    context: { sentence: "雨停了，天空放＿，溪水也變得很＿。", answers: ["晴", "清"] } },
  { sheng: "包", note: "「包」常提示讀音，字義要看另一個部件",
    members: [
      { part: "氵", char: "泡", mean: "用水沖、氣泡" },
      { part: "火", char: "炮", mean: "火砲、爆竹" },
      { part: "足", char: "跑", mean: "用腳快走" },
      { part: "扌", char: "抱", mean: "用手環抱" },
      { part: "食", char: "飽", mean: "吃夠了" } ],
    context: { sentence: "他用手把小狗＿起來，再用熱水＿了一壺茶。", answers: ["抱", "泡"] } },
  { sheng: "交", note: "「交」常提示讀音，字義要看另一個部件",
    members: [
      { part: "木", char: "校", mean: "學校" },
      { part: "車", char: "較", mean: "比較" },
      { part: "口", char: "咬", mean: "用嘴咬" },
      { part: "攵", char: "效", mean: "效果、功效" } ],
    context: null },
  { sheng: "丁", note: "「丁」常提示讀音，字義要看另一個部件",
    members: [
      { part: "扌", char: "打", mean: "用手擊打" },
      { part: "言", char: "訂", mean: "訂正、預訂" },
      { part: "頁", char: "頂", mean: "頭頂、最上面" },
      { part: "金", char: "釘", mean: "釘子" },
      { part: "目", char: "盯", mean: "用眼睛看住" } ],
    context: null },
  { sheng: "果", note: "「果」常提示讀音，字義要看另一個部件",
    members: [
      { part: "言", char: "課", mean: "課程、上課" },
      { part: "木", char: "棵", mean: "一棵樹的量詞" },
      { part: "頁", char: "顆", mean: "一顆的量詞" } ],
    context: null },
  { sheng: "艮", note: "「艮」常提示讀音，字義要看另一個部件",
    members: [
      { part: "木", char: "根", mean: "樹根、根本" },
      { part: "足", char: "跟", mean: "腳跟、跟隨" },
      { part: "彳", char: "很", mean: "程度很高" },
      { part: "忄", char: "恨", mean: "怨恨" },
      { part: "金", char: "銀", mean: "銀色、銀子" } ],
    context: null },
  { sheng: "兆", note: "「兆」常提示讀音，字義要看另一個部件",
    members: [
      { part: "木", char: "桃", mean: "桃子" },
      { part: "足", char: "跳", mean: "用腳跳" },
      { part: "辶", char: "逃", mean: "逃走" },
      { part: "扌", char: "挑", mean: "用手挑選" } ],
    context: null },
  { sheng: "寺", note: "「寺」常提示讀音，字義要看另一個部件",
    members: [
      { part: "日", char: "時", mean: "時間" },
      { part: "言", char: "詩", mean: "詩句" },
      { part: "扌", char: "持", mean: "用手拿著" },
      { part: "彳", char: "待", mean: "等待" },
      { part: "竹", char: "等", mean: "等候、等於" } ],
    context: null }
];

// 情境鑑識：單空，選項為形近／同音／同族，但只有一個符合句意
const CONTEXT_DATA = [
  { sentence: "操場積了水，走路要小心地面很＿。", options: ["滑", "猾", "劃", "畫"], ans: 0,
    clue: "地面有水會「滑」，用「氵」的『滑』。" },
  { sentence: "天氣好熱，我想去游＿池玩水。", options: ["泳", "詠", "永", "勇"], ans: 0,
    clue: "游泳在水裡，用「氵」的『泳』。" },
  { sentence: "下課鐘一響，大家都＿出教室。", options: ["跑", "泡", "抱", "飽"], ans: 0,
    clue: "用腳快走是「足」的『跑』。" },
  { sentence: "把髒衣服拿去＿一＿再晾乾。", options: ["洗", "冼", "銑", "先"], ans: 0,
    clue: "洗東西要用水，用「氵」的『洗』。" },
  { sentence: "上課要用心＿老師講的重點。", options: ["聽", "廳", "撐", "庭"], ans: 0,
    clue: "用耳朵聽，用「耳」的『聽』。" },
  { sentence: "他很專心，眼＿一直看著黑板。", options: ["睛", "晴", "情", "精"], ans: 0,
    clue: "眼睛要用「目」的『睛』；天氣才用「日」的『晴』。" }
];

// 冒牌字鑑識：句中有一個放錯的字，找出並改對
const IMPOSTER_DATA = [
  { sentence: "今天的天氣很清。", wrong: "清", right: "晴",
    why: "天氣好、出太陽要用「日」的『晴』；「氵」的『清』和水乾淨有關。" },
  { sentence: "媽媽用熱水飽了一壺茶。", wrong: "飽", right: "泡",
    why: "用水沖是「氵」的『泡』；吃很多才用「食」的『飽』。" },
  { sentence: "他的眼精閃閃發亮。", wrong: "精", right: "睛",
    why: "眼睛要用「目」的『睛』；『精』和米、精神有關。" },
  { sentence: "妹妹今天心晴特別好。", wrong: "晴", right: "情",
    why: "心情要用「忄」的『情』；「日」的『晴』是天氣。" },
  { sentence: "這棵大樹的跟扎得很深。", wrong: "跟", right: "根",
    why: "樹根要用「木」的『根』；「足」的『跟』是腳跟、跟隨。" },
  { sentence: "老師念了一首很美的持。", wrong: "持", right: "詩",
    why: "詩句要用「言」的『詩』；「扌」的『持』是用手拿著。" },
  { sentence: "他用手輕輕跑住剛睡著的貓。", wrong: "跑", right: "抱",
    why: "用手環抱是「扌」的『抱』；「足」的『跑』是用腳。" }
];

if (typeof window !== "undefined") {
  window.FAMILY_DATA = FAMILY_DATA;
  window.CONTEXT_DATA = CONTEXT_DATA;
  window.IMPOSTER_DATA = IMPOSTER_DATA;
}
