import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    const inserted: string[] = [];
    for (let ops = rng.int(15, 120); ops > 0; ops--) {
      const r = rng.next();
      if (r < 0.35 || !inserted.length) {
        const w = word(rng, 1, 10, "abc"); // tiny alphabet → prefix collisions
        inserted.push(w);
        steps.push({ method: "insert", args: [w] });
      } else if (r < 0.6) {
        // query around an inserted word: exact / prefix / extension
        const w = rng.pick(inserted);
        const q = rng.next() < 0.5 ? w.slice(0, rng.int(1, w.length)) : w + word(rng, 1, 3, "abc");
        steps.push({ method: rng.next() < 0.5 ? "search" : "startsWith", args: [q] });
      } else {
        steps.push({ method: rng.next() < 0.5 ? "search" : "startsWith", args: [word(rng, 1, 10, "abc")] });
      }
    }
    out.push({ name: `random ops #${i}`, steps });
  }
  return out;
}

export class bruteClass {
  private words: string[] = [];
  insert(w: string): void {
    this.words.push(w);
  }
  search(w: string): boolean {
    return this.words.includes(w);
  }
  startsWith(p: string): boolean {
    return this.words.some((w) => w.startsWith(p));
  }
}
