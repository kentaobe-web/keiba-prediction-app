# 予想まとめ小部ちゃん v0.3 — 差し替え手順

Vercel が落ちていた原因は、リポジトリに古い `components/Insights.tsx` が残っており、
`@/lib/mock-data` から存在しない `Race` / `consensusForHorse` / `sources` を import していたためです。
（ローカルの新しいコードとは無関係に、Git の古いファイルを Vercel がビルドして失敗していました）

以下の手順で、古いファイルを消してこの構成に完全に置き換えてください。

## 手順

1. この zip を解凍する。
2. リポジトリのルート（`.git` がある場所）で、まず古い/不要ファイルを削除する。

```bash
# Tailひとつでも残っていると別のエラーになるので、使っていない設定も消す
git rm -f --ignore-unmatch \
  components/Insights.tsx \
  tailwind.config.js tailwind.config.ts \
  postcss.config.js postcss.config.mjs postcss.config.cjs

# 念のため、追跡されている古いソースを一旦すべて外す（ファイル自体は次で上書き）
```

3. 解凍した `app/ components/ lib/ package.json tsconfig.json next.config.mjs`
   をリポジトリのルートに **上書きコピー** する。

4. lock ファイルを作り直して依存を揃える。

```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build   # ローカルで成功を確認
```

5. コミットして push。

```bash
git add -A
git status      # ← Insights.tsx が "deleted" になっているか必ず確認
git commit -m "fix: v0.3 build / stale Insights.tsx 削除・mock-data 整合"
git push
```

## 確認ポイント
- `git status` に `deleted: components/Insights.tsx` が出ていること（消えていないと再発します）
- リポジトリに `tailwind.config.*` / `postcss.config.*` が残っていないこと
- `components/` にあるのは `RaceSelector.tsx` `PredictionTable.tsx` `InsightCards.tsx` の3つだけ

含まれるファイル:
- app/layout.tsx, app/page.tsx, app/globals.css
- components/RaceSelector.tsx, components/PredictionTable.tsx, components/InsightCards.tsx
- lib/mock-data.ts, lib/analysis.ts
- package.json, tsconfig.json, next.config.mjs, .gitignore
