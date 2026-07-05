import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "予想まとめ小部ちゃん",
  description: "中央・地方競馬 予想集約ダッシュボード",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
