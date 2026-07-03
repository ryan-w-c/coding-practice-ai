import { NextResponse } from "next/server";
import { run } from "@/lib/executor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.code !== "string") {
    return NextResponse.json({ error: "Missing 'code'." }, { status: 400 });
  }
  const timeoutMs = Math.min(Math.max(Number(body.timeoutMs) || 10_000, 1_000), 30_000);
  const language =
    body.language === "python" || body.language === "javascript"
      ? body.language
      : "typescript";
  const result = await run({ code: body.code, stdin: body.stdin, language, timeoutMs });
  return NextResponse.json(result);
}
