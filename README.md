# 競馬予想まとめアプリ MVP

GitHubとVercelにそのまま載せられる、Next.js製の初期コードです。

## できること

- 中央競馬・地方競馬のサンプルレースをプルダウン選択
- 馬番・馬名・騎手ごとに、複数の予想元の印を横並び表示
- ◎数と総合点で比較
- Vercelで公開可能

## 最初にやること

### 1. GitHubでリポジトリ作成

リポジトリ名例：

```text
keiba-prediction-app
```

### 2. このファイル一式をGitHubにアップロード

GitHub画面で以下を選びます。

```text
Add file > Upload files
```

このフォルダ内のファイルをすべてドラッグ＆ドロップします。

### 3. Vercelで公開

Vercelで以下を選びます。

```text
Add New Project > GitHubのkeiba-prediction-appを選択 > Deploy
```

## ローカルで動かす場合

Node.jsを入れた後、以下を実行します。

```bash
npm install
npm run dev
```

ブラウザで開きます。

```text
http://localhost:3000
```

## データを変える場所

仮データはここにあります。

```text
lib/mock-data.ts
```

ここを編集すると、レース、馬、予想元、印を変更できます。

## 次に追加する予定

1. Supabase接続
2. CSVアップロード
3. レース・馬・予想データのDB保存
4. JRA-VANなど外部データ連携
