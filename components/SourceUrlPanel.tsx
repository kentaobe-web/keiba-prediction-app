"use client";

import type { PredictionSource, ScrapeResult } from "../lib/types";

type Props = {
  sources: PredictionSource[];
  urls: Record<string, string>;
  onChangeUrl: (sourceId: string, url: string) => void;
  onScrape: () => void;
  loading: boolean;
  results: ScrapeResult[];
};

export function SourceUrlPanel({ sources, urls, onChangeUrl, onScrape, loading, results }: Props) {
  return (
    <section className="url-card">
      <div className="url-card-head">
        <div>
          <h2>予想元URL登録</h2>
          <p>無料で閲覧できるページURLを貼り、取得ボタンを押すと印候補を自動抽出します。</p>
        </div>
        <button className="primary-button" onClick={onScrape} disabled={loading}>
          {loading ? "取得中..." : "URLから取得"}
        </button>
      </div>

      <div className="url-grid">
        {sources.map((source) => (
          <label key={source.id}>
            <span>{source.name}</span>
            <input
              value={urls[source.id] ?? ""}
              onChange={(event) => onChangeUrl(source.id, event.target.value)}
              placeholder="https://..."
            />
          </label>
        ))}
      </div>

      <div className="notice">
        個人利用向けです。有料記事、ログインが必要なページ、大量アクセスは禁止。取得できないサイトは手入力または個別ルール追加で対応します。
      </div>

      {results.length > 0 && (
        <div className="result-list">
          <h3>取得結果</h3>
          {results.map((result) => (
            <div className={result.ok ? "result ok" : "result ng"} key={result.sourceId}>
              <strong>{result.sourceName}</strong>
              <span>{result.message}</span>
              {result.pageTitle && <small>{result.pageTitle}</small>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
