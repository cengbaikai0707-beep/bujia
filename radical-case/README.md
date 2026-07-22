# 讀題偵探社：部首字族失竊案

給國小三、四年級使用的純前端識字遊戲，不需要安裝套件，也不依賴網路圖片。

教學主軸不是要求學生背下四百多個孤立字，而是：

1. 用部首縮小字義範圍。
2. 用青、包、交、艮、丁、果等共同部件延伸字族。
3. 把字放回句子驗證。
4. 主動輸入至少三個含指定部件的字。

## 檔案

```text
radical-case/
├── index.html       遊戲頁面
├── style.css        田字格、楷體、講義藍紙樣式
├── questions.js     98題＋43組案件資料庫
├── script.js        抽題、作答、輸入檢核、結案報告
└── README.md
```

直接開啟 `index.html` 即可遊玩。若瀏覽器限制本機檔案，請在資料夾上一層執行：

```bash
python3 -m http.server 8000
```

再開啟 `http://localhost:8000/radical-case/`。

## 五關

| 關卡 | 重點 |
|---|---|
| 部首情報室 | 理解部首常提示的意義範圍 |
| 字族追蹤室 | 同一部件換上不同部首，形成不同字義 |
| 情境鑑識室 | 根據句意選字 |
| 字量搜索區 | 主動輸入至少三個字 |
| 核心檔案庫 | 綜合字義、字族與例外 |

完整辦案每關抽6題，共30題；另有快速偵查12題、字量追緝20題、結案檢核20題。

## 接到讀題偵探社入口

把 `radical-case/` 放在網站根目錄，與 `reading/` 同層，然後在 `reading/index.html` 適合的位置加入：

```html
<a class="case-entry radical-case" href="../radical-case/index.html">
  <span class="case-stamp">字</span>
  <span class="case-copy">
    <small>新案件｜中年級</small>
    <strong>部首字族失竊案</strong>
    <span>部首字義 × 字族延伸 × 主動叫字</span>
  </span>
  <span class="case-go">接受委託 →</span>
</a>
```

入口卡片可沿用讀題偵探社原本的卡片 class；上面的 class 只是避免和既有命名衝突。

## 題庫維護

- `RADICAL_DOSSIER`：43組指定部件、功能說明與可接受例字。
- `QUESTION_BANK`：遊戲題目。
- `type:"input"`：主動輸入題；`accepted` 是自動核對答案庫，`minAnswers` 是最低有效字數。
- 不在答案庫中的字不會直接被判為錯字，結果會標示「請交由老師確認」。

部首只提供推測方向，不等於完整字義；青、包、交、艮等則明確標為字形部件，不把兩種功能混為一談。
