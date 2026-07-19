/* 同樂會零食大盜：故事設定檔（純資料，不含邏輯） */
const PARTY_STORY = {
  hp: 5,
  intro:
    "五年二班月考表現不錯，老師說明天下午辦同樂會，零食已放進準備室。" +
    "沒想到隔天學校臨時訪視，零食卻不見了——大家以為發生了『零食大盜』事件。" +
    "請在訪視結束前，靠讀題、數感與合作找回同樂會！",
  routes: ["leader", "academic", "discipline", "sports"],
  routeMeta: {
    leader:     { name: "班長線", icon: "👑", bank: "reading", preferredSkills: ["比較推理", "資訊篩選", "兩步驟讀題"] },
    academic:   { name: "學藝線", icon: "📝", bank: "chinese", preferredSkills: ["辨認", "分類", "應用", "推理"] },
    discipline: { name: "風紀線", icon: "🛡️", bank: "math",    preferredSkills: ["時間", "單位", "加減", "應用"] },
    sports:     { name: "體育康樂線", icon: "🏃", bank: "math", preferredSkills: ["應用", "乘法", "估算", "分組分配"] }
  },

  chapters: [
    {
      id: "chapter1",
      title: "第一章：準備室的痕跡",
      intro: "你走進準備室，地上有餅乾屑，窗台有腳印，門鎖卻有新的刮痕，紙條上還寫著『零時』。",
      passcode: "鑰匙開門",
      routes: {
        leader:     { secret: "鑰", evidence: ["準備室鑰匙只有少數人能拿到。", "班長今天沒有領準備室鑰匙。", "若是用鑰匙開門，嫌疑人範圍會縮小。"] },
        academic:   { secret: "匙", evidence: ["紙條寫『零時』，但同樂會不是在零時。", "這裡更像是『零食』寫錯字。", "文字線索指向零食，不是時間。"] },
        discipline: { secret: "開", evidence: ["窗戶的鎖是好的。", "窗邊灰塵沒有被破壞。", "門鎖有新刮痕，像被鑰匙開過。"] },
        sports:     { secret: "門", evidence: ["餅乾屑從櫃子一路延伸到門口。", "窗邊沒有零食箱拖動痕跡。", "物品移動路線比較像從門口離開。"] }
      },
      finalQuestion: {
        question: "最合理的進入方式是哪一個？",
        options: ["窗戶，因為窗台有腳印", "門口，因為門鎖有被鑰匙開過的痕跡"],
        answerIndex: 1,
        correct: "窗台腳印太表面；門鎖被鑰匙開過、灰塵完整，才是關鍵。",
        wrong: "你被最明顯的腳印誤導了。線索要和其他證據一致才算數，回頭看門鎖和灰塵。"
      }
    },
    {
      id: "chapter2",
      title: "第二章：走廊的監視器",
      intro: "監視器顯示：17:00 老師離開、17:30 小胖在門口探頭、18:00 陳阿姨推空車經過、18:30 老師提袋出現、19:00 小美經過在哭。",
      passcode: "老師謊言",
      routes: {
        leader:     { secret: "老", evidence: ["五個時間點要一個一個對。", "小胖只在門口探頭，沒進去。", "老師說18:00到家，畫面卻在18:30拍到他。"] },
        academic:   { secret: "師", evidence: ["『謊』有言字旁，和說話有關。", "證詞是用說的，要和畫面比對。", "說的話和證據不合，就是謊言。"] },
        discipline: { secret: "謊", evidence: ["把時間排好：17:00→17:30→18:00→18:30→19:00。", "18:00說到家，18:30又出現。", "相差30分鐘，說法對不上。"] },
        sports:     { secret: "言", evidence: ["18:30老師手上提著袋子。", "袋子大小裝得下零食。", "陳阿姨的推車是空的，往廚房方向。"] }
      },
      finalQuestion: {
        question: "誰的說法和監視器時間線最矛盾？",
        options: ["班長小美，因為她哭了還掉出餅乾", "王老師，說自己18:00回家，卻在18:30出現"],
        answerIndex: 1,
        correct: "小美的情緒和餅乾屑只是誤導；真正矛盾的是老師說詞和監視器時間不合。",
        wrong: "你被情緒和餅乾屑吸引了，它們不能證明誰偷零食。回到時間線判斷。"
      }
    },
    {
      id: "chapter3",
      title: "第三章：證人的說詞",
      intro: "老師說18:00就回家沒再回來；小美說18:30看到老師回辦公室；警衛也說18:30看見他。辦公室有個上鎖鐵櫃，附近有箱子拖行痕跡。",
      passcode: "鐵櫃藏箱",
      routes: {
        leader:     { secret: "鐵", evidence: ["老師說沒回來，兩位證人卻都說看到他。", "一個人的話要和別人比對。", "多數證人指向同一件事，較可信。"] },
        academic:   { secret: "櫃", evidence: ["『櫃』有木字旁，是放東西的傢俱。", "鐵櫃鎖著，裡面藏了東西。", "文字線索指向『鐵櫃』。"] },
        discipline: { secret: "藏", evidence: ["小美和警衛都說18:30看到老師。", "兩個證人時間一致，較可信。", "老師『18:00回家』站不住腳。"] },
        sports:     { secret: "箱", evidence: ["辦公室附近有箱子拖行痕跡。", "痕跡從門口延伸到鐵櫃。", "零食箱最可能被拖進鐵櫃。"] }
      },
      finalQuestion: {
        question: "零食最可能藏在哪裡？",
        options: ["老師辦公室的鐵櫃", "準備室窗戶外面"],
        answerIndex: 0,
        correct: "鐵櫃上鎖、有拖行痕跡、老師18:30回來，證據合起來指向辦公室鐵櫃。",
        wrong: "窗戶腳印是誤導。真正和零食箱有關的是辦公室鐵櫃與拖行痕跡。"
      }
    }
  ],

  boss: {
    title: "Boss 戰：同樂會保衛戰",
    intro: "零食找到了，但訪視委員準備離開。用你們練到的能力完成最後挑戰，證明五年二班不只會玩，也會讀題、推理、合作！",
    seconds: 240,
    passScore: 4,
    picks: [
      { bank: "chinese", count: 2 },
      { bank: "math",    count: 2 },
      { bank: "reading", count: 2 }
    ],
    reveal: "真相：王老師不是小偷。他怕訪視時零食被亂動，先把零食藏進辦公室鐵櫃，卻忘了告訴大家。"
  },

  endings: {
    perfect: {
      name: "傳奇偵探",
      text: "訪視委員留下來參加同樂會，直誇五年二班：『你們不只會讀書，還會合作破案。』老師打開鐵櫃，三大箱零食回到大家面前。全班歡呼：小偵探萬歲！同樂會萬歲！"
    },
    normal: {
      name: "資深偵探",
      text: "你成功找回零食了。雖然被窗台腳印、餅乾屑和上鎖的鐵櫃誤導過，最後還是靠合作破了案。同樂會稍微延後，但順利舉行。"
    },
    suspense: {
      name: "見習偵探",
      text: "訪視委員離開了，同樂會只能下次再辦。你看著地上的餅乾屑，知道還有線索沒看清楚。但這不是結束——下一次，你會更冷靜地讀題、找證據、和隊友合作。"
    }
  }
};

if (typeof window !== "undefined") window.PARTY_STORY = PARTY_STORY;
