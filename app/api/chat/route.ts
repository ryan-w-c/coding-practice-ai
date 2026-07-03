import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chat history for a problem (oldest first), to restore the tutor panel.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const problemId = searchParams.get("problemId");
  if (!problemId) {
    return NextResponse.json({ messages: [] });
  }
  const messages = await prisma.chatMessage.findMany({
    where: { problemId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true, mode: true },
  });
  return NextResponse.json({ messages });
}
