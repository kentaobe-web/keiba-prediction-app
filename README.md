# 予想まとめ小部ちゃん v0.6

中央・地方競馬 予想集約ダッシュボード（個人利用）。
出馬表は「貼り付け取り込み」で実データに一致させ、予想印は登録URLから汎用抽出します。

## 出馬表の貼り付け取り込み（今回追加）
1. 出馬表ページで、馬番・馬名・騎手・人気・オッズが並んだ表部分を選択してコピー
2. アプリの「出馬表を貼り付けて取り込む」を開き、貼り付けて「解析」
3. プレビューを確認して「この出馬表を反映する」
4. 開催日・レース選択と合わせれば、日付/レース/出走馬が実データに一致します
5. 取り込んだ出馬表はブラウザ（localStorage）に保存、次回自動復元
   「出馬表を仮データに戻す」でリセット可

※ 自動巡回ではなく、あなたが取得した情報を手元で貼り付ける方式です。
   タブ区切り・スペース区切り・ヘッダ行混在・性齢/斤量列混在に対応。

## 予想印の取得（既存）
「URL設定」に規約・robots.txt で許可されたURLを登録 →「予想を探す」で
汎用抽出（◎○▲△☆）し、取れたものだけ表に反映。取得前に robots.txt を確認し、
禁止・失敗・印検出なしは明示。CSVインポート/エクスポート対応。

## 主なファイル
- lib/parse-racecard.ts        … 貼り付け出馬表の汎用パーサ（今回追加）
- components/RacecardImport.tsx … 貼り付けUI・プレビュー・反映（今回追加）
- lib/extract.ts               … 予想印の汎用抽出
- app/api/research・fetch-url・sources … 取得/robots確認/URL設定
- lib/analysis.ts / mock-data.ts
- components/RaceSelector / PredictionTable / InsightCards / ResearchStatus / SourceManager

## セットアップ
```bash
npm install
npm run build
npm run dev
```
