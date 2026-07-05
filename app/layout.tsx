import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "競馬予想まとめダッシュボード",
  description: "個人利用向けの競馬予想まとめダッシュボード",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
