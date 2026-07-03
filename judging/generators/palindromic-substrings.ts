import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [word(rng, 1, 40, "ab")] });
  }
  out.push({ name: "all same char", args: ["aaaaa"] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^3) substring-check counting TLEs; center expansion is O(n^2)
  return [{ name: "n=5000 binary alphabet", args: [word(rng, 5000, 5000, "ab")] }];
}

export function brute(s: string): number {
  const isPal = (t: string) => t === [...t].reverse().join("");
  let count = 0;
  for (let i = 0; i < s.length; i++)
    for (let j = i + 1; j <= s.length; j++) if (isPal(s.slice(i, j))) count++;
  return count;
}
