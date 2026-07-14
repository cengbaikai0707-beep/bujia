/* =========================================================
   questions.js — 進階題庫版（指事／會意為主，形聲輔助）
   ---------------------------------------------------------
   使用方式：整份取代原本 questions.js。
   設計重點：
     1. 第一關不再只是「部件→分類」，改為「認字＋理解構字邏輯」。
     2. 指事、會意題比例提高，讓學生能看出字形如何連到字義。
     3. 形聲題保留，主要用在音近／形近／標準答案辨析。
     4. 題目仍完全符合原本 QUESTION_BANK 物件格式，不需修改 script.js。
   ========================================================= */

const QUESTION_BANK = [
{ id:"M-S1-001", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"指事", difficulty:"標準", focus:"上", charOptions:true, question:"下列哪一個字最符合「用記號表示位置在基準線上方」的造字想法？", options:["上", "下", "本", "末"], answerIndex:0, explanation:"「上」用記號指出在基準線上方，常作指事字理解。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-002", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"指事", difficulty:"標準", focus:"下", charOptions:true, question:"下列哪一個字最符合「用記號表示位置在基準線下方」的造字想法？", options:["下", "上", "末", "本"], answerIndex:0, explanation:"「下」用記號指出在基準線下方，常作指事字理解。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-003", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"木", difficulty:"標準", focus:"本", charOptions:true, question:"「本」是在「木」的下方加記號，主要指出哪個部位？", options:["樹根", "樹梢", "樹葉", "樹洞"], answerIndex:0, explanation:"「本」可由木下加記號理解為樹根，引申為根本、原本。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-004", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"木", difficulty:"標準", focus:"末", charOptions:true, question:"「末」是在「木」的上方加記號，主要指出哪個部位？", options:["樹梢", "樹根", "樹幹", "樹皮"], answerIndex:0, explanation:"「末」可由木上加記號理解為末端，引申為最後、尾端。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-005", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"刀", difficulty:"標準", focus:"刃", charOptions:true, question:"「刃」是在「刀」上加一點，這一點主要指出什麼？", options:["刀口鋒利處", "刀柄", "刀鞘", "刀背"], answerIndex:0, explanation:"「刃」用記號指出刀口鋒利處，和刀鋒有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-006", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"口", difficulty:"挑戰", focus:"甘", charOptions:true, question:"「甘」的字形常被解釋為在口中加記號，較容易聯想到哪一種味道？", options:["甜味", "苦味", "酸味", "辣味"], answerIndex:0, explanation:"「甘」常和口中含有甜美之物的意象連結，表示甘甜。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-007", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"日/月", difficulty:"標準", focus:"明", charOptions:true, question:"「明」由「日」和「月」組成，最容易聯想到哪一種意思？", options:["光亮", "聲音", "行走", "買賣"], answerIndex:0, explanation:"日、月都能帶來光，因此「明」可聯想到明亮、明白。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-008", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"木", difficulty:"標準", focus:"林", charOptions:true, question:"「林」由兩個「木」組成，最容易聯想到什麼？", options:["許多樹木聚在一起", "一條河流", "一間房子", "一把刀"], answerIndex:0, explanation:"兩個木放在一起，可會意為樹木較多，和樹林有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-009", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"木", difficulty:"標準", focus:"森", charOptions:true, question:"「森」由三個「木」組成，比「林」更強調什麼？", options:["樹木很多且茂密", "樹木被砍光", "水流很急", "太陽很大"], answerIndex:0, explanation:"三個木表示更多樹木，常和森林、茂密有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-010", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"亻/木", difficulty:"標準", focus:"休", charOptions:true, question:"「休」由「亻」和「木」組成，最容易聯想到哪個畫面？", options:["人靠在樹旁休息", "人在水裡游泳", "人在門外說話", "人在火邊煮飯"], answerIndex:0, explanation:"人靠著樹，可以會意為停下來休息。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-011", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"田/力", difficulty:"標準", focus:"男", charOptions:true, question:"「男」由「田」和「力」組成，古代常用來聯想到哪件事？", options:["在田裡出力工作", "在屋裡睡覺", "在水裡游泳", "在門口說話"], answerIndex:0, explanation:"「男」常以田、力會意，和古代農田勞動的想像有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-012", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"小/大", difficulty:"挑戰", focus:"尖", charOptions:true, question:"「尖」由「小」在上、「大」在下組成，最容易聯想到哪種形狀？", options:["上小下大，末端尖細", "四面都圓", "完全平坦", "中間空洞"], answerIndex:0, explanation:"「尖」可從上小下大的形狀聯想到尖端、尖細。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-013", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"手/目", difficulty:"挑戰", focus:"看", charOptions:true, question:"「看」的字形中有手和目，最容易聯想到哪個動作？", options:["用手遮光、張眼觀看", "用腳奔跑", "用口唱歌", "用水清洗"], answerIndex:0, explanation:"「看」常可用手在眼上方的畫面理解，表示觀看。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-014", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"爪/木", difficulty:"挑戰", focus:"采", charOptions:true, question:"「采」上面像手爪，下面是木，較容易聯想到哪個動作？", options:["用手採摘樹上的東西", "用腳跑步", "用口說話", "用門關住"], answerIndex:0, explanation:"「采」可聯想到手在樹木上採取東西，和採摘有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-015", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"清晴情請", question:"「清、晴、情、請」讀音相近，判斷意思時最應該先看哪一部分？", options:["左邊部件", "右邊青", "筆畫多少", "字的長短"], answerIndex:0, explanation:"這組字右邊「青」多和讀音有關；左邊氵、日、忄、言常提示意思方向。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S1-016", level:"middle", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"跑泡抱飽", question:"「跑、泡、抱、飽」讀音相近，判斷意思時最關鍵的是什麼？", options:["左邊或外面的部件", "右邊的包", "字有幾畫", "哪個字比較常見"], answerIndex:0, explanation:"這組字都有「包」作聲音線索，足、氵、扌、食才是主要意義線索。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-001", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"氵", difficulty:"基礎", question:"「河、洗、淋」這幾個字，大多和什麼意思有關？", options:["水或液體", "心裡的想法", "金錢財物", "房屋空間"], answerIndex:0, explanation:"這三個字都有「氵」，三點水常提示水、液體、清洗或流動。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-002", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"忄/心", difficulty:"基礎", question:"「想、念、忘」這幾個字，大多和什麼意思有關？", options:["心裡的想法或記憶", "腳的動作", "天氣變化", "器具工具"], answerIndex:0, explanation:"這三個字都有「心」，常和思考、情感、記憶有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-003", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"言", difficulty:"基礎", question:"「說、話、語」這幾個字，大多和什麼意思有關？", options:["說話或語言", "眼睛看東西", "走路移動", "泥土地面"], answerIndex:0, explanation:"這三個字都有「言」，多半和開口說話、語言表達有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-004", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"貝", difficulty:"標準", question:"「財、買、貴」這幾個字，大多和什麼意思有關？", options:["金錢、財物或價值", "風雨天氣", "竹子做的東西", "說話語氣"], answerIndex:0, explanation:"這三個字都有「貝」。古代以貝為貨幣，所以常和錢財、價值有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-005", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"扌", difficulty:"基礎", question:"「打、抱、推」這幾個字，大多和什麼意思有關？", options:["用手做的動作", "用腳做的動作", "用眼睛看", "用嘴巴說"], answerIndex:0, explanation:"這三個字左邊都是提手旁「扌」，多半和手的動作有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-006", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"日", difficulty:"標準", question:"「晴、昨、晚」這幾個字，大多和什麼意思有關？", options:["天氣或時間", "說話語言", "金屬工具", "水和液體"], answerIndex:0, explanation:"這三個字都有「日」，常和太陽、天氣、時間有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-007", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"火/灬", difficulty:"標準", question:"「燒、烤、熱」這幾個字，大多和什麼意思有關？", options:["火、熱或燃燒", "水和洗滌", "布料衣服", "房屋建築"], answerIndex:0, explanation:"「火」與「灬」都常和燃燒、加熱有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-008", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"目", difficulty:"標準", question:"「眼、睛、眨」這幾個字，大多和什麼意思有關？", options:["眼睛或看的動作", "嘴巴或說話", "耳朵或聽", "鼻子或呼吸"], answerIndex:0, explanation:"這三個字都有「目」，多半和眼睛或觀看有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-009", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"足", difficulty:"標準", question:"「跑、跳、踢」這幾個字，大多和什麼意思有關？", options:["腳的動作", "手的動作", "說話的動作", "看的動作"], answerIndex:0, explanation:"這三個字左邊都是「足」，多半和腳、行走、運動有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-010", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"竹", difficulty:"標準", question:"「筆、筷、籃」這幾個字，大多和什麼意思有關？", options:["用竹子做的東西", "用金屬做的東西", "用布做的東西", "用泥土做的東西"], answerIndex:0, explanation:"竹字頭常提示材料或器物與竹子相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-011", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"雨", difficulty:"標準", question:"「雲、雪、霜」這幾個字，大多和什麼意思有關？", options:["天空的水氣或天氣現象", "地上的石頭", "身體的部位", "說話的方式"], answerIndex:0, explanation:"雨字頭常和天空水氣、天氣現象有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-012", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"辶", difficulty:"挑戰", question:"「追、送、迎」這幾個字，大多和什麼意思有關？", options:["走路、移動或路程", "坐著不動", "說話聊天", "吃東西"], answerIndex:0, explanation:"「辶」常和行走、移動、路程有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-013", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"宀", difficulty:"標準", question:"「家、室、宿」這幾個字，大多和什麼意思有關？", options:["房屋、居住或室內空間", "金錢交易", "花草植物", "疾病疼痛"], answerIndex:0, explanation:"「宀」像屋頂，常提示房屋、居住或室內空間。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-014", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"艹", difficulty:"標準", question:"「花、草、菜」這幾個字，大多和什麼意思有關？", options:["植物", "金屬", "說話", "腳步"], answerIndex:0, explanation:"草字頭「艹」多半和草木植物有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-015", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"石", difficulty:"標準", question:"「砂、碎、磚」這幾個字，大多和什麼意思有關？", options:["石頭或硬的材料", "心情", "語言", "衣服"], answerIndex:0, explanation:"「石」常提示石頭、礦物或堅硬材料。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S2-016", level:"middle", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"車", difficulty:"標準", question:"「輪、軌、輛」這幾個字，大多和什麼意思有關？", options:["車子或交通工具", "食物", "衣服", "天氣"], answerIndex:0, explanation:"這些字都有「車」，多半和車輛、交通有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-001", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"日", difficulty:"基礎", charOptions:true, question:"今天太陽很大，天氣很＿＿朗。", options:["晴", "情", "清", "請"], answerIndex:0, explanation:"天氣與陽光有關，要用有「日」的「晴」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-002", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"忄", difficulty:"基礎", charOptions:true, question:"他今天心＿＿很好，一直笑。", options:["情", "晴", "清", "請"], answerIndex:0, explanation:"心裡感受要用有「忄」的「情」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-003", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"基礎", charOptions:true, question:"這杯水很＿＿澈，可以看見杯底。", options:["清", "晴", "情", "請"], answerIndex:0, explanation:"和水有關，用有「氵」的「清」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-004", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"有問題的時候，要舉手＿＿問老師。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"開口詢問和說話有關，用有「言」的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-005", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"目", difficulty:"標準", charOptions:true, question:"他的眼＿＿又大又亮。", options:["睛", "晴", "精", "情"], answerIndex:0, explanation:"眼睛要用有「目」的「睛」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-006", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"米", difficulty:"挑戰", charOptions:true, question:"睡飽之後，他一整天都很有＿＿神。", options:["精", "睛", "晴", "情"], answerIndex:0, explanation:"「精神」用「精」；「睛」只用在眼睛。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-007", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"基礎", charOptions:true, question:"表演結束，大家用力＿＿手。", options:["拍", "怕", "泊", "伯"], answerIndex:0, explanation:"拍手要用手，所以用有「扌」的「拍」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-008", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"忄", difficulty:"基礎", charOptions:true, question:"打雷的時候，弟弟很害＿＿。", options:["怕", "拍", "泊", "伯"], answerIndex:0, explanation:"害怕是一種感覺，用有「忄」的「怕」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-009", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"標準", charOptions:true, question:"媽媽用熱水＿＿了一壺茶。", options:["泡", "抱", "跑", "包"], answerIndex:0, explanation:"泡茶要用水，所以用有「氵」的「泡」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-010", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"足", difficulty:"標準", charOptions:true, question:"上課鐘響了，他趕快＿＿進教室。", options:["跑", "泡", "抱", "包"], answerIndex:0, explanation:"跑步用腳，所以用有「足」的「跑」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-011", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"標準", charOptions:true, question:"姊姊輕輕＿＿著剛出生的妹妹。", options:["抱", "跑", "泡", "包"], answerIndex:0, explanation:"抱人要用手，所以用有「扌」的「抱」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-012", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"基礎", charOptions:true, question:"村子旁邊有一條清澈的小＿＿。", options:["河", "何", "荷", "可"], answerIndex:0, explanation:"小河是水，用有「氵」的「河」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-013", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"艹", difficulty:"標準", charOptions:true, question:"池塘裡開滿了美麗的＿＿花。", options:["荷", "河", "何", "可"], answerIndex:0, explanation:"荷花是植物，用有「艹」的「荷」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-014", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"上課的時候不要一直講＿＿。", options:["話", "活", "畫", "化"], answerIndex:0, explanation:"講話是說話，用有「言」的「話」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-015", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"金", difficulty:"標準", charOptions:true, question:"他把零＿＿存進撲滿裡。", options:["錢", "淺", "線", "賤"], answerIndex:0, explanation:"錢幣多和金屬相關，用有「金」的「錢」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-016", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"糸", difficulty:"標準", charOptions:true, question:"奶奶用毛＿＿織了一件外套。", options:["線", "錢", "淺", "賤"], answerIndex:0, explanation:"線和絲線、編織有關，用有「糸」的「線」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-017", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"基礎", charOptions:true, question:"第一節是國語＿＿。", options:["課", "棵", "顆", "果"], answerIndex:0, explanation:"上課和講解、語言有關，用有「言」的「課」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-018", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"木", difficulty:"標準", charOptions:true, question:"操場旁邊種了一＿＿大榕樹。", options:["棵", "課", "顆", "果"], answerIndex:0, explanation:"數樹木用「棵」，左邊是「木」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-019", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"頁", difficulty:"挑戰", charOptions:true, question:"天上有一＿＿好亮的星星。", options:["顆", "棵", "課", "果"], answerIndex:0, explanation:"數圓小物常用「顆」，和「棵」數樹不同。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-020", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"日", difficulty:"挑戰", charOptions:true, question:"太陽下山了，天色漸漸變＿＿。", options:["暗", "按", "案", "岸"], answerIndex:0, explanation:"天色明暗與光線有關，用有「日」的「暗」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-021", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"挑戰", charOptions:true, question:"請不要一直用手＿＿門鈴。", options:["按", "暗", "案", "岸"], answerIndex:0, explanation:"按門鈴是手的動作，用有「扌」的「按」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S3-022", level:"middle", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"挑戰", charOptions:true, question:"這條河很＿＿，小朋友不要靠近。", options:["深", "探", "棎", "琛"], answerIndex:0, explanation:"水的深淺與水有關，用有「氵」的「深」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-001", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"氵", difficulty:"基礎", focus:"潤", question:"看到「潤」這個字，先猜它可能和什麼有關？", options:["水分、濕潤", "金錢買賣", "走路移動", "說話聲音"], answerIndex:0, explanation:"「潤」的左邊是「氵」，先往水分、不乾燥方向猜。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-002", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"貝", difficulty:"標準", focus:"販", question:"看到「販」這個字，先猜它可能和什麼有關？", options:["買賣或財物", "樹木植物", "天氣變化", "身體動作"], answerIndex:0, explanation:"「販」有「貝」，多半和錢財、買賣有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-003", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"辶", difficulty:"標準", focus:"遞", question:"看到「遞」這個字，先猜它可能和什麼有關？", options:["移動、傳送或路途", "吃東西", "下雨", "看東西"], answerIndex:0, explanation:"「遞」有「辶」，常和移動、傳送有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-004", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"火", difficulty:"標準", focus:"焰", question:"看到「焰」這個字，先猜它可能和什麼有關？", options:["火或燃燒", "水或海", "布或衣服", "石頭或山"], answerIndex:0, explanation:"「焰」的左邊是「火」，所以和火光、燃燒有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-005", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"忄", difficulty:"基礎", focus:"悅", question:"看到「悅」這個字，先猜它可能和什麼有關？", options:["心情或感覺", "金屬工具", "雨水天氣", "竹製器物"], answerIndex:0, explanation:"「悅」有「忄」，多半和心情感受有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-006", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"言", difficulty:"標準", focus:"詠", question:"看到「詠」這個字，先猜它可能和什麼有關？", options:["用聲音吟唱或說出來", "用手拿東西", "用腳走路", "用眼睛看"], answerIndex:0, explanation:"「詠」有「言」，和聲音、誦讀、說唱有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-007", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"金", difficulty:"挑戰", focus:"鑄", question:"看到「鑄」這個字，先猜它可能和什麼有關？", options:["金屬的製作", "水的流動", "說話的方式", "心裡的想法"], answerIndex:0, explanation:"「鑄」有「金」，多半和金屬熔鑄、器物製作有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-008", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"目", difficulty:"標準", focus:"眺", question:"看到「眺」這個字，先猜它可能和什麼有關？", options:["用眼睛看", "用腳跳", "用手挑", "用嘴吃"], answerIndex:0, explanation:"「眺」有「目」，和眼睛觀看有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-009", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"足", difficulty:"標準", focus:"踏", question:"看到「踏」這個字，先猜它可能和什麼有關？", options:["腳的動作", "手的動作", "說話", "下雨"], answerIndex:0, explanation:"「踏」有「足」，和用腳踩、行走有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-010", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"竹", difficulty:"挑戰", focus:"筏", question:"看到「筏」這個字，先猜它可能和什麼有關？", options:["用竹子或木頭做的器物", "金屬做的刀", "布做的衣服", "泥土做的牆"], answerIndex:0, explanation:"「筏」有竹字頭，常和竹製器物、材料相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-011", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"食", difficulty:"標準", focus:"饑", question:"看到「饑」這個字，先猜它可能和什麼有關？", options:["食物或吃不飽", "走路", "說話", "下雨"], answerIndex:0, explanation:"「饑」有「飠」，多半和食物、飢餓有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-012", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"土", difficulty:"標準", focus:"塌", question:"看到「塌」這個字，先猜它可能和什麼有關？", options:["土或建築倒下", "水或河流", "火或熱", "說話"], answerIndex:0, explanation:"「塌」有「土」，常與土地、建築倒下相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-013", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"宀", difficulty:"標準", focus:"寓", question:"看到「寓」這個字，先猜它可能和什麼有關？", options:["房屋或居住", "下雨", "走路", "吃飯"], answerIndex:0, explanation:"「寓」有「宀」，像屋頂，和房屋、居住相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-014", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"雨", difficulty:"挑戰", focus:"霖", question:"看到「霖」這個字，先猜它可能和什麼有關？", options:["雨", "樹林裡的動物", "石頭", "布料"], answerIndex:0, explanation:"「霖」上面是「雨」，常和雨水有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-015", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"門", difficulty:"挑戰", focus:"闖", question:"看到「闖」這個字，最適合先聯想到哪個畫面？", options:["馬從門裡衝出來", "人在水中游泳", "手拿著工具", "日月一起發光"], answerIndex:0, explanation:"「闖」外面是門，裡面有馬，可會意為猛然衝入或衝出。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-016", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"貝", difficulty:"挑戰", focus:"賒", question:"看到「賒」這個字，先猜它可能和什麼有關？", options:["買賣或金錢", "走路", "說話", "下雨"], answerIndex:0, explanation:"「賒」有「貝」，多半和財物買賣有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-017", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"鳥", difficulty:"標準", focus:"鴉", question:"看到「鴉」這個字，先猜它可能和什麼有關？", options:["一種鳥", "一種魚", "一種花", "一種石頭"], answerIndex:0, explanation:"「鴉」有「鳥」，所以先猜是鳥類名稱。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S4-018", level:"middle", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"扌", difficulty:"標準", focus:"拭", question:"看到「拭」這個字，先猜它可能和什麼有關？", options:["手的動作", "腳的動作", "眼睛的動作", "嘴巴的動作"], answerIndex:0, explanation:"「拭」有「扌」，和用手擦拭有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-001", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"挑戰", focus:"明", charOptions:true, question:"下列哪個字最適合用「日＋月＝光亮」來理解？", options:["明", "林", "男", "休"], answerIndex:0, explanation:"「明」由日、月組成，日月皆有光，和明亮有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-002", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"標準", focus:"休", charOptions:true, question:"下列哪個字最適合用「人靠著樹」來理解？", options:["休", "男", "明", "尖"], answerIndex:0, explanation:"「休」可用人靠在樹旁的畫面理解，和休息有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-003", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"標準", focus:"森", charOptions:true, question:"下列哪個字最適合用「許多樹木聚集」來理解？", options:["森", "刃", "問", "晴"], answerIndex:0, explanation:"「森」由三個木組成，表示樹木很多、茂密。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-004", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"指事", difficulty:"標準", focus:"本", charOptions:true, question:"如果要表示「事情的根源、最開始的地方」，下列哪個字最合適？", options:["本", "末", "刃", "甘"], answerIndex:0, explanation:"「本」原可指樹根，引申為根本、原本。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-005", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"指事", difficulty:"標準", focus:"末", charOptions:true, question:"如果要表示「最後、尾端」，下列哪個字最合適？", options:["末", "本", "上", "刃"], answerIndex:0, explanation:"「末」原可指樹梢，引申為尾端、最後。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-006", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"門", difficulty:"挑戰", focus:"問", charOptions:true, question:"「問」外面是門，裡面是口。下列哪個解釋最接近它的構字畫面？", options:["在門內開口詢問", "用手拿東西", "水往下流", "人在樹旁休息"], answerIndex:0, explanation:"「問」可用門與口的組合來聯想開口詢問。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-007", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"女/子", difficulty:"標準", focus:"好", charOptions:true, question:"「好」由「女」和「子」組成，下列哪個意思最適合？", options:["美好、良好", "火很大", "水很深", "路很遠"], answerIndex:0, explanation:"「好」常用女、子會意，表示美好。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-008", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"宀/豕", difficulty:"挑戰", focus:"家", charOptions:true, question:"「家」上面是屋頂，下面是豕。它最容易聯想到哪一類意思？", options:["房屋、家庭", "眼睛觀看", "金屬工具", "樹木茂密"], answerIndex:0, explanation:"「家」有宀，和房屋、家庭有關；下方的豕是古代生活中的家畜意象。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-009", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"止/戈", difficulty:"挑戰", focus:"武", charOptions:true, question:"「武」常被解釋為和「止」「戈」有關，較適合聯想到哪一類意思？", options:["兵器、武力，也可引申制止戰爭", "食物味道", "月亮時間", "植物生長"], answerIndex:0, explanation:"「武」與戈等武器意象有關，解釋上常有停止干戈的說法。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-S5-010", level:"middle", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"不/正", difficulty:"挑戰", focus:"歪", charOptions:true, question:"「歪」由「不」和「正」組成，最容易理解為什麼？", options:["不正、傾斜", "很明亮", "很美好", "很多水"], answerIndex:0, explanation:"「歪」可從不正會意，表示不直、不正。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-001", level:"middle", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"氵", difficulty:"基礎", question:"「氵」最常和哪類意思有關？", options:["水或液體", "金錢財物", "心情想法", "房屋空間"], answerIndex:0, explanation:"「氵」多半提示水、液體、清洗或流動。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-002", level:"middle", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"忄", difficulty:"基礎", question:"「忄」最常和哪類意思有關？", options:["心情或想法", "腳的動作", "竹製器物", "金屬工具"], answerIndex:0, explanation:"「忄」由心變來，常和情緒、思考有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-003", level:"middle", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"貝", difficulty:"標準", question:"「貝」最常和哪類意思有關？", options:["金錢、財物或價值", "樹木植物", "雨水天氣", "說話語言"], answerIndex:0, explanation:"古代曾以貝為貨幣，所以常和錢財、價值有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-004", level:"middle", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"扌", difficulty:"標準", charOptions:true, question:"下列哪個字含有「扌」？", options:["推", "堆", "誰", "雖"], answerIndex:0, explanation:"「推」的左邊是提手旁，表示手的動作。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-005", level:"middle", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"目", difficulty:"標準", charOptions:true, question:"下列哪個字含有「目」？", options:["眠", "民", "泯", "抿"], answerIndex:0, explanation:"「眠」左邊是目，和閉眼睡覺有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-006", level:"middle", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"竹", difficulty:"標準", question:"「筆、筷、籃」共同部件主要提示什麼？", options:["製作材料或器物類型", "使用地點", "擁有人", "出現季節"], answerIndex:0, explanation:"竹字頭常提示竹製材料或相關器物。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-007", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"日", difficulty:"基礎", charOptions:true, question:"選出正確的字：明天應該是個大＿＿天。", options:["晴", "情", "清", "請"], answerIndex:0, explanation:"天氣和陽光有關，用帶日的「晴」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-008", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"選出正確的字：他很有禮貌，總是先＿＿問。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"詢問和說話有關，用帶言的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-009", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"足", difficulty:"標準", charOptions:true, question:"選出正確的字：他一口氣＿＿完一千公尺。", options:["跑", "泡", "抱", "包"], answerIndex:0, explanation:"跑步用腳，所以用帶足的「跑」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-010", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"木", difficulty:"標準", charOptions:true, question:"選出正確的字：門口有兩＿＿榕樹。", options:["棵", "顆", "課", "果"], answerIndex:0, explanation:"數樹木用「棵」，左邊是木。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-011", level:"middle", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"氵", difficulty:"基礎", question:"「沖」最可能和什麼有關？", options:["水", "火", "土", "金屬"], answerIndex:0, explanation:"「沖」左邊是氵，和水流、沖刷有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-012", level:"middle", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"氵", difficulty:"標準", question:"「迅」最可能和什麼有關？", options:["移動或速度", "食物", "衣服", "石頭"], answerIndex:0, explanation:"「迅」有辶，常和移動、速度有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-013", level:"middle", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"辶", difficulty:"標準", question:"「炙」最可能和什麼有關？", options:["火或烤", "水或洗", "風或吹", "土或埋"], answerIndex:0, explanation:"「炙」含火的意象，常和燒烤有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-014", level:"middle", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"火", difficulty:"挑戰", question:"「寢」最可能和什麼有關？", options:["房屋或睡覺休息的地方", "走路", "買賣", "天氣"], answerIndex:0, explanation:"「寢」上方是宀，和房屋、室內空間有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-015", level:"middle", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"宀", difficulty:"標準", question:"下列哪一組最適合歸為指事字？", options:["上、下、本、末", "清、晴、情、請", "江、河、湖、海", "跑、跳、踢、蹲"], answerIndex:0, explanation:"上、下、本、末常用記號指出位置或部位。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-016", level:"middle", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"會意", difficulty:"標準", question:"下列哪一組最適合用會意理解？", options:["明、休、男、森", "清、晴、情、請", "銅、銀、鐵、鋼", "語、詩、課、話"], answerIndex:0, explanation:"明、休、男、森可由部件組合成畫面來理解意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-017", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"指事", difficulty:"標準", question:"「根本」的「本」最接近哪個原始意義？", options:["樹根", "樹梢", "刀口", "甜味"], answerIndex:0, explanation:"「本」由木下記號指出根部，引申為根本。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-018", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"指事", difficulty:"標準", question:"「期末」的「末」最接近哪個原始意義？", options:["樹梢、尾端", "樹根", "刀口", "房屋"], answerIndex:0, explanation:"「末」由木上記號指出末端，引申為最後。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-019", level:"middle", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"形聲", difficulty:"挑戰", question:"「請、清、晴、情」判斷意思最重要的線索是什麼？", options:["左邊部件", "右邊青", "筆畫多寡", "字形大小"], answerIndex:0, explanation:"右邊青多提示讀音，左邊部件才常提示意思方向。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"M-PT-020", level:"middle", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"形聲", difficulty:"挑戰", charOptions:true, question:"選出正確的字：老師＿＿我們安靜聽講。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"請求、請人做事和語言有關，用言字旁的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-001", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"指事", difficulty:"標準", focus:"指事", question:"下列哪一組最適合歸入「指事字」的常見例子？", options:["上、下、本、末", "林、森、明、休", "清、晴、情、請", "江、河、湖、海"], answerIndex:0, explanation:"指事字常用記號指出抽象位置或部位，例如上、下、本、末。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-002", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"會意", difficulty:"標準", focus:"會意", question:"下列哪一組最適合用「會意」理解？", options:["明、休、男、森", "清、晴、情、請", "銅、銀、鐵、鋼", "河、湖、海、洋"], answerIndex:0, explanation:"會意字常由兩個以上部件合起來表示意思，例如日月為明、人木為休。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-003", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"形聲", difficulty:"標準", focus:"形聲", question:"下列哪一組最適合用「形旁表義、聲旁表音」理解？", options:["清、晴、情、請", "上、下、本、末", "林、森、明、休", "大、小、日、月"], answerIndex:0, explanation:"清、晴、情、請右邊都有青，讀音相近；左邊部件提示意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-004", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"指事", difficulty:"標準", focus:"本末", question:"「本」和「末」都和「木」有關。它們最大的差別是什麼？", options:["記號位置不同，指的部位不同", "讀音完全相同", "都是表示水流", "都是表示說話"], answerIndex:0, explanation:"「本」指根部，「末」指末端；差別在記號標出的部位。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-005", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"辨認", radical:"刀", difficulty:"標準", focus:"刃", question:"「刃」和「刀」最重要的差別是什麼？", options:["刃特別指出刀口鋒利處", "刃表示刀柄", "刃表示木頭", "刃表示房屋"], answerIndex:0, explanation:"「刃」在刀上加記號，指出刀口鋒利位置。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-006", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"日/月", difficulty:"標準", focus:"明", question:"「明」的構字邏輯，最接近下列哪一個說法？", options:["日和月都能帶來光，所以合起來表示明亮", "水和木合起來表示明亮", "口和心合起來表示明亮", "刀和力合起來表示明亮"], answerIndex:0, explanation:"「明」可由日、月會意，和光亮、明白有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-007", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"亻/木", difficulty:"標準", focus:"休", question:"「休」的構字邏輯，最接近下列哪一個畫面？", options:["人靠在樹旁休息", "太陽照在水面上", "人在門內說話", "手拿刀切東西"], answerIndex:0, explanation:"「休」可由人與木會意，像人靠著樹休息。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-008", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"田/力", difficulty:"標準", focus:"男", question:"「男」由田和力組成，較常被解釋為哪一種會意？", options:["在田裡出力工作", "在屋裡讀書", "在水裡游泳", "在門口唱歌"], answerIndex:0, explanation:"「男」可用田、力會意，連結古代農田勞動。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-009", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"小/大", difficulty:"挑戰", focus:"尖", question:"「尖」由小和大組成，較能提示哪一種形體特徵？", options:["上端細小、下方較大", "左右相同", "中間空心", "完全平面"], answerIndex:0, explanation:"「尖」可從上小下大理解為尖細、尖端。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-010", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"爪/木", difficulty:"挑戰", focus:"采", question:"「采」的構字較容易聯想到哪個動作？", options:["用手在樹上採取東西", "用腳在路上奔跑", "用口向人說話", "用水清洗物品"], answerIndex:0, explanation:"「采」可從手爪與木聯想採摘、採取。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-011", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"皿/水", difficulty:"挑戰", focus:"益", question:"「益」常可從容器中水滿出來的畫面理解，較接近哪種意思？", options:["增加、更多", "缺少、減少", "關閉、停止", "黑暗、寒冷"], answerIndex:0, explanation:"「益」常與增加、增益連結，可用水滿出器皿的畫面輔助理解。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-012", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"不/正", difficulty:"挑戰", focus:"歪", question:"「歪」由「不」和「正」組成，最直接的字義線索是什麼？", options:["不正、傾斜", "非常明亮", "金錢很多", "水很清澈"], answerIndex:0, explanation:"「歪」可從「不正」會意，表示不直、不正。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-013", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"人/言", difficulty:"挑戰", focus:"信", question:"「信」由人和言組成，較容易聯想到哪個意思？", options:["人說的話值得相信", "水流很急", "樹木很多", "天氣晴朗"], answerIndex:0, explanation:"「信」可用人言會意，連結誠信、相信。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-014", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"止/戈", difficulty:"挑戰", focus:"武", question:"「武」常被解釋與「止」「戈」有關，較適合聯想到哪個範圍？", options:["武力、兵器，也可有止戈的說法", "植物生長", "月亮時間", "食物味道"], answerIndex:0, explanation:"「武」與戈等武器意象相關，常見說法也會提到止戈。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-015", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"金", question:"「銅、鋼、銀、鐵」左邊相同，這個部件主要提示什麼？", options:["金屬類意思", "天氣類意思", "心情類意思", "房屋類意思"], answerIndex:0, explanation:"金字旁常提示金屬或金屬器物。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-016", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"言", question:"「詩、語、談、請」左邊相同，這個部件主要提示什麼？", options:["語言、說話或表達", "水流、清洗", "植物生長", "腳步移動"], answerIndex:0, explanation:"言字旁常提示語言、說話、表達相關意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-017", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"足", question:"「跑、跳、踢、蹲」左邊相同，這個部件主要提示什麼？", options:["腳或身體動作", "金錢財物", "衣服布料", "天氣變化"], answerIndex:0, explanation:"足字旁常提示腳、行走、運動等意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-018", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"衤", question:"「補、袖、裙、褲」左邊相同，這個部件主要提示什麼？", options:["衣服或布料", "雨水天氣", "房屋空間", "刀具切割"], answerIndex:0, explanation:"衣字旁、衣部件常提示衣物、布料。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-019", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"礻", question:"「祖、祝、神、禮」左邊相同，這個部件主要提示什麼？", options:["祭祀、神明或禮俗", "衣服布料", "行走路程", "金屬器具"], answerIndex:0, explanation:"礻示字旁常和祭祀、神明、禮俗有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S1-020", level:"upper", stage:1, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"疒", question:"「病、痛、痕、瘦」外面的部件主要提示什麼？", options:["疾病或身體不舒服", "說話語言", "植物花草", "車子工具"], answerIndex:0, explanation:"疒常提示疾病、疼痛或身體狀態。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-001", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"氵", difficulty:"基礎", question:"「河、洗、淋」這幾個字，大多和什麼意思有關？", options:["水或液體", "心裡的想法", "金錢財物", "房屋空間"], answerIndex:0, explanation:"這三個字都有「氵」，三點水常提示水、液體、清洗或流動。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-002", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"忄/心", difficulty:"基礎", question:"「想、念、忘」這幾個字，大多和什麼意思有關？", options:["心裡的想法或記憶", "腳的動作", "天氣變化", "器具工具"], answerIndex:0, explanation:"這三個字都有「心」，常和思考、情感、記憶有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-003", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"言", difficulty:"基礎", question:"「說、話、語」這幾個字，大多和什麼意思有關？", options:["說話或語言", "眼睛看東西", "走路移動", "泥土地面"], answerIndex:0, explanation:"這三個字都有「言」，多半和開口說話、語言表達有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-004", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"貝", difficulty:"標準", question:"「財、買、貴」這幾個字，大多和什麼意思有關？", options:["金錢、財物或價值", "風雨天氣", "竹子做的東西", "說話語氣"], answerIndex:0, explanation:"這三個字都有「貝」。古代以貝為貨幣，所以常和錢財、價值有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-005", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"扌", difficulty:"基礎", question:"「打、抱、推」這幾個字，大多和什麼意思有關？", options:["用手做的動作", "用腳做的動作", "用眼睛看", "用嘴巴說"], answerIndex:0, explanation:"這三個字左邊都是提手旁「扌」，多半和手的動作有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-006", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"日", difficulty:"標準", question:"「晴、昨、晚」這幾個字，大多和什麼意思有關？", options:["天氣或時間", "說話語言", "金屬工具", "水和液體"], answerIndex:0, explanation:"這三個字都有「日」，常和太陽、天氣、時間有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-007", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"火/灬", difficulty:"標準", question:"「燒、烤、熱」這幾個字，大多和什麼意思有關？", options:["火、熱或燃燒", "水和洗滌", "布料衣服", "房屋建築"], answerIndex:0, explanation:"「火」與「灬」都常和燃燒、加熱有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-008", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"目", difficulty:"標準", question:"「眼、睛、眨」這幾個字，大多和什麼意思有關？", options:["眼睛或看的動作", "嘴巴或說話", "耳朵或聽", "鼻子或呼吸"], answerIndex:0, explanation:"這三個字都有「目」，多半和眼睛或觀看有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-009", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"足", difficulty:"標準", question:"「跑、跳、踢」這幾個字，大多和什麼意思有關？", options:["腳的動作", "手的動作", "說話的動作", "看的動作"], answerIndex:0, explanation:"這三個字左邊都是「足」，多半和腳、行走、運動有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-010", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"竹", difficulty:"標準", question:"「筆、筷、籃」這幾個字，大多和什麼意思有關？", options:["用竹子做的東西", "用金屬做的東西", "用布做的東西", "用泥土做的東西"], answerIndex:0, explanation:"竹字頭常提示材料或器物與竹子相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-011", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"雨", difficulty:"標準", question:"「雲、雪、霜」這幾個字，大多和什麼意思有關？", options:["天空的水氣或天氣現象", "地上的石頭", "身體的部位", "說話的方式"], answerIndex:0, explanation:"雨字頭常和天空水氣、天氣現象有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-012", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"辶", difficulty:"挑戰", question:"「追、送、迎」這幾個字，大多和什麼意思有關？", options:["走路、移動或路程", "坐著不動", "說話聊天", "吃東西"], answerIndex:0, explanation:"「辶」常和行走、移動、路程有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-013", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"宀", difficulty:"標準", question:"「家、室、宿」這幾個字，大多和什麼意思有關？", options:["房屋、居住或室內空間", "金錢交易", "花草植物", "疾病疼痛"], answerIndex:0, explanation:"「宀」像屋頂，常提示房屋、居住或室內空間。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-014", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"艹", difficulty:"標準", question:"「花、草、菜」這幾個字，大多和什麼意思有關？", options:["植物", "金屬", "說話", "腳步"], answerIndex:0, explanation:"草字頭「艹」多半和草木植物有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-015", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"石", difficulty:"標準", question:"「砂、碎、磚」這幾個字，大多和什麼意思有關？", options:["石頭或硬的材料", "心情", "語言", "衣服"], answerIndex:0, explanation:"「石」常提示石頭、礦物或堅硬材料。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-016", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"車", difficulty:"標準", question:"「輪、軌、輛」這幾個字，大多和什麼意思有關？", options:["車子或交通工具", "食物", "衣服", "天氣"], answerIndex:0, explanation:"這些字都有「車」，多半和車輛、交通有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-017", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"刂", difficulty:"標準", question:"「割、刻、剖」這幾個字，大多和什麼意思有關？", options:["刀、切割或分開", "水或液體", "房屋空間", "說話表達"], answerIndex:0, explanation:"立刀旁與刀具、切割、分開相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-018", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"攵", difficulty:"挑戰", question:"「教、改、收、救」這些字常見的「攵」多半和什麼有關？", options:["動作、敲擊或使改變", "水流", "金屬", "食物"], answerIndex:0, explanation:"攵常作動作部件，可提示敲擊、行動、使改變等。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-019", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"礻", difficulty:"挑戰", question:"「祖、祝、神、禮」這幾個字，大多和什麼意思有關？", options:["祭祀、神明或禮俗", "衣服", "道路", "金屬"], answerIndex:0, explanation:"礻示字旁常與祭祀、神明、禮俗有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-020", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"衤", difficulty:"挑戰", question:"「補、袖、裙、褲」這幾個字，大多和什麼意思有關？", options:["衣服或布料", "說話", "疾病", "天氣"], answerIndex:0, explanation:"衣字旁常和衣服、布料、穿著有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-021", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"疒", difficulty:"挑戰", question:"「病、痛、痕、瘦」這幾個字，大多和什麼意思有關？", options:["疾病或身體狀態", "水流", "金錢", "門窗"], answerIndex:0, explanation:"疒常提示身體不舒服、疾病、疼痛。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-022", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"頁", difficulty:"挑戰", question:"「頭、顏、額、頸」這幾個字，大多和什麼意思有關？", options:["頭部或臉部", "車子", "食物", "植物"], answerIndex:0, explanation:"頁在許多字中和頭部、臉部相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-023", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"糸", difficulty:"挑戰", question:"「紋、線、結、編」這幾個字，大多和什麼意思有關？", options:["絲線、編織或連結", "刀具", "房屋", "天氣"], answerIndex:0, explanation:"糸常提示絲線、編織、連結。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S2-024", level:"upper", stage:2, mode:["adventure", "quick", "challenge"], skillType:"分類", radical:"酉", difficulty:"挑戰", question:"「酒、醉、醒、醋」這幾個字，大多和什麼意思有關？", options:["酒類或發酵食品", "石頭", "行走", "雨水"], answerIndex:0, explanation:"酉常和酒、發酵相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-001", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"日", difficulty:"基礎", charOptions:true, question:"今天太陽很大，天氣很＿＿朗。", options:["晴", "情", "清", "請"], answerIndex:0, explanation:"天氣與陽光有關，要用有「日」的「晴」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-002", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"忄", difficulty:"基礎", charOptions:true, question:"他今天心＿＿很好，一直笑。", options:["情", "晴", "清", "請"], answerIndex:0, explanation:"心裡感受要用有「忄」的「情」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-003", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"基礎", charOptions:true, question:"這杯水很＿＿澈，可以看見杯底。", options:["清", "晴", "情", "請"], answerIndex:0, explanation:"和水有關，用有「氵」的「清」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-004", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"有問題的時候，要舉手＿＿問老師。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"開口詢問和說話有關，用有「言」的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-005", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"目", difficulty:"標準", charOptions:true, question:"他的眼＿＿又大又亮。", options:["睛", "晴", "精", "情"], answerIndex:0, explanation:"眼睛要用有「目」的「睛」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-006", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"米", difficulty:"挑戰", charOptions:true, question:"睡飽之後，他一整天都很有＿＿神。", options:["精", "睛", "晴", "情"], answerIndex:0, explanation:"「精神」用「精」；「睛」只用在眼睛。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-007", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"基礎", charOptions:true, question:"表演結束，大家用力＿＿手。", options:["拍", "怕", "泊", "伯"], answerIndex:0, explanation:"拍手要用手，所以用有「扌」的「拍」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-008", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"忄", difficulty:"基礎", charOptions:true, question:"打雷的時候，弟弟很害＿＿。", options:["怕", "拍", "泊", "伯"], answerIndex:0, explanation:"害怕是一種感覺，用有「忄」的「怕」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-009", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"標準", charOptions:true, question:"媽媽用熱水＿＿了一壺茶。", options:["泡", "抱", "跑", "包"], answerIndex:0, explanation:"泡茶要用水，所以用有「氵」的「泡」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-010", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"足", difficulty:"標準", charOptions:true, question:"上課鐘響了，他趕快＿＿進教室。", options:["跑", "泡", "抱", "包"], answerIndex:0, explanation:"跑步用腳，所以用有「足」的「跑」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-011", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"標準", charOptions:true, question:"姊姊輕輕＿＿著剛出生的妹妹。", options:["抱", "跑", "泡", "包"], answerIndex:0, explanation:"抱人要用手，所以用有「扌」的「抱」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-012", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"基礎", charOptions:true, question:"村子旁邊有一條清澈的小＿＿。", options:["河", "何", "荷", "可"], answerIndex:0, explanation:"小河是水，用有「氵」的「河」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-013", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"艹", difficulty:"標準", charOptions:true, question:"池塘裡開滿了美麗的＿＿花。", options:["荷", "河", "何", "可"], answerIndex:0, explanation:"荷花是植物，用有「艹」的「荷」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-014", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"上課的時候不要一直講＿＿。", options:["話", "活", "畫", "化"], answerIndex:0, explanation:"講話是說話，用有「言」的「話」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-015", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"金", difficulty:"標準", charOptions:true, question:"他把零＿＿存進撲滿裡。", options:["錢", "淺", "線", "賤"], answerIndex:0, explanation:"錢幣多和金屬相關，用有「金」的「錢」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-016", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"糸", difficulty:"標準", charOptions:true, question:"奶奶用毛＿＿織了一件外套。", options:["線", "錢", "淺", "賤"], answerIndex:0, explanation:"線和絲線、編織有關，用有「糸」的「線」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-017", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"言", difficulty:"基礎", charOptions:true, question:"第一節是國語＿＿。", options:["課", "棵", "顆", "果"], answerIndex:0, explanation:"上課和講解、語言有關，用有「言」的「課」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-018", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"木", difficulty:"標準", charOptions:true, question:"操場旁邊種了一＿＿大榕樹。", options:["棵", "課", "顆", "果"], answerIndex:0, explanation:"數樹木用「棵」，左邊是「木」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-019", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"頁", difficulty:"挑戰", charOptions:true, question:"天上有一＿＿好亮的星星。", options:["顆", "棵", "課", "果"], answerIndex:0, explanation:"數圓小物常用「顆」，和「棵」數樹不同。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-020", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"日", difficulty:"挑戰", charOptions:true, question:"太陽下山了，天色漸漸變＿＿。", options:["暗", "按", "案", "岸"], answerIndex:0, explanation:"天色明暗與光線有關，用有「日」的「暗」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-021", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"扌", difficulty:"挑戰", charOptions:true, question:"請不要一直用手＿＿門鈴。", options:["按", "暗", "案", "岸"], answerIndex:0, explanation:"按門鈴是手的動作，用有「扌」的「按」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-022", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"氵", difficulty:"挑戰", charOptions:true, question:"這條河很＿＿，小朋友不要靠近。", options:["深", "探", "棎", "琛"], answerIndex:0, explanation:"水的深淺與水有關，用有「氵」的「深」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-023", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"礻", difficulty:"挑戰", charOptions:true, question:"廟裡正在舉行祭＿＿活動。", options:["祀", "似", "侍", "寺"], answerIndex:0, explanation:"祭祀、禮俗與「礻」有關，用「祀」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-024", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"衤", difficulty:"挑戰", charOptions:true, question:"天氣變冷了，請多穿一件外＿＿。", options:["套", "逃", "桃", "陶"], answerIndex:0, explanation:"外套是衣物，雖然「套」不帶衤，但語境判斷是標準用字；這題訓練不能只靠部件，也要回到詞語。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-025", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"疒", difficulty:"挑戰", charOptions:true, question:"他感冒了，喉嚨很＿＿。", options:["痛", "通", "桶", "統"], answerIndex:0, explanation:"身體不舒服、疼痛用有疒的「痛」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-026", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"頁", difficulty:"挑戰", charOptions:true, question:"妹妹的笑＿＿很可愛。", options:["顏", "言", "岩", "研"], answerIndex:0, explanation:"顏面、臉色與頭面部相關，「顏」有頁。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-027", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"糸", difficulty:"挑戰", charOptions:true, question:"這條紅＿＿把兩張卡片綁在一起。", options:["繩", "蠅", "澠", "憴"], answerIndex:0, explanation:"繩子和絲線、編織有關，用有糸的「繩」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-028", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"酉", difficulty:"挑戰", charOptions:true, question:"爸爸開車前不可以喝＿＿。", options:["酒", "洒", "灑", "晒"], answerIndex:0, explanation:"酒類與酉有關，標準字是「酒」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-029", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"刂", difficulty:"挑戰", charOptions:true, question:"請用剪刀把紙＿＿開。", options:["剪", "煎", "箭", "前"], answerIndex:0, explanation:"用刀具分開是「剪」，字中含刀的線索。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-030", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"攵", difficulty:"挑戰", charOptions:true, question:"老師耐心＿＿導學生修改作文。", options:["教", "較", "校", "效"], answerIndex:0, explanation:"教導的「教」含攵，與使人改變、學習行動相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-031", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"貝", difficulty:"挑戰", charOptions:true, question:"這件事情非常＿＿重，不能隨便決定。", options:["貴", "桂", "跪", "櫃"], answerIndex:0, explanation:"貴可表示價值高、重要，帶貝與價值相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S3-032", level:"upper", stage:3, mode:["adventure", "quick", "challenge"], skillType:"應用", radical:"阝", difficulty:"挑戰", charOptions:true, question:"臺灣有許多縣市和鄉＿＿名稱。", options:["鎮", "陣", "振", "震"], answerIndex:0, explanation:"鎮作地方行政或聚落名稱時常見，和地名地方相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-001", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"氵", difficulty:"基礎", focus:"潤", question:"看到「潤」這個字，先猜它可能和什麼有關？", options:["水分、濕潤", "金錢買賣", "走路移動", "說話聲音"], answerIndex:0, explanation:"「潤」的左邊是「氵」，先往水分、不乾燥方向猜。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-002", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"貝", difficulty:"標準", focus:"販", question:"看到「販」這個字，先猜它可能和什麼有關？", options:["買賣或財物", "樹木植物", "天氣變化", "身體動作"], answerIndex:0, explanation:"「販」有「貝」，多半和錢財、買賣有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-003", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"辶", difficulty:"標準", focus:"遞", question:"看到「遞」這個字，先猜它可能和什麼有關？", options:["移動、傳送或路途", "吃東西", "下雨", "看東西"], answerIndex:0, explanation:"「遞」有「辶」，常和移動、傳送有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-004", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"火", difficulty:"標準", focus:"焰", question:"看到「焰」這個字，先猜它可能和什麼有關？", options:["火或燃燒", "水或海", "布或衣服", "石頭或山"], answerIndex:0, explanation:"「焰」的左邊是「火」，所以和火光、燃燒有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-005", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"忄", difficulty:"基礎", focus:"悅", question:"看到「悅」這個字，先猜它可能和什麼有關？", options:["心情或感覺", "金屬工具", "雨水天氣", "竹製器物"], answerIndex:0, explanation:"「悅」有「忄」，多半和心情感受有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-006", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"言", difficulty:"標準", focus:"詠", question:"看到「詠」這個字，先猜它可能和什麼有關？", options:["用聲音吟唱或說出來", "用手拿東西", "用腳走路", "用眼睛看"], answerIndex:0, explanation:"「詠」有「言」，和聲音、誦讀、說唱有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-007", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"金", difficulty:"挑戰", focus:"鑄", question:"看到「鑄」這個字，先猜它可能和什麼有關？", options:["金屬的製作", "水的流動", "說話的方式", "心裡的想法"], answerIndex:0, explanation:"「鑄」有「金」，多半和金屬熔鑄、器物製作有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-008", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"目", difficulty:"標準", focus:"眺", question:"看到「眺」這個字，先猜它可能和什麼有關？", options:["用眼睛看", "用腳跳", "用手挑", "用嘴吃"], answerIndex:0, explanation:"「眺」有「目」，和眼睛觀看有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-009", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"足", difficulty:"標準", focus:"踏", question:"看到「踏」這個字，先猜它可能和什麼有關？", options:["腳的動作", "手的動作", "說話", "下雨"], answerIndex:0, explanation:"「踏」有「足」，和用腳踩、行走有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-010", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"竹", difficulty:"挑戰", focus:"筏", question:"看到「筏」這個字，先猜它可能和什麼有關？", options:["用竹子或木頭做的器物", "金屬做的刀", "布做的衣服", "泥土做的牆"], answerIndex:0, explanation:"「筏」有竹字頭，常和竹製器物、材料相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-011", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"食", difficulty:"標準", focus:"饑", question:"看到「饑」這個字，先猜它可能和什麼有關？", options:["食物或吃不飽", "走路", "說話", "下雨"], answerIndex:0, explanation:"「饑」有「飠」，多半和食物、飢餓有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-012", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"土", difficulty:"標準", focus:"塌", question:"看到「塌」這個字，先猜它可能和什麼有關？", options:["土或建築倒下", "水或河流", "火或熱", "說話"], answerIndex:0, explanation:"「塌」有「土」，常與土地、建築倒下相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-013", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"宀", difficulty:"標準", focus:"寓", question:"看到「寓」這個字，先猜它可能和什麼有關？", options:["房屋或居住", "下雨", "走路", "吃飯"], answerIndex:0, explanation:"「寓」有「宀」，像屋頂，和房屋、居住相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-014", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"雨", difficulty:"挑戰", focus:"霖", question:"看到「霖」這個字，先猜它可能和什麼有關？", options:["雨", "樹林裡的動物", "石頭", "布料"], answerIndex:0, explanation:"「霖」上面是「雨」，常和雨水有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-015", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"門", difficulty:"挑戰", focus:"闖", question:"看到「闖」這個字，最適合先聯想到哪個畫面？", options:["馬從門裡衝出來", "人在水中游泳", "手拿著工具", "日月一起發光"], answerIndex:0, explanation:"「闖」外面是門，裡面有馬，可會意為猛然衝入或衝出。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-016", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"貝", difficulty:"挑戰", focus:"賒", question:"看到「賒」這個字，先猜它可能和什麼有關？", options:["買賣或金錢", "走路", "說話", "下雨"], answerIndex:0, explanation:"「賒」有「貝」，多半和財物買賣有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-017", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"鳥", difficulty:"標準", focus:"鴉", question:"看到「鴉」這個字，先猜它可能和什麼有關？", options:["一種鳥", "一種魚", "一種花", "一種石頭"], answerIndex:0, explanation:"「鴉」有「鳥」，所以先猜是鳥類名稱。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-018", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"扌", difficulty:"標準", focus:"拭", question:"看到「拭」這個字，先猜它可能和什麼有關？", options:["手的動作", "腳的動作", "眼睛的動作", "嘴巴的動作"], answerIndex:0, explanation:"「拭」有「扌」，和用手擦拭有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-019", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"礻", difficulty:"挑戰", focus:"祈", question:"看到「祈」這個字，先猜它可能和什麼有關？", options:["祭祀、祈求或神明", "衣服布料", "金屬工具", "車輛交通"], answerIndex:0, explanation:"「祈」有礻，常和祭祀、祈求、神明相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-020", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"衤", difficulty:"挑戰", focus:"袍", question:"看到「袍」這個字，先猜它可能和什麼有關？", options:["衣服", "疾病", "雨水", "道路"], answerIndex:0, explanation:"「袍」有衤，常和衣物、穿著有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-021", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"疒", difficulty:"挑戰", focus:"瘡", question:"看到「瘡」這個字，先猜它可能和什麼有關？", options:["疾病、傷口或身體狀態", "說話", "買賣", "植物"], answerIndex:0, explanation:"「瘡」有疒，提示身體不舒服或傷病。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-022", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"頁", difficulty:"挑戰", focus:"頰", question:"看到「頰」這個字，先猜它可能和什麼有關？", options:["臉部或頭部", "金屬", "天氣", "船隻"], answerIndex:0, explanation:"「頰」有頁，常和頭面部相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-023", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"糸", difficulty:"挑戰", focus:"絮", question:"看到「絮」這個字，先猜它可能和什麼有關？", options:["絲線、棉絮或纖維", "火焰", "泥土", "刀具"], answerIndex:0, explanation:"「絮」有糸，和絲線、纖維類材料相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-024", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"酉", difficulty:"挑戰", focus:"酬", question:"看到「酬」這個字，先猜它可能和什麼有關？", options:["酒宴往來，引申報答酬謝", "水流", "跑步", "眼睛"], answerIndex:0, explanation:"「酬」有酉，原可與酒宴往來相關，後引申酬謝。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-025", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"刂", difficulty:"挑戰", focus:"剖", question:"看到「剖」這個字，先猜它可能和什麼有關？", options:["用刀分開、分析", "用水清洗", "用線編織", "用口唱歌"], answerIndex:0, explanation:"「剖」有刂，和切開、分開相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-026", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"攵", difficulty:"挑戰", focus:"敲", question:"看到「敲」這個字，先猜它可能和什麼有關？", options:["敲擊動作", "雨水", "金錢", "衣服"], answerIndex:0, explanation:"「敲」含攵，常和敲擊、動作相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-027", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"阝", difficulty:"挑戰", focus:"陡", question:"看到「陡」這個字，先猜它可能和什麼有關？", options:["山坡地勢", "說話", "食物", "衣服"], answerIndex:0, explanation:"左阝在許多字中和山陵、地勢相關，「陡」指坡度大。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-028", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"舟", difficulty:"挑戰", focus:"航", question:"看到「航」這個字，先猜它可能和什麼有關？", options:["船隻或行進", "疾病", "金屬", "火焰"], answerIndex:0, explanation:"「航」有舟，常和船隻、航行有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-029", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"馬", difficulty:"挑戰", focus:"駛", question:"看到「駛」這個字，先猜它可能和什麼有關？", options:["車馬行進或駕駛", "說話", "植物", "神明"], answerIndex:0, explanation:"「駛」有馬，原與馬行進相關，後也用於駕駛交通工具。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S4-030", level:"upper", stage:4, mode:["adventure", "quick", "challenge"], skillType:"推理", radical:"弓", difficulty:"挑戰", focus:"弦", question:"看到「弦」這個字，先猜它可能和什麼有關？", options:["弓上的線或樂器的弦", "房屋", "疾病", "金屬"], answerIndex:0, explanation:"「弦」有弓，先聯想到弓弦，再引申為樂器弦。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-001", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"挑戰", focus:"明", charOptions:true, question:"下列哪個字最適合用「日＋月＝光亮」來理解？", options:["明", "林", "男", "休"], answerIndex:0, explanation:"「明」由日、月組成，日月皆有光，和明亮有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-002", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"標準", focus:"休", charOptions:true, question:"下列哪個字最適合用「人靠著樹」來理解？", options:["休", "男", "明", "尖"], answerIndex:0, explanation:"「休」可用人靠在樹旁的畫面理解，和休息有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-003", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"標準", focus:"森", charOptions:true, question:"下列哪個字最適合用「許多樹木聚集」來理解？", options:["森", "刃", "問", "晴"], answerIndex:0, explanation:"「森」由三個木組成，表示樹木很多、茂密。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-004", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"指事", difficulty:"標準", focus:"本", charOptions:true, question:"如果要表示「事情的根源、最開始的地方」，下列哪個字最合適？", options:["本", "末", "刃", "甘"], answerIndex:0, explanation:"「本」原可指樹根，引申為根本、原本。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-005", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"指事", difficulty:"標準", focus:"末", charOptions:true, question:"如果要表示「最後、尾端」，下列哪個字最合適？", options:["末", "本", "上", "刃"], answerIndex:0, explanation:"「末」原可指樹梢，引申為尾端、最後。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-006", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"門", difficulty:"挑戰", focus:"問", charOptions:true, question:"「問」外面是門，裡面是口。下列哪個解釋最接近它的構字畫面？", options:["在門內開口詢問", "用手拿東西", "水往下流", "人在樹旁休息"], answerIndex:0, explanation:"「問」可用門與口的組合來聯想開口詢問。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-007", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"女/子", difficulty:"標準", focus:"好", charOptions:true, question:"「好」由「女」和「子」組成，下列哪個意思最適合？", options:["美好、良好", "火很大", "水很深", "路很遠"], answerIndex:0, explanation:"「好」常用女、子會意，表示美好。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-008", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"宀/豕", difficulty:"挑戰", focus:"家", charOptions:true, question:"「家」上面是屋頂，下面是豕。它最容易聯想到哪一類意思？", options:["房屋、家庭", "眼睛觀看", "金屬工具", "樹木茂密"], answerIndex:0, explanation:"「家」有宀，和房屋、家庭有關；下方的豕是古代生活中的家畜意象。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-009", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"止/戈", difficulty:"挑戰", focus:"武", charOptions:true, question:"「武」常被解釋為和「止」「戈」有關，較適合聯想到哪一類意思？", options:["兵器、武力，也可引申制止戰爭", "食物味道", "月亮時間", "植物生長"], answerIndex:0, explanation:"「武」與戈等武器意象有關，解釋上常有停止干戈的說法。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-010", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"不/正", difficulty:"挑戰", focus:"歪", charOptions:true, question:"「歪」由「不」和「正」組成，最容易理解為什麼？", options:["不正、傾斜", "很明亮", "很美好", "很多水"], answerIndex:0, explanation:"「歪」可從不正會意，表示不直、不正。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-011", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"祈", charOptions:true, question:"下列哪一個字最可能和「祭祀、祝福」有關？", options:["祈", "衫", "病", "跑"], answerIndex:0, explanation:"「祈」有礻，常與祭祀、祈求、祝福相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-012", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"袖", charOptions:true, question:"下列哪一個字最可能和「衣服」有關？", options:["袖", "神", "痛", "跑"], answerIndex:0, explanation:"「袖」有衤，常和衣服部位或衣物有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-013", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"痕", charOptions:true, question:"下列哪一個字最可能和「疾病」有關？", options:["痕", "裙", "銅", "詩"], answerIndex:0, explanation:"「痕」有疒，常提示身體傷病或痕跡。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-014", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"形聲", difficulty:"挑戰", focus:"額", charOptions:true, question:"下列哪一個字最可能和「頭部、臉部」有關？", options:["額", "船", "線", "酒"], answerIndex:0, explanation:"「額」有頁，常和頭面部相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-015", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"挑戰", focus:"旦", charOptions:true, question:"「旦」可看成太陽在地平線上，較適合聯想到什麼？", options:["早晨", "夜晚", "深水", "金錢"], answerIndex:0, explanation:"「旦」常以日出地平線的畫面理解，和早晨有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-016", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"挑戰", focus:"炎", charOptions:true, question:"「炎」由兩個火組成，最容易聯想到什麼？", options:["火勢旺、熱", "水很冷", "草木多", "話很多"], answerIndex:0, explanation:"兩個火疊加，常和火旺、炎熱有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-017", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"推理", radical:"會意", difficulty:"挑戰", focus:"間", charOptions:true, question:"「間」門中見月，較容易聯想到哪一類意思？", options:["門縫中的空隙或中間", "手的動作", "金屬器具", "疾病疼痛"], answerIndex:0, explanation:"「間」可由門與月光透入的畫面，連結空隙、中間。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-018", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"標準字", difficulty:"挑戰", focus:"寫", charOptions:true, question:"比賽題：選出標準用字。「他把答案＿＿在紙上。」", options:["寫", "潟", "瀉", "卸"], answerIndex:0, explanation:"寫字是標準用字；其他字形或語義不合。判斷時要先看語境，再看部件。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-019", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"標準字", difficulty:"挑戰", focus:"遵", charOptions:true, question:"比賽題：選出標準用字。「我們要＿＿守交通規則。」", options:["遵", "尊", "蹲", "樽"], answerIndex:0, explanation:"遵守規則用「遵」，帶辶，表示依循、行動路徑的意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-020", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"標準字", difficulty:"挑戰", focus:"搜", charOptions:true, question:"比賽題：選出標準用字。「他正在＿＿查資料。」", options:["搜", "蒐", "收", "餿"], answerIndex:0, explanation:"「搜查、搜尋」多用「搜」；帶扌，表示動作。蒐可見於蒐集，但此處搭配查資料用搜尋較合語境。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-021", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"標準字", difficulty:"挑戰", focus:"災", charOptions:true, question:"比賽題：選出標準用字。「颱風造成嚴重＿＿害。」", options:["災", "宰", "栽", "哉"], answerIndex:0, explanation:"災害用「災」，和災禍危害相關；其他字音近但義不合。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-S5-022", level:"upper", stage:5, mode:["adventure", "challenge"], skillType:"應用", radical:"標準字", difficulty:"挑戰", focus:"觀", charOptions:true, question:"比賽題：選出標準用字。「醫生仔細＿＿察病人的狀況。」", options:["觀", "灌", "罐", "館"], answerIndex:0, explanation:"觀察和看有關，標準詞是「觀察」；不能只靠聲音選字。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-001", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"氵", difficulty:"基礎", question:"「氵」最常和哪類意思有關？", options:["水或液體", "金錢財物", "心情想法", "房屋空間"], answerIndex:0, explanation:"「氵」多半提示水、液體、清洗或流動。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-002", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"忄", difficulty:"基礎", question:"「忄」最常和哪類意思有關？", options:["心情或想法", "腳的動作", "竹製器物", "金屬工具"], answerIndex:0, explanation:"「忄」由心變來，常和情緒、思考有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-003", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"貝", difficulty:"標準", question:"「貝」最常和哪類意思有關？", options:["金錢、財物或價值", "樹木植物", "雨水天氣", "說話語言"], answerIndex:0, explanation:"古代曾以貝為貨幣，所以常和錢財、價值有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-004", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"扌", difficulty:"標準", question:"下列哪個字含有「扌」？", options:["推", "堆", "誰", "雖"], answerIndex:0, explanation:"「推」的左邊是提手旁，表示手的動作。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-005", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"目", difficulty:"標準", question:"下列哪個字含有「目」？", options:["眠", "民", "泯", "抿"], answerIndex:0, explanation:"「眠」左邊是目，和閉眼睡覺有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-006", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"竹", difficulty:"標準", question:"「筆、筷、籃」共同部件主要提示什麼？", options:["製作材料或器物類型", "使用地點", "擁有人", "出現季節"], answerIndex:0, explanation:"竹字頭常提示竹製材料或相關器物。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-007", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"日", difficulty:"基礎", charOptions:true, question:"選出正確的字：明天應該是個大＿＿天。", options:["晴", "情", "清", "請"], answerIndex:0, explanation:"天氣和陽光有關，用帶日的「晴」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-008", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"言", difficulty:"標準", charOptions:true, question:"選出正確的字：他很有禮貌，總是先＿＿問。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"詢問和說話有關，用帶言的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-009", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"足", difficulty:"標準", charOptions:true, question:"選出正確的字：他一口氣＿＿完一千公尺。", options:["跑", "泡", "抱", "包"], answerIndex:0, explanation:"跑步用腳，所以用帶足的「跑」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-010", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"木", difficulty:"標準", charOptions:true, question:"選出正確的字：門口有兩＿＿榕樹。", options:["棵", "顆", "課", "果"], answerIndex:0, explanation:"數樹木用「棵」，左邊是木。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-011", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"氵", difficulty:"基礎", question:"「沖」最可能和什麼有關？", options:["水", "火", "土", "金屬"], answerIndex:0, explanation:"「沖」左邊是氵，和水流、沖刷有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-012", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"辶", difficulty:"標準", question:"「迅」最可能和什麼有關？", options:["移動或速度", "食物", "衣服", "石頭"], answerIndex:0, explanation:"「迅」有辶，常和移動、速度有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-013", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"火", difficulty:"標準", question:"「炙」最可能和什麼有關？", options:["火或烤", "水或洗", "風或吹", "土或埋"], answerIndex:0, explanation:"「炙」含火的意象，常和燒烤有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-014", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"宀", difficulty:"挑戰", question:"「寢」最可能和什麼有關？", options:["房屋或睡覺休息的地方", "走路", "買賣", "天氣"], answerIndex:0, explanation:"「寢」上方是宀，和房屋、室內空間有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-015", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"指事", difficulty:"標準", question:"下列哪一組最適合歸為指事字？", options:["上、下、本、末", "清、晴、情、請", "江、河、湖、海", "跑、跳、踢、蹲"], answerIndex:0, explanation:"上、下、本、末常用記號指出位置或部位。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-016", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"會意", difficulty:"標準", question:"下列哪一組最適合用會意理解？", options:["明、休、男、森", "清、晴、情、請", "銅、銀、鐵、鋼", "語、詩、課、話"], answerIndex:0, explanation:"明、休、男、森可由部件組合成畫面來理解意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-017", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"礻", difficulty:"標準", question:"「根本」的「本」最接近哪個原始意義？", options:["樹根", "樹梢", "刀口", "甜味"], answerIndex:0, explanation:"「本」由木下記號指出根部，引申為根本。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-018", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"衤", difficulty:"標準", question:"「期末」的「末」最接近哪個原始意義？", options:["樹梢、尾端", "樹根", "刀口", "房屋"], answerIndex:0, explanation:"「末」由木上記號指出末端，引申為最後。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-019", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"疒", difficulty:"挑戰", question:"「請、清、晴、情」判斷意思最重要的線索是什麼？", options:["左邊部件", "右邊青", "筆畫多寡", "字形大小"], answerIndex:0, explanation:"右邊青多提示讀音，左邊部件才常提示意思方向。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-020", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"頁", difficulty:"挑戰", charOptions:true, question:"選出正確的字：老師＿＿我們安靜聽講。", options:["請", "清", "晴", "情"], answerIndex:0, explanation:"請求、請人做事和語言有關，用言字旁的「請」。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-021", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"酉", difficulty:"標準", question:"下列哪一組最能說明形聲字「形旁表義、聲旁表音」？", options:["請、清、晴、情", "上、下、本、末", "明、休、森、男", "大、小、人、口"], answerIndex:0, explanation:"請清晴情有相近聲旁「青」，左邊部件提示不同意思。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-022", level:"upper", stage:"postTest", mode:["postTest"], skillType:"辨認", radical:"舟", difficulty:"標準", question:"下列哪一個字最能用「人＋言」理解？", options:["信", "清", "晴", "跑"], answerIndex:0, explanation:"信可由人言會意，和相信、信用有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-023", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"標準字", difficulty:"挑戰", question:"「祈」最可能和什麼意思有關？", options:["祭祀、祈求或神明", "衣服", "跑步", "金屬"], answerIndex:0, explanation:"祈有礻，和祭祀、祈求相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-024", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"標準字", difficulty:"挑戰", question:"「袍」最可能和什麼意思有關？", options:["衣物", "疾病", "水流", "說話"], answerIndex:0, explanation:"袍有衤，和衣物相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-025", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"疒", difficulty:"挑戰", question:"「瘡」最可能和什麼意思有關？", options:["疾病、傷口或身體狀態", "木材", "車輛", "語言"], answerIndex:0, explanation:"瘡有疒，常和疾病、傷口相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-026", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"衤", difficulty:"挑戰", question:"「頰」最可能和什麼意思有關？", options:["臉部", "行走", "植物", "金錢"], answerIndex:0, explanation:"頰有頁，常和頭面部相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-027", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"礻", difficulty:"挑戰", question:"「醉」最可能和什麼意思有關？", options:["酒或飲酒狀態", "天氣", "房屋", "絲線"], answerIndex:0, explanation:"醉有酉，常和酒相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-028", level:"upper", stage:"postTest", mode:["postTest"], skillType:"推理", radical:"舟", difficulty:"挑戰", question:"「航」最可能和什麼意思有關？", options:["船隻或行進", "疾病", "語言", "植物"], answerIndex:0, explanation:"航有舟，常和船或航行相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-029", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"標準字", difficulty:"挑戰", charOptions:true, question:"選出標準用字：這件事很＿＿重，不能玩笑看待。", options:["嚴", "岩", "言", "顏"], answerIndex:0, explanation:"嚴重用「嚴」；需依語境選標準字。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-030", level:"upper", stage:"postTest", mode:["postTest"], skillType:"應用", radical:"標準字", difficulty:"挑戰", charOptions:true, question:"選出標準用字：我們要＿＿照老師的指示完成任務。", options:["依", "衣", "醫", "椅"], answerIndex:0, explanation:"依照用「依」，其他字音近或形近但義不合。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-031", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"疒", difficulty:"挑戰", question:"「病、痛、痕、瘦」共同部件提示哪類意思？", options:["疾病或身體狀態", "祭祀禮俗", "金屬工具", "車輛交通"], answerIndex:0, explanation:"疒常和疾病、疼痛、身體狀態有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-032", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"衤", difficulty:"挑戰", question:"「袖、裙、褲、補」共同部件提示哪類意思？", options:["衣服或布料", "山坡地勢", "頭臉部位", "酒類發酵"], answerIndex:0, explanation:"衤常和衣服、布料、穿著有關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" },

{ id:"U-PT-033", level:"upper", stage:"postTest", mode:["postTest"], skillType:"分類", radical:"礻", difficulty:"挑戰", question:"「神、祖、祝、禮」共同部件提示哪類意思？", options:["祭祀、神明或禮俗", "腳部動作", "水流清洗", "食物味道"], answerIndex:0, explanation:"礻常和祭祀、神明、禮俗相關。", correctFeedback:"答對了。你有回到字形和部件線索判斷，不是只靠猜讀音。", wrongHint:"先停一下，請回到字形：看哪個部件在提示意思，再和題目的語境對照。" }
];

// 題庫統計：中年級與高年級皆含闖關、快速練習、挑戰、後測題。


/* =========================================================
   分層擴充（append-only；上方 263 題原始物件完全未更動）
   1) 依難度補上 basic 模式標籤（供「基礎補給站」抽題）
   2) 六型新題（字根意義分類／聲旁陷阱／一部件多意／
      陌生字推義／錯字修復／家族圖題）
   3) EXAM_BANK：考前快寫答案庫（中年級 28 部件，字皆經部件拆解驗證）
   ========================================================= */
QUESTION_BANK.forEach(function(q){
  if (q.stage === "postTest") return;                 // 後測題維持原樣
  if (q.difficulty === "基礎" && !q.mode.includes("basic")) q.mode.push("basic");
});

const EXTRA_QUESTIONS = [
  {
    "id": "X-CLS-01",
    "level": "upper",
    "stage": 2,
    "mode": [
      "challenge"
    ],
    "skillType": "分類",
    "radical": "貝",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "下列哪一組字，最能說明「貝」常和金錢、價值有關？",
    "options": [
      "買、賣、貨、財",
      "河、海、洗、清",
      "情、怕、忙、想",
      "說、話、詩、語"
    ],
    "answerIndex": 0,
    "explanation": "古人以貝殼為錢，買賣貨財都與金錢價值相關；其餘三組分別提示水、心情、言語。",
    "correctFeedback": "你抓到「貝＝錢財」這條線索了。",
    "wrongHint": "先看每組共同的部件是什麼，再想它代表哪一類意思。"
  },
  {
    "id": "X-CLS-02",
    "level": "middle",
    "stage": 2,
    "mode": [
      "challenge"
    ],
    "skillType": "分類",
    "radical": "扌",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "下列哪一組字，都和「手的動作」有關？",
    "options": [
      "打、抓、推、握",
      "江、河、海、湖",
      "明、星、晴、時",
      "說、記、詩、語"
    ],
    "answerIndex": 0,
    "explanation": "打抓推握都有扌，和手的動作有關；其餘三組分別是水、日、言。",
    "correctFeedback": "扌這一家都是手的動作，你分對了。",
    "wrongHint": "找出每組左邊共同的部件。"
  },
  {
    "id": "X-SND-01",
    "level": "upper",
    "stage": 4,
    "mode": [
      "challenge"
    ],
    "skillType": "推理",
    "radical": "青",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「清、請、情、晴、睛」都有「青」，真正幫你判斷意思的通常是哪一部分？",
    "options": [
      "左邊的部件（氵、言、忄、日、目）",
      "右邊的「青」",
      "字的筆畫數",
      "字的大小"
    ],
    "answerIndex": 0,
    "explanation": "「青」在這些字多半只提示讀音；意思要看左邊：氵水、言說話、忄心情、日天色、目眼睛。",
    "correctFeedback": "你分辨出「聲音線索」和「意思線索」了。",
    "wrongHint": "這幾個字讀音都像「青」，但意思差很多——差別在哪一邊？"
  },
  {
    "id": "X-SND-02",
    "level": "upper",
    "stage": 4,
    "mode": [
      "challenge"
    ],
    "skillType": "推理",
    "radical": "包",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「泡、抱、飽、跑、砲」都有「包」。下列說法哪一個正確？",
    "options": [
      "「包」多半提示讀音，意思要看另一個部件",
      "「包」一定表示把東西包起來",
      "這些字意思其實都一樣",
      "這些字都和食物有關"
    ],
    "answerIndex": 0,
    "explanation": "包在這些字裡主要提示音；意思看另一邊：氵泡水、扌抱、食飽、足跑、石砲。",
    "correctFeedback": "對，聲旁只提示讀音，別被它騙走。",
    "wrongHint": "想想這幾個字意思一樣嗎？不一樣的話，線索藏在哪裡？"
  },
  {
    "id": "X-MUL-01",
    "level": "upper",
    "stage": 4,
    "mode": [
      "challenge"
    ],
    "skillType": "推理",
    "radical": "月",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「明」裡的「月」像月亮，但「肚、胖、腦」裡的「月」比較可能代表什麼？",
    "options": [
      "身體、肉",
      "月亮",
      "水",
      "火"
    ],
    "answerIndex": 0,
    "explanation": "這些字的「月」其實多半是「肉」的變形，和身體部位有關，不是月亮。",
    "correctFeedback": "同一個部件在不同字裡可能有不同意思，你注意到了。",
    "wrongHint": "肚、胖、腦講的是身體還是天上的月亮？"
  },
  {
    "id": "X-MUL-02",
    "level": "middle",
    "stage": 4,
    "mode": [
      "challenge"
    ],
    "skillType": "推理",
    "radical": "灬",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「煮、熱」的「灬」和火有關，但「魚、馬、鳥」的「灬」呢？",
    "options": [
      "不一定是火，只是字形的一部分",
      "一定是火",
      "是水",
      "是腳"
    ],
    "answerIndex": 0,
    "explanation": "灬在煮、熱表示火；但魚、馬、鳥的灬只是字形，不能硬解成火。",
    "correctFeedback": "你知道部件是線索、不是鐵則了。",
    "wrongHint": "魚和馬會和火有關嗎？想想看。"
  },
  {
    "id": "X-UNK-01",
    "level": "upper",
    "stage": 4,
    "mode": [
      "adventure",
      "quick"
    ],
    "skillType": "推理",
    "radical": "氵",
    "difficulty": "標準",
    "charOptions": false,
    "question": "就算沒學過「沐」，用部件推測，它最可能和什麼有關？",
    "options": [
      "水（像洗澡、淋浴）",
      "火",
      "說話",
      "走路"
    ],
    "answerIndex": 0,
    "explanation": "沐有氵，多和水有關，「沐浴」就是用水洗身體。",
    "correctFeedback": "不認識的字，先看部件猜方向——做得好。",
    "wrongHint": "先別管讀音，看左邊的部件是哪一家。"
  },
  {
    "id": "X-UNK-02",
    "level": "upper",
    "stage": 4,
    "mode": [
      "challenge"
    ],
    "skillType": "推理",
    "radical": "疒",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "你可能不認識「瘡」，用部件推測，它最可能和什麼有關？",
    "options": [
      "生病、傷口",
      "金錢",
      "植物",
      "車輛"
    ],
    "answerIndex": 0,
    "explanation": "瘡有「疒」（病字旁），多和疾病、傷口有關。",
    "correctFeedback": "疒這個部件一出現，多半和身體不舒服有關。",
    "wrongHint": "外框那個部件常出現在生病相關的字裡。"
  },
  {
    "id": "X-UNK-03",
    "level": "middle",
    "stage": 4,
    "mode": [
      "adventure",
      "quick"
    ],
    "skillType": "推理",
    "radical": "足",
    "difficulty": "標準",
    "charOptions": false,
    "question": "沒學過「踞」也沒關係，用部件猜，它最可能和什麼動作有關？",
    "options": [
      "腳的動作",
      "手的動作",
      "說話",
      "看東西"
    ],
    "answerIndex": 0,
    "explanation": "踞有「足」（腳），多和腳的姿勢或動作有關。",
    "correctFeedback": "看到足字旁，先往「腳」的方向想。",
    "wrongHint": "左邊的部件是身體的哪個部位？"
  },
  {
    "id": "X-FIX-01",
    "level": "upper",
    "stage": 3,
    "mode": [
      "adventure",
      "quick"
    ],
    "skillType": "應用",
    "radical": "日",
    "difficulty": "標準",
    "charOptions": true,
    "question": "天氣很好，今天是個大＿天。（選正確的字）",
    "options": [
      "晴",
      "情",
      "請",
      "睛"
    ],
    "answerIndex": 0,
    "explanation": "天氣用「晴」（日，和天色有關）；情是心情、請是邀請、睛是眼睛。",
    "correctFeedback": "放回句子念一次，就知道是「晴」。",
    "wrongHint": "句子在講天氣，該用哪個部件的字？"
  },
  {
    "id": "X-FIX-02",
    "level": "middle",
    "stage": 3,
    "mode": [
      "adventure",
      "quick"
    ],
    "skillType": "應用",
    "radical": "氵",
    "difficulty": "標準",
    "charOptions": true,
    "question": "山上的河水很＿澈。（選正確的字）",
    "options": [
      "清",
      "晴",
      "請",
      "情"
    ],
    "answerIndex": 0,
    "explanation": "水很乾淨用「清」（氵，和水有關）；晴是天氣、請是邀請、情是心情。",
    "correctFeedback": "講水，就用氵的「清」。",
    "wrongHint": "句子在講水，線索在哪個部件？"
  },
  {
    "id": "X-FIX-03",
    "level": "upper",
    "stage": 3,
    "mode": [
      "adventure",
      "quick"
    ],
    "skillType": "應用",
    "radical": "忄",
    "difficulty": "標準",
    "charOptions": true,
    "question": "他的心＿很好，總是笑著幫忙。（選正確的字）",
    "options": [
      "情",
      "晴",
      "清",
      "請"
    ],
    "answerIndex": 0,
    "explanation": "心情用「情」（忄，和內心感受有關）。",
    "correctFeedback": "講心裡的感受，用忄的「情」。",
    "wrongHint": "句子在講心裡的感覺，該用哪個部件？"
  },
  {
    "id": "X-FAM-01",
    "level": "upper",
    "stage": 2,
    "mode": [
      "challenge"
    ],
    "skillType": "分類",
    "radical": "言",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「言」的字可分成不同小家族。下列哪一組都偏向「說話、交談」？",
    "options": [
      "說、話、談、講",
      "記、詞、誌",
      "評、論、議",
      "誤、謬、諷"
    ],
    "answerIndex": 0,
    "explanation": "說話類：說話談講；記詞誌偏文字記錄；評論議偏評論；誤謬偏錯誤。都屬言，但方向不同。",
    "correctFeedback": "同一個部件底下，還能再分小家族，你看出來了。",
    "wrongHint": "這幾組都有言，但『動作是不是在交談』不一樣。"
  },
  {
    "id": "X-FAM-02",
    "level": "upper",
    "stage": 2,
    "mode": [
      "challenge"
    ],
    "skillType": "分類",
    "radical": "貝",
    "difficulty": "挑戰",
    "charOptions": false,
    "question": "「貝」的字裡，下列哪一組比較偏向「責任或負擔」，而不是「金錢」？",
    "options": [
      "負、責、貢",
      "買、賣、財",
      "貨、費、貴",
      "賞、賺、貼"
    ],
    "answerIndex": 0,
    "explanation": "負責貢偏責任負擔；其餘三組偏金錢財物。都有貝，但方向不同。",
    "correctFeedback": "貝不只有錢，也有責任這一支，你分得很細。",
    "wrongHint": "同樣是貝，哪一組講的不是錢，而是扛在身上的事？"
  }
];
QUESTION_BANK.push.apply(QUESTION_BANK, EXTRA_QUESTIONS);

const EXAM_BANK = [
  {
    "id": "EXAM-001",
    "level": "middle",
    "radical": "氵",
    "radicalName": "三點水",
    "prompt": "看到「氵」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和水、液體、清潔、流動有關。",
    "groups": [
      {
        "label": "水或液體",
        "chars": [
          "汁",
          "汗",
          "油",
          "汽",
          "泡",
          "淚",
          "液",
          "湯",
          "漿"
        ]
      },
      {
        "label": "河流水域",
        "chars": [
          "江",
          "河",
          "海",
          "洋",
          "湖",
          "溪",
          "港",
          "池",
          "泳",
          "浪",
          "潮"
        ]
      },
      {
        "label": "清潔與動作",
        "chars": [
          "洗",
          "沖",
          "澆",
          "潑",
          "漂",
          "淋",
          "滴",
          "灌",
          "浸"
        ]
      },
      {
        "label": "狀態或變化",
        "chars": [
          "淡",
          "深",
          "淺",
          "溫",
          "濕",
          "滑",
          "混",
          "清",
          "濁",
          "滿",
          "減"
        ]
      }
    ],
    "caution": "少數含氵的字不一定直接指水，但多數可作意義線索。"
  },
  {
    "id": "EXAM-002",
    "level": "middle",
    "radical": "木",
    "radicalName": "木字旁",
    "prompt": "看到「木」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和樹木、木材、木製品有關。",
    "groups": [
      {
        "label": "樹木植物",
        "chars": [
          "林",
          "森",
          "樹",
          "枝",
          "根",
          "梅",
          "楊",
          "柳",
          "松",
          "桃",
          "李",
          "杏"
        ]
      },
      {
        "label": "木製品",
        "chars": [
          "板",
          "桌",
          "椅",
          "桶",
          "櫃",
          "架",
          "梯",
          "棒",
          "橋",
          "柱",
          "樑",
          "框"
        ]
      },
      {
        "label": "其他相關",
        "chars": [
          "材",
          "村",
          "極",
          "機",
          "樣",
          "檢",
          "植"
        ]
      }
    ],
    "caution": "少數字的木只是聲音或形體線索。"
  },
  {
    "id": "EXAM-003",
    "level": "middle",
    "radical": "扌",
    "radicalName": "提手旁",
    "prompt": "看到「扌」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和手的動作有關。",
    "groups": [
      {
        "label": "抓握持拿",
        "chars": [
          "抓",
          "握",
          "提",
          "抱",
          "拉",
          "推",
          "按",
          "持",
          "捧"
        ]
      },
      {
        "label": "各種動作",
        "chars": [
          "打",
          "找",
          "投",
          "拍",
          "挑",
          "掃",
          "排",
          "接",
          "換",
          "揮",
          "搖",
          "擦",
          "播",
          "抬",
          "扛"
        ]
      }
    ],
    "caution": "手的動作很多，部件只提示大方向。"
  },
  {
    "id": "EXAM-004",
    "level": "middle",
    "radical": "口",
    "radicalName": "口字旁",
    "prompt": "看到「口」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和嘴巴、說話、聲音有關。",
    "groups": [
      {
        "label": "說唱呼喊",
        "chars": [
          "叫",
          "唱",
          "吹",
          "吼",
          "呼",
          "喊",
          "叮",
          "咬",
          "喚",
          "喂"
        ]
      },
      {
        "label": "吃與含",
        "chars": [
          "吃",
          "喝",
          "含",
          "吞",
          "嚐",
          "味"
        ]
      },
      {
        "label": "語氣聲音",
        "chars": [
          "呀",
          "啊",
          "哈",
          "嘆",
          "嚇",
          "嗎",
          "呢",
          "哦"
        ]
      }
    ],
    "caution": "口有時只是形體，不一定表意。"
  },
  {
    "id": "EXAM-005",
    "level": "middle",
    "radical": "言",
    "radicalName": "言字旁",
    "prompt": "看到「言」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和說話、語言、文字有關。",
    "groups": [
      {
        "label": "說話交談",
        "chars": [
          "說",
          "話",
          "語",
          "講",
          "談",
          "論",
          "詢",
          "訴",
          "誦"
        ]
      },
      {
        "label": "文字評論",
        "chars": [
          "記",
          "詞",
          "詩",
          "課",
          "評",
          "認",
          "識",
          "誠",
          "謝",
          "讚",
          "譯",
          "誰",
          "許"
        ]
      }
    ],
    "caution": "多為形聲字，言旁提示與言語相關。"
  },
  {
    "id": "EXAM-006",
    "level": "middle",
    "radical": "忄",
    "radicalName": "豎心旁",
    "prompt": "看到「忄」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和心情、感受有關。",
    "groups": [
      {
        "label": "情緒感受",
        "chars": [
          "快",
          "忙",
          "怕",
          "慌",
          "悔",
          "惜",
          "惱",
          "憐",
          "憎",
          "懶",
          "慣",
          "悟",
          "恨",
          "情",
          "懂",
          "愉"
        ]
      }
    ],
    "caution": "忄是心的側寫，和情緒感受相關。"
  },
  {
    "id": "EXAM-007",
    "level": "middle",
    "radical": "心",
    "radicalName": "心字底",
    "prompt": "看到「心」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和思考、情感、意念有關。",
    "groups": [
      {
        "label": "思考意念",
        "chars": [
          "想",
          "念",
          "忘",
          "忍",
          "志",
          "忠",
          "急",
          "思",
          "恩",
          "意",
          "應",
          "態",
          "慧"
        ]
      },
      {
        "label": "情感",
        "chars": [
          "怒",
          "悲",
          "愛",
          "感",
          "恐",
          "患",
          "憶",
          "惑"
        ]
      }
    ],
    "caution": "心在字底，和內心活動相關。"
  },
  {
    "id": "EXAM-008",
    "level": "middle",
    "radical": "日",
    "radicalName": "日字旁",
    "prompt": "看到「日」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和太陽、時間、明亮有關。",
    "groups": [
      {
        "label": "時間",
        "chars": [
          "早",
          "明",
          "昨",
          "昏",
          "晨",
          "時",
          "晚",
          "昌",
          "暫"
        ]
      },
      {
        "label": "光亮天氣",
        "chars": [
          "星",
          "春",
          "晴",
          "暗",
          "暖",
          "暑",
          "景",
          "晶",
          "曬",
          "旺"
        ]
      }
    ],
    "caution": "日多和光或時間相關。"
  },
  {
    "id": "EXAM-009",
    "level": "middle",
    "radical": "月",
    "radicalName": "月字旁",
    "prompt": "看到「月」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "一部分和月亮或時間有關，一部分其實是「肉」，和身體有關。",
    "groups": [
      {
        "label": "月亮與時間",
        "chars": [
          "明",
          "朗",
          "期",
          "朝"
        ]
      },
      {
        "label": "身體(肉)",
        "chars": [
          "肚",
          "肝",
          "肥",
          "胖",
          "腦",
          "腿",
          "腰",
          "胸",
          "臉",
          "膀",
          "肌",
          "肩",
          "育",
          "肯",
          "脂",
          "膚"
        ]
      }
    ],
    "caution": "月旁常常其實是「肉」，多和身體部位有關，要看字義判斷。"
  },
  {
    "id": "EXAM-010",
    "level": "middle",
    "radical": "火",
    "radicalName": "火字旁",
    "prompt": "看到「火」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和火、光、熱有關。",
    "groups": [
      {
        "label": "火焰燃燒",
        "chars": [
          "炎",
          "煙",
          "燒",
          "燈",
          "爐",
          "焰",
          "烤",
          "燙",
          "燥",
          "炭"
        ]
      },
      {
        "label": "光熱動作",
        "chars": [
          "炸",
          "炒",
          "烊",
          "燦",
          "爛",
          "煩"
        ]
      }
    ],
    "caution": "火旁多和燃燒或熱相關。"
  },
  {
    "id": "EXAM-011",
    "level": "middle",
    "radical": "灬",
    "radicalName": "四點火",
    "prompt": "看到「灬」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "一部分和火、熱有關；但有些字的灬其實不是火。",
    "groups": [
      {
        "label": "和火或熱有關",
        "chars": [
          "熱",
          "煮",
          "蒸",
          "照",
          "熟",
          "煎",
          "焦",
          "烈",
          "熬",
          "熊",
          "燕"
        ]
      },
      {
        "label": "看起來像火但要小心",
        "chars": [
          "魚",
          "馬",
          "鳥",
          "然",
          "無",
          "黑",
          "點"
        ]
      }
    ],
    "caution": "魚、馬、鳥的灬並不是火，不能硬套成火的意思。"
  },
  {
    "id": "EXAM-012",
    "level": "middle",
    "radical": "土",
    "radicalName": "土字旁",
    "prompt": "看到「土」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和泥土、地面、建築有關。",
    "groups": [
      {
        "label": "地形土地",
        "chars": [
          "地",
          "場",
          "坡",
          "城",
          "塊",
          "埋",
          "堆",
          "塔",
          "境",
          "域",
          "坑"
        ]
      },
      {
        "label": "建築塵土",
        "chars": [
          "坐",
          "堂",
          "牆",
          "塵",
          "塑",
          "填",
          "堅",
          "培"
        ]
      }
    ],
    "caution": "土旁多和地或土相關。"
  },
  {
    "id": "EXAM-013",
    "level": "middle",
    "radical": "女",
    "radicalName": "女字旁",
    "prompt": "看到「女」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和女性、家庭稱謂有關。",
    "groups": [
      {
        "label": "家庭稱謂",
        "chars": [
          "媽",
          "姐",
          "妹",
          "奶",
          "姑",
          "娘",
          "婆",
          "嫁",
          "娶",
          "婚",
          "姊"
        ]
      },
      {
        "label": "其他",
        "chars": [
          "好",
          "她",
          "姓",
          "始",
          "委",
          "娃",
          "妙",
          "嫌",
          "婦",
          "如",
          "妨"
        ]
      }
    ],
    "caution": "女旁多和人或稱謂相關。"
  },
  {
    "id": "EXAM-014",
    "level": "middle",
    "radical": "人",
    "radicalName": "人字",
    "prompt": "看到「人」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "和人有關（此處是「人」的字形，不是側旁的亻）。",
    "groups": [
      {
        "label": "和人有關",
        "chars": [
          "今",
          "令",
          "從",
          "眾",
          "坐",
          "傘",
          "舍",
          "命",
          "會",
          "倉",
          "全",
          "介",
          "企",
          "念",
          "含",
          "貪"
        ]
      }
    ],
    "caution": "人和亻是同一家，只是位置不同。"
  },
  {
    "id": "EXAM-015",
    "level": "middle",
    "radical": "亻",
    "radicalName": "單人旁",
    "prompt": "看到「亻」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和人、人的動作或身分有關。",
    "groups": [
      {
        "label": "人與動作身分",
        "chars": [
          "你",
          "他",
          "們",
          "住",
          "位",
          "但",
          "便",
          "信",
          "停",
          "做",
          "借",
          "值",
          "傳",
          "修",
          "保",
          "候",
          "例",
          "伴",
          "偉"
        ]
      }
    ],
    "caution": "亻是人的側寫，多和人相關。"
  },
  {
    "id": "EXAM-016",
    "level": "middle",
    "radical": "貝",
    "radicalName": "貝字旁",
    "prompt": "看到「貝」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "古代用貝殼當錢，多和金錢、價值、財物有關。",
    "groups": [
      {
        "label": "金錢財物",
        "chars": [
          "財",
          "貨",
          "買",
          "賣",
          "費",
          "貴",
          "賞",
          "賺",
          "貼",
          "貸",
          "賀"
        ]
      },
      {
        "label": "責任負擔",
        "chars": [
          "負",
          "責",
          "貢",
          "貧",
          "賓",
          "貫",
          "貪",
          "賠",
          "質",
          "賊"
        ]
      }
    ],
    "caution": "貝旁常和錢財或價值相關。"
  },
  {
    "id": "EXAM-017",
    "level": "middle",
    "radical": "金",
    "radicalName": "金字旁",
    "prompt": "看到「金」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和金屬、金錢有關。",
    "groups": [
      {
        "label": "金屬器物",
        "chars": [
          "銀",
          "銅",
          "鐵",
          "鋼",
          "針",
          "錢",
          "鐘",
          "鍋",
          "鑰",
          "鏡",
          "鈴",
          "鍵",
          "錶",
          "錄",
          "鎖",
          "鏈",
          "鑽"
        ]
      }
    ],
    "caution": "金旁多和金屬相關。"
  },
  {
    "id": "EXAM-018",
    "level": "middle",
    "radical": "目",
    "radicalName": "目字旁",
    "prompt": "看到「目」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和眼睛、看有關。",
    "groups": [
      {
        "label": "看與眼睛",
        "chars": [
          "看",
          "眼",
          "睛",
          "睡",
          "眠",
          "瞧",
          "睜",
          "盯",
          "瞪",
          "眨",
          "眉",
          "盼",
          "眷",
          "相",
          "省"
        ]
      }
    ],
    "caution": "目旁多和眼或看相關。"
  },
  {
    "id": "EXAM-019",
    "level": "middle",
    "radical": "足",
    "radicalName": "足字旁",
    "prompt": "看到「足」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和腳、走跑跳有關。",
    "groups": [
      {
        "label": "腳的動作",
        "chars": [
          "跑",
          "跳",
          "踢",
          "踩",
          "跌",
          "跪",
          "踏",
          "蹲",
          "蹦",
          "跨",
          "距",
          "路",
          "跟",
          "躍",
          "蹤",
          "踐"
        ]
      }
    ],
    "caution": "足旁多和腳的動作相關。"
  },
  {
    "id": "EXAM-020",
    "level": "middle",
    "radical": "糸",
    "radicalName": "絞絲旁",
    "prompt": "看到「糸」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和線、絲、繩、編織有關。",
    "groups": [
      {
        "label": "線與編織",
        "chars": [
          "線",
          "紅",
          "綠",
          "紫",
          "細",
          "織",
          "綁",
          "縫",
          "繩",
          "結",
          "給",
          "純",
          "練",
          "絲",
          "綿",
          "縮",
          "級",
          "約",
          "紙"
        ]
      }
    ],
    "caution": "糸旁多和線或編織相關。"
  },
  {
    "id": "EXAM-021",
    "level": "middle",
    "radical": "食",
    "radicalName": "食字旁",
    "prompt": "看到「食」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和食物、吃有關。",
    "groups": [
      {
        "label": "食物與吃",
        "chars": [
          "飯",
          "飲",
          "餅",
          "餓",
          "館",
          "饅",
          "飽",
          "餵",
          "餃",
          "飼",
          "餐",
          "養",
          "餘",
          "饋",
          "飾",
          "餡",
          "餛"
        ]
      }
    ],
    "caution": "食旁多和飲食相關。"
  },
  {
    "id": "EXAM-022",
    "level": "middle",
    "radical": "車",
    "radicalName": "車字旁",
    "prompt": "看到「車」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和車輛、運輸有關。",
    "groups": [
      {
        "label": "車輛運輸",
        "chars": [
          "輪",
          "軌",
          "較",
          "轉",
          "輕",
          "軟",
          "輛",
          "輸",
          "載",
          "軍",
          "輩",
          "轎",
          "輔",
          "軸",
          "庫",
          "陣"
        ]
      }
    ],
    "caution": "車旁多和車或運輸相關。"
  },
  {
    "id": "EXAM-023",
    "level": "middle",
    "radical": "門",
    "radicalName": "門字框",
    "prompt": "看到「門」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和門、開關、進出的空間有關。",
    "groups": [
      {
        "label": "門與開關空間",
        "chars": [
          "開",
          "關",
          "閉",
          "間",
          "閃",
          "悶",
          "閒",
          "閣",
          "闖",
          "閱",
          "問",
          "聞",
          "閏",
          "闊",
          "閩"
        ]
      }
    ],
    "caution": "門框多和門或空間相關。"
  },
  {
    "id": "EXAM-024",
    "level": "middle",
    "radical": "雨",
    "radicalName": "雨字頭",
    "prompt": "看到「雨」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和天氣、下雨有關。",
    "groups": [
      {
        "label": "天氣現象",
        "chars": [
          "雪",
          "雲",
          "雷",
          "電",
          "霜",
          "露",
          "霧",
          "需",
          "震",
          "霞",
          "零",
          "霸",
          "霆",
          "霖",
          "霉",
          "霓",
          "雯"
        ]
      }
    ],
    "caution": "雨頭多和天氣現象相關。"
  },
  {
    "id": "EXAM-025",
    "level": "middle",
    "radical": "竹",
    "radicalName": "竹字頭",
    "prompt": "看到「竹」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和竹子、竹製品有關。",
    "groups": [
      {
        "label": "竹與竹製品",
        "chars": [
          "筆",
          "筷",
          "籃",
          "籠",
          "竿",
          "箱",
          "篩",
          "簡",
          "節",
          "簿",
          "籤",
          "算",
          "笑",
          "笛",
          "符",
          "第",
          "等",
          "答",
          "管",
          "篇",
          "籬"
        ]
      }
    ],
    "caution": "竹頭多和竹或竹器相關。"
  },
  {
    "id": "EXAM-026",
    "level": "middle",
    "radical": "艹",
    "radicalName": "草字頭",
    "prompt": "看到「艹」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和植物、花草有關。",
    "groups": [
      {
        "label": "植物花草",
        "chars": [
          "花",
          "草",
          "苗",
          "芽",
          "葉",
          "荷",
          "菜",
          "蔬",
          "蘋",
          "莓",
          "蓮",
          "藤",
          "芒",
          "芹",
          "蒜",
          "蔥",
          "茶",
          "蘭",
          "菊",
          "蕉"
        ]
      }
    ],
    "caution": "草頭多和植物相關。"
  },
  {
    "id": "EXAM-027",
    "level": "middle",
    "radical": "虫",
    "radicalName": "蟲字旁",
    "prompt": "看到「虫」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和昆蟲、小動物有關。",
    "groups": [
      {
        "label": "昆蟲小動物",
        "chars": [
          "蚊",
          "蟻",
          "蜂",
          "蝶",
          "蛇",
          "蛙",
          "蝦",
          "蟹",
          "蜘",
          "蛛",
          "蟑",
          "螂",
          "蜻",
          "蜓",
          "蟬",
          "螞",
          "蚯",
          "蚓",
          "蠶",
          "蝸"
        ]
      }
    ],
    "caution": "虫旁多和蟲或小生物相關。"
  },
  {
    "id": "EXAM-028",
    "level": "middle",
    "radical": "鳥",
    "radicalName": "鳥字旁",
    "prompt": "看到「鳥」，請寫出 10 個含有這個部件的字。",
    "meaningHint": "多和鳥類有關。",
    "groups": [
      {
        "label": "鳥類",
        "chars": [
          "鴨",
          "鵝",
          "鴕",
          "鴿",
          "鶴",
          "鷹",
          "鸚",
          "鵡",
          "鴉",
          "鷗",
          "鶯",
          "鴛",
          "鴦",
          "鵲",
          "鴻",
          "鸛"
        ]
      }
    ],
    "caution": "鳥旁多和鳥相關。"
  }
];

if (typeof window !== "undefined") {
  window.QUESTION_BANK = QUESTION_BANK;
  window.EXAM_BANK = EXAM_BANK;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK: QUESTION_BANK, EXAM_BANK: EXAM_BANK };
}
