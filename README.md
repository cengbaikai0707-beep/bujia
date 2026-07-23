# 永齡學習偵探社・學習大廳

一套給臺灣國小的純前端（HTML/CSS/JS）學習遊戲集合，**免安裝、免網路、可離線**，可直接放上 GitHub Pages 或用瀏覽器打開。

## 入口

**學習大廳：`hub.html`**（開這個檔案即可）。大廳連到五個學科入口：

| 入口 | 資料夾 | 內容 |
|---|---|---|
| 部件偵探社 | `chinese/` | 部件識字四種模式 |
| 數感偵探社 | `math/` | 數感與應用題題庫 |
| 讀題偵探社 | `reading/` | 讀題診斷 96 題＋偵探幣／道具商店／信心押注／陷阱怪圖鑑 |
| 同樂會零食大盜 | `party/` | 故事闖關＋線索碎片合成＋舉證對質 |
| 部件大亂鬥・文字勇者 | `battle/` | 部件延伸練習＋Boss 闖關 |

> `index.html`（根目錄）是「讀題偵探社：部首字族失竊案」單一遊戲，屬獨立模組，保留可單獨開啟。日常請由 `hub.html` 進入。

## 打開方式

直接用瀏覽器打開 `hub.html` 即可。若瀏覽器對本機檔案較嚴格，可在此資料夾執行：

```bash
python3 -m http.server 8000
# 再開啟 http://localhost:8000/hub.html
```

## 技術

- 無外部框架、無 CDN、無線上字型、無網路圖片；離線可用。
- `detective-system.js`（根目錄）是**全站共用的偵探幣系統**：reading 與 party 共用同一個錢包，道具商店在 reading。
- 各模組資料與引擎分離（例如 `battle/component-data.js`、`battle/question-data.js` 與 `battle/script.js`）。
- 字形以 `標楷體` 呈現。
