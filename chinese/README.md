# 部件偵探社：文字王國修復任務

一個給國小學生練習「部件識字」的靜態網頁遊戲。專為 **部件識字大挑戰** 賽前練習設計，分中年級（3–4 年級）與高年級（5–6 年級）兩個版本。

**核心信念：** 先看部件，再猜意思，最後放回句子檢查。

遊戲不是要學生背下「哪個字有哪個部件」，而是練成一個習慣——遇到不會的字，先拆開來看，讓部件告訴你意思的方向。

---

## 一、怎麼打開

**最簡單的方式：** 直接用瀏覽器打開 `index.html`。

不需要安裝任何東西，不需要網路，不需要伺服器。整包資料夾複製到隨身碟、平板、學校電腦都能跑。

**如果要在本機測試伺服器環境**（不是必要，但某些瀏覽器對本機檔案較嚴格）：

```bash
cd bujian-game
python3 -m http.server 8000
# 然後打開 http://localhost:8000
```

**建議裝置：** 平板橫向或電腦。按鈕已放大，手機直向也可以用。

---

## 二、檔案結構

```
bujian-game/
├── index.html      遊戲的所有畫面（首頁、答題、過關、結果、說明）
├── style.css       全部樣式。顏色寫在最上面的 :root 變數區
├── questions.js    ★ 題庫（316 題）＋ EXAM_BANK 考前快寫答案庫。老師最常改的就是這個檔案
├── script.js       遊戲邏輯：抽題、計分、統計、匯出
├── README.md       這份文件
└── assets/         放插圖用的資料夾（目前是空的，遊戲不需要圖也能跑）
```

**重要：題庫和邏輯是分開的。** 新增或修改題目只要動 `questions.js`，完全不用碰 `script.js`。

---

## 三、遊戲內容

### 四種模式（分層版）

首頁是四張卡片，先選年級版本，再挑一種模式進入：

| 模式 | 題型 | 題數 | 用途 |
|---|---|---|---|
| 🧱 基礎補給站 basic | 選擇題 | 中／高年級各約 10 題 | 給認字量不足的學生，全部是基礎題（認部件、找同部件、判斷大致意義），建立基本字量 |
| 🗺️ 部件偵探社 adventure | 選擇題 | 五關，中年級每關 5 題、高年級每關 6 題 | 主線闖關：看部件 → 推測意義 → 放回句子檢查。已調高推理比重，減少過度簡單的題 |
| ✍️ 考前快寫 exam | **自我檢核（不計分）** | 每輪 6 個部件 | 應付「看到部件寫 10 個字」的比賽：先自己寫，再對照依意義分組的答案庫 |
| 🔍 挑戰模式 challenge | 選擇題 | 15 題 | 例外字、聲旁陷阱、一部件多意、陌生字推義，挑戰比例已拉高 |

> **簡單題沒有被刪除**，而是集中到「基礎補給站」；主線與挑戰模式則透過難度配比減少過度簡單的題目。
>
> **考前快寫是自我檢核，不需鍵盤輸入、也不計分**：畫面出現部件與提示，學生在紙上／小白板寫出 10 個字，按「顯示答案庫」後看到 15～40 個可接受字（依意義分組）與意義整理、易混淆提醒。它練的是「應試技巧」；**能寫出字不等於真正理解**——回顧頁會提醒：能說出這些字共同的意義，才是識字能力。
>
> 原本的「後測模式」題目（`mode: ["postTest"]`）仍保留在題庫中，但四張卡片沒有入口，等於暫時休眠。若要恢復，可自行在首頁加一張卡片並綁定 `state.mode = "postTest"`。

### 六種新題型

分層版新增了六種題型（`id` 以 `X-` 開頭，收在挑戰／主線模式），示範如何超越單純選字：字根意義分類、聲旁陷阱、一部件多意、陌生字推義、錯字修復、家族圖題。每題解析都會指出「線索在哪裡、為什麼不是其他選項、這個部件是不是絕對規則」。目前每型放了精選示例，可依 §4.2 續增。

### 五個關卡

1. **部件認親** — 認出部件的長相，知道它屬於哪一家（辨認、分類）
2. **字義偵探** — 從一群同部件的字歸納共同意思（分類）
3. **錯字修復** — 在句子裡選出正確的字（應用）
4. **陌生字推理** — 看到沒學過的字，先用部件猜方向（推理）
5. **終極密碼** — 綜合應用，取得通關密語

### 四項能力

每題都標記了 `skillType`，結果頁會分別統計：**辨認 / 分類 / 應用 / 推理**。

這樣老師能看出學生是「認不出部件」還是「認得出但不會用」——這兩件事的補救方式完全不同。

---

## 四、題庫怎麼改

### 4.1 題目長什麼樣子

```javascript
{
  id: "M-S1-001",                 // 編號：[M中年級|U高年級]-[S1~S5關卡|PT後測]-流水號
  level: "middle",                // middle 或 upper
  stage: 1,                       // 1~5，後測題填 "postTest"
  mode: ["adventure","quick","challenge"],   // 這題會出現在哪些模式
  skillType: "分類",               // 辨認 / 分類 / 應用 / 推理
  radical: "木",                  // 主要考的部件（結果頁的「常錯部件」用它統計）
  difficulty: "基礎",              // 基礎 / 標準 / 挑戰
  question: "看到「木」這個部件，最常和哪一類意思有關？",
  options: ["樹木或木頭做的東西", "金錢和買賣", "心裡的感覺", "說話的聲音"],
  answerIndex: 0,                 // 正確答案在 options 裡的位置（從 0 算起）
  explanation: "「木」多半出現在和樹木、木材有關的字裡……",   // 解析，一定要指出線索在哪個部件
  correctFeedback: "線索抓到了！……",
  wrongHint: "想想看「樹」「林」「枝」……",

  // 以下兩個是選填
  focus: "木",                    // 要放進田字格顯示的字或部件。不填就不顯示
  charOptions: true               // 選項是單字時填 true，畫面會放大成楷體
}
```

### 4.2 新增題目

在 `questions.js` 最後一個 `QUESTION_BANK.push(...)` 區塊裡，或另外開一個新的 `push` 區塊，直接加物件進去就好：

```javascript
QUESTION_BANK.push(
{ id:"M-S1-017", level:"middle", stage:1, mode:["adventure","quick"], skillType:"分類",
  radical:"石", difficulty:"基礎", focus:"石",
  question:"看到「石」這個部件，最常和哪一類意思有關？",
  options:["石頭或硬的材料","水","說話","心情"], answerIndex:0,
  explanation:"「石」常出現在和石頭、礦物有關的字裡，例如「砂」「碎」「磚」。",
  correctFeedback:"硬邦邦的線索，你摸到了。",
  wrongHint:"「砂」「碎」「磚」都有它。" }
);
```

存檔、重新整理瀏覽器，就會出現在題庫裡。**`window.QUESTION_BANK` 那一行必須留在檔案最後面**，不要把新題目寫在它下面。

### 4.3 檢查題庫有沒有寫錯

```bash
node -e '
const bank = require("./questions.js");
console.log("總題數:", bank.length);
const ids = bank.map(q=>q.id);
console.log("重複 id:", ids.filter((v,i)=>ids.indexOf(v)!==i));
const bad = bank.filter(q=>!q.options||q.options.length!==4||q.answerIndex==null||!q.radical);
console.log("欄位不完整:", bad.map(q=>q.id));
'
```

### 4.4 調整抽題數

打開 `script.js`，最上面的 `GAME_CONFIG`：

```javascript
counts: {
  basic:     { middle: 10, upper: 10 },   // 基礎補給站
  adventure: { middle: 5,  upper: 6  },   // 每一關的題數
  quick:     { middle: 10, upper: 10 },
  challenge: { middle: 15, upper: 15 },
  postTest:  { middle: 15, upper: 20 }
}
```

### 4.5 調整難度配比

同樣在 `GAME_CONFIG` 裡。每一組加起來要等於 `1`：

```javascript
difficultyRatio: {
  basic:     { 基礎: 1.00, 標準: 0.00, 挑戰: 0.00 },   // 全部基礎題
  adventure: { 基礎: 0.25, 標準: 0.55, 挑戰: 0.20 },   // 減少過度簡單
  challenge: { 基礎: 0.10, 標準: 0.40, 挑戰: 0.50 }    // 拉高挑戰
}
```

如果某個難度的題目不夠，程式會自動從同年級同模式的其他題目補上，**不會讓遊戲卡住**。

### 4.6 改顏色

`style.css` 最上面的 `:root`。例如整站換成暖色調，只要改 `--indigo` 和 `--paper` 兩個值。

---

## 五、⚠️ 題庫校對提醒（請務必閱讀）

### 5.1 正式使用前必須人工校對

> **「部件」不等於「正式部首」。** 本遊戲以識字策略為主，教的是「用部件推測意義方向」，不保證等同字典的部首檢索訓練；因此說明一律用「部件」「比賽看到的部件」，不硬稱為正式部首。
>
> **考前快寫的答案庫，每個字都已用漢字部件拆解資料（IDS）驗證確實含該部件**，但意義分組屬教學判斷；**正式比賽前，請務必對照學校公告的部件範圍人工核對一遍。**

本題庫的部件釋義參考教育部《重編國語辭典修訂本》的常見用法，並刻意採用「多半」「常和……有關」這類保守說法，避免把部件講成絕對規則。

**但是：正式用於比賽練習之前，請務必依照你們比賽的實際部件範圍人工校對一遍。** 特別是：

- 你們比賽的部件清單，可能與本題庫收錄的部件不完全相同
- 某些部件的教學說法各校可能略有差異
- 部分冷僻字（如「盥」「隼」「斂」）對特定學生可能過難，可自行刪除或降級

### 5.2 「需人工確認」的部件

本遊戲的題庫是依照**常見、可替換的部件**設計的，並非直接抄錄自比賽公告。

提供的比賽範圍照片為**投影的手寫講義**，字跡偏淡、有反光。以下部件在照片中**無法確認辨讀**，我沒有猜測，也沒有寫進題庫的比賽對應說明。請對照原始講義自行核對：

**中年級 — 需人工確認：**
`才／寸`（難以區分）、`匕`、`米`、`羊`、`艮`、`戈`、`示（礻）`、`爪`、`勺`、`交`、`里`

**高年級 — 需人工確認：**
`幺`、`巴`、`四／罒`、`兆`、`多`、`少`、`元`、`干`、`入`、`寺`、`豆`、`十`、`放`、`几`、`支`、`朋`、`囗`

**建議做法：** 打開原始講義，把上面兩份清單逐一確認。若某個部件確實在範圍內但題庫沒有，依照 §4.2 補題即可。若題庫有但範圍內沒有，可把該題的 `mode` 設成 `[]`（不會被抽到），或直接刪除。

### 5.3 題庫中刻意保留的「例外教學」

有幾題是故意教學生「部件不一定表意」的：

- `M-S1-008` — 「月」有時候其實是「肉」（肚、腦、胖）
- `U-S1-003`、`U-S5-007` — 「灬」不一定是火（魚、馬、鳥）
- `U-S1-009` — 「隹」在「誰」「推」裡只表音
- `U-S2-020` — 「止」的本義是腳，不是停止
- `U-S5-016`、`U-PT-020` — 「艮」在「跟／根／限」裡只表音

這些是整套教材裡最重要的觀念，**建議不要刪除**。

---

## 六、部署成線上連結

### 6.1 GitHub Pages（免費、適合長期使用）

1. 到 [github.com](https://github.com) 註冊帳號，建立一個新的 repository（例如命名為 `bujian-game`），設為 **Public**。
2. 在 repository 頁面點 **Add file → Upload files**，把 `index.html`、`style.css`、`questions.js`、`script.js`、`README.md`、`assets/` 全部拖進去，按 **Commit changes**。
3. 點上方的 **Settings** → 左側 **Pages**。
4. Source 選 **Deploy from a branch**，Branch 選 **main**，資料夾選 **/ (root)**，按 **Save**。
5. 等 1–2 分鐘，重新整理頁面，上方會出現網址，格式是：
   `https://你的帳號.github.io/bujian-game/`

之後只要在 GitHub 上編輯 `questions.js` 並 commit，網站會自動更新。

### 6.2 Netlify（最快，30 秒）

1. 到 [app.netlify.com/drop](https://app.netlify.com/drop)。
2. 把整個 `bujian-game` 資料夾**直接拖曳**到網頁上。
3. 幾秒後就會給你一個網址。可以在 Site settings 裡改成好記的名稱。

不用註冊也能用（但註冊後才能保留網址並更新內容）。

### 6.3 本機測試

見 §一。

---

## 七、插圖

遊戲設計成 **完全不需要圖片也能跑**。目前的視覺主軸是「田字格 + 楷體 + 講義藍紙」，本身已經有識別度。

如果之後想加插圖，把圖片放進 `assets/`，在 `index.html` 相對應的位置插入 `<img src="assets/檔名.png" alt="說明文字">` 即可。

### 7.1 建議的圖片清單

| 檔名 | 用在哪裡 | 建議尺寸 |
|---|---|---|
| `hero.png` | 首頁主視覺 | 1200×600 |
| `stage-1.png` ~ `stage-5.png` | 各關卡的過關畫面 | 400×400 |
| `badge-bronze.png` / `badge-silver.png` / `badge-gold.png` | 結果頁徽章 | 300×300 |

### 7.2 AI 繪圖提示詞（Canva / DALL·E / Midjourney 皆可）

統一風格關鍵字：`clean flat illustration, bright educational style, soft indigo and paper-blue palette, simple shapes, no text, white background`

1. **首頁主視覺** — `A friendly young detective with a magnifying glass examining giant floating Chinese character strokes and radicals, clean flat illustration, bright educational style, soft indigo and paper-blue palette, no text, white background`

2. **第 1 關 部件認親** — `Several Chinese character components as cute characters finding their family members, standing in a grid, clean flat illustration, indigo and paper-blue palette, no text, white background`

3. **第 2 關 字義偵探** — `A magnifying glass hovering over a row of related objects — water drop, river, washing bowl — connected by dotted lines, clean flat illustration, indigo palette, no text, white background`

4. **第 3 關 錯字修復** — `A small repair workshop where a character is fixing a broken wooden sign with tools, clean flat illustration, bright educational style, indigo and paper-blue palette, no text, white background`

5. **第 4 關 陌生字推理** — `A young explorer with a compass standing before a mysterious fog, faint symbols glowing in the distance, clean flat illustration, indigo palette, no text, white background`

6. **第 5 關 終極密碼** — `An ancient stone gate slowly opening, warm golden light streaming out, a small figure standing before it, clean flat illustration, indigo and gold palette, no text, white background`

7. **銅級徽章** — `A simple circular bronze medal badge with a magnifying glass icon in the center, clean flat illustration, no text, white background`

8. **銀級徽章** — `A simple circular silver medal badge with a brush pen icon in the center, clean flat illustration, no text, white background`

9. **金級徽章** — `A simple circular gold medal badge with a seal stamp icon in the center, clean flat illustration, no text, white background`

10. **結果頁背景裝飾** — `Subtle background pattern of faint square practice grids (Chinese tianzige) with soft dashed crosshairs, very light indigo on white, seamless, no text`

---

## 八、匯出的成績檔

在結果頁按「匯出結果 (.json)」，會下載一個檔案，內容像這樣：

```json
{
  "studentName": "王小明",
  "level": "middle",
  "mode": "postTest",
  "totalQuestions": 15,
  "correctCount": 12,
  "accuracy": 80,
  "skillStats": {
    "辨認": { "total": 4, "correct": 4 },
    "分類": { "total": 4, "correct": 3 },
    "應用": { "total": 4, "correct": 3 },
    "推理": { "total": 3, "correct": 2 }
  },
  "radicalMistakes": { "貝": 2, "頁": 1 },
  "answers": [
    { "id": "M-PT-001", "stage": "postTest", "skillType": "分類",
      "radical": "氵", "difficulty": "基礎", "chosen": "水或液體", "correct": true }
  ],
  "completedAt": "2026-07-09T02:30:00.000Z"
}
```

老師可以把全班的 `.json` 收集起來，用 Excel 或簡單的腳本統計「全班最常錯的部件」。

---

## 九、未來擴充方向

目前刻意做成**純靜態、無後端、無 API 金鑰**，這樣最好維護、最好部署，也不會有學生資料外流的疑慮。

如果之後真的需要，可以往這幾個方向：

- **成績自動回收** — 用 Google Apps Script 建一個 Web App 端點，把 `exportResult()` 產生的 JSON 用 `fetch` POST 到 Google Sheet。不需要金鑰，只要一個網址。
- **班級排行榜** — 同上，讀回 Sheet 的資料排序即可。
- **題目後台** — 把 `questions.js` 改成從 Google Sheet 讀 CSV，老師直接在試算表裡出題。
- **登入與個人歷程** — 這時候才需要 Firebase 之類的服務。除非真的要追蹤長期進步，否則不建議。

**建議順序：** 先讓學生用一學期，看看老師實際上想要什麼，再決定要不要加。

---

## 十、疑難排解

**打開後一片空白，什麼題目都沒有**
→ `questions.js` 大概有語法錯誤。在瀏覽器按 F12 打開主控台（Console）看紅色錯誤訊息，通常是少了逗號或引號沒關。也可以跑 §4.3 的檢查指令。

**新增的題目抽不到**
→ 檢查三件事：`level` 拼字是否為 `middle` / `upper`；`mode` 陣列裡有沒有包含你正在玩的模式；`stage` 是不是寫成字串 `"1"`（應該是數字 `1`，只有後測才用字串 `"postTest"`）。

**某一關題目變少了**
→ 那一關的題目不夠抽。程式會自動從同年級同模式的其他題目補上，不會當掉，但代表該關題庫需要補題。

**選項的正確答案位置會不會被學生背起來**
→ 不會。`answerIndex` 只是資料，實際顯示時每一題的選項順序都會重新打亂。

**字看起來不是楷體**
→ 遊戲用系統內建字體（標楷體 / BiauKai / KaiTi），沒有裝這些字體的裝置會退回其他中文字體。功能不受影響。若要強制統一，需另外引入字型檔（會讓檔案變大很多，不建議）。

**圖片沒有顯示**
→ 檢查 `assets/` 資料夾是否和 `index.html` 在同一層，以及檔名大小寫是否完全一致（Linux 伺服器區分大小寫）。

---

## 十一、給老師的一句話

這個遊戲最容易被誤用的方式，是讓學生一直刷題、追求高分。

它真正的價值在**答錯的那一瞬間**——當學生選錯，看見「你被右邊的聲旁騙走了」這句提示，然後回頭重看那個部件。那一刻才是識字策略真正建立的時候。

所以：**不要跳過解析。** 寧可十題慢慢看完，也不要三十題快速刷過。
