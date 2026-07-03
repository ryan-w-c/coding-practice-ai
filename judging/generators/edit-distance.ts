import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [word(rng, 0, 10, "abc"), word(rng, 0, 10, "abc")] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "1000x1000", args: [word(rng, 1000, 1000, "abcde"), word(rng, 1000, 1000, "abcde")] }];
}

// exhaustive recursion (cases keep strings short)
export function brute(a: string, b: string): number {
  const go = (i: number, j: number): number => {
    if (i === a.length) return b.length - j;
    if (j === b.length) return a.length - i;
    if (a[i] === b[j]) return go(i + 1, j + 1);
    return 1 + Math.min(go(i + 1, j + 1), go(i + 1, j), go(i, j + 1));
  };
  return go(0, 0);
}
