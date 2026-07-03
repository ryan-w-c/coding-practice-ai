import { prisma } from "@/lib/db";
import {
  getAnthropic,
  buildSystemPrompt,
  TUTOR_MODEL,
  type TutorMode,
} from "@/lib/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.conversation) || body.conversation.length === 0) {
    return Response.json({ error: "Missing 'conversation'." }, { status: 400 });
  }

  const mode: TutorMode = body.mode ?? "chat";
  const conversation: Turn[] = body.conversation;
  const lastUser = [...conversation].reverse().find((t) => t.role === "user");

  const system = buildSystemPrompt(mode, {
    problem: body.problem ?? null,
    language: body.language,
    code: body.code,
    judge: body.judgeResult ?? null,
  });

  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropic = getAnthropic();
        const messageStream = anthropic.messages.stream({
          model: TUTOR_MODEL,
          max_tokens: 2048,
          system,
          messages: conversation.map((t) => ({
            role: t.role,
            content: t.content,
          })),
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "unknown error";
        const note = `\n\n[tutor error: ${msg}\nIf this is an auth error, set ANTHROPIC_API_KEY in .env.local and restart the dev server.]`;
        full += note;
        controller.enqueue(encoder.encode(note));
      } finally {
        controller.close();
        // Persist both sides (best-effort).
        try {
          if (lastUser) {
            await prisma.chatMessage.create({
              data: {
                problemId: body.problemId ?? null,
                role: "user",
                content: lastUser.content,
                mode,
              },
            });
          }
          if (full.trim() && !full.trimStart().startsWith("[tutor error:")) {
            await prisma.chatMessage.create({
              data: {
                problemId: body.problemId ?? null,
                role: "assistant",
                content: full,
                mode,
              },
            });
          }
        } catch {
          /* persistence is non-critical */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
