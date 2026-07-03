import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Patterns with their problems, ordered for the sidebar.
export async function GET() {
  const patterns = await prisma.pattern.findMany({
    orderBy: { order: "asc" },
    include: {
      problems: {
        orderBy: { title: "asc" },
        select: { id: true, title: true, difficulty: true, judged: true },
      },
    },
  });
  return NextResponse.json({ patterns });
}
