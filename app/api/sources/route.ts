// app/api/sources/route.ts
//
// data/source-urls.json の読み書きAPI。
// GET  … 現在の登録URL一覧を返す
// PUT  … URL一覧を丸ごと保存する
//
// 注意: サーバーレス環境（Vercel等）ではファイルシステムが読み取り専用のため
// 書き込みが永続しない場合があります。そのためUI側は localStorage を主とし、
// このAPIは「初期値の読み込み」と「ローカル/自前サーバでの永続化」に使います。

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SourceUrlFile } from "@/lib/research-sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE_PATH = path.join(process.cwd(), "data", "source-urls.json");

async function readFile(): Promise<SourceUrlFile> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as SourceUrlFile;
    if (!Array.isArray(parsed.sources)) return { sources: [] };
    return parsed;
  } catch {
    return { sources: [] };
  }
}

export async function GET() {
  const data = await readFile();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  let body: SourceUrlFile;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || !Array.isArray(body.sources)) {
    return NextResponse.json({ error: "sources array required" }, { status: 400 });
  }
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    // 読み取り専用FSなど。UI側の localStorage を使ってもらう。
    return NextResponse.json(
      {
        ok: false,
        reason:
          "サーバーへの保存に失敗しました（読み取り専用環境の可能性）。ブラウザ内に保存されます。",
      },
      { status: 200 }
    );
  }
}
