import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "予想まとめ小部ちゃん",
  description: "中央・地方競馬の予想を横断比較する個人用ダッシュボード"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
