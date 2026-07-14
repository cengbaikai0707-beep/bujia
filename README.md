# 永齡學習偵探社

直接用瀏覽器開啟根目錄的 `index.html`，學生會先看到科目大廳，再選擇：

- `chinese/`：原版部件偵探社，題庫與邏輯保持獨立。
- `math/`：數感偵探社，包含四年級共學、基礎補強、進階延伸。

## 數學題庫

`math/math-questions.js` 目前共 90 題：三條路徑各 30 題；每條路徑均含位值、加減、乘法、除法、估算、應用六類。

題目欄位包含：`id`、`subject`、`path`、`mode`、`skillType`、`difficulty`、`question`、`options`、`answerIndex`、`explanation`、`correctFeedback`、`wrongHint`。

## 使用提醒

1. 請保留整個資料夾結構，不要只複製根目錄的 `index.html`。
2. 可直接離線開啟；若瀏覽器限制本機檔案，可用靜態網站服務開啟。
3. 國文與數學會分別匯出 JSON 成績檔，數學檔案含 `subject: "math"`。
4. 單一指定單元目前每條路徑有 5 題；混合練習可抽 10、15 或 20 題。
