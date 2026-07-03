import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    const added: string[] = [];
    for (let ops = rng.int(15, 100); ops > 0; ops--) {
      if (rng.next() < 0.4 || !added.length) {
        const w = word(rng, 1, 8, "abc");
        added.push(w);
        steps.push({ method: "addWord", args: [w] });
      } else {
        let q = rng.pick(added);
        if (rng.next() < 0.3) q = word(rng, 1, 8, "abc"); // unrelated
        // wildcard some positions
        const chars = [...q];
        for (let j = 0; j < chars.length; j++) if (rng.next() < 0.3) chars[j] = ".";
        steps.push({ method: "search", args: [chars.join("")] });
      }
    }
    out.push({ name: `random ops #${i}`, steps });
  }
  return out;
}

export class bruteClass {
  private words: string[] = [];
  addWord(w: string): void {
    this.words.push(w);
  }
  search(q: string): boolean {
    return this.words.some(
      (w) => w.length === q.length && [...q].every((c, i) => c === "." || c === w[i]),
    );
  }
}
