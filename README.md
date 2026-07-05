# 予想まとめ小部ちゃん v0.5

中央・地方競馬 予想集約ダッシュボード（個人利用）。
許可されたURLをUIから登録すると、汎用抽出で予想印を取得し予想表に反映します。

## 使い方
1. `npm install && npm run dev`
2. 画面上部でレースを選ぶ（開催日 / 中央・地方 / 競馬場 / レース）
3. 「URL設定」を開き、取得したいURLを登録
   - 予想元名を選び、URLを入力
   - URL内の {track} {raceNo} {raceName} は選択中レースの値に置換されます
   - CSVインポート/エクスポートで一括管理も可能
4. 「予想を探す」を押すと、登録URLを順に取得→抽出→表に反映
5. 取得結果・URL設定はブラウザ（localStorage）に保存され、次回自動復元
6. 「取得結果をクリア」で仮データに戻せます

## 取得対象URLの設定場所
- 初期値ファイル: `data/source-urls.json`（デフォルト空）
- 実運用の編集: 画面の「URL設定」UI（localStorage 保存が主）
- サーバ保存: `PUT /api/sources` が `data/source-urls.json` に書き込み
  （Vercel等の読み取り専用環境では書き込めないため localStorage を主にしています）

⚠️ 規約・robots.txt で自動取得が許可されたURLのみ登録してください。
ログイン必須・有料記事は登録しないでください。サイト固有スクレイピングは行いません。

## robots.txt 確認方法（自動）
取得前に `app/api/fetch-url` が対象オリジンの `/robots.txt` を取得し、
`User-agent: *` の `Disallow` に該当パスが含まれる場合は取得せず「取得不可（robots.txt により禁止）」を返します。
その他の安全弁: 8秒タイムアウト / 1.5MBサイズ上限 / HTMLのみ / ログイン・有料note簡易検知 /
直列取得 + 各アクセス間1.2秒待機。

## 抽出ロジック
`lib/extract.ts`（サイト非依存）。HTMLをタグ除去してテキスト化し、
印（◎○▲△☆、全角ゆらぎ正規化）を走査、前後文脈から馬番(1〜18)と
カタカナ馬名(3文字以上)を推定。馬番も馬名も取れない孤立印は誤検出として除外、重複排除。
抽出結果は「予想元名→表の列」「馬番/馬名→行」でマージして反映。

## 主なファイル
- data/source-urls.json         … 取得対象URLの初期設定（空）
- app/api/sources/route.ts      … URL設定の読み書き（GET/PUT）
- app/api/research/route.ts     … 登録URLを直列取得→抽出→返却
- app/api/fetch-url/route.ts    … 単一URL取得（robots/タイムアウト/ゲート検知）
- lib/extract.ts                … 汎用印抽出エンジン
- lib/research-sources.ts       … 型・キーワード生成・URL置換
- lib/analysis.ts               … ◎数・総合点・本命/穴/危険
- lib/mock-data.ts              … レースカタログ・15予想元・仮出馬表
- components/SourceManager.tsx  … URL追加/編集/削除 + CSV入出力
- components/RaceSelector.tsx / PredictionTable.tsx / InsightCards.tsx / ResearchStatus.tsx
