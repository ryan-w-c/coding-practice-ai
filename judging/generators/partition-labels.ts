import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const alpha = rng.pick(["abc", "abcdefgh", "abcdefghijklmnopqrstuvwxyz"]);
    out.push({ name: `random #${i}`, args: [word(rng, 1, 400, alpha)] });
  }
  return out;
}

// interval merging over first/last occurrence spans
export function brute(s: string): number[] {
  const spans = new Map<string, [number, number]>();
  for (let i = 0; i < s.length; i++) {
    const sp = spans.get(s[i]);
    if (sp) sp[1] = i;
    else spans.set(s[i], [i, i]);
  }
  const merged: [number, number][] = [];
  for (const [a, b] of [...spans.values()].sort((x, y) => x[0] - y[0])) {
    if (merged.length && a <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], b);
    } else merged.push([a, b]);
  }
  return merged.map(([a, b]) => b - a + 1);
}
