import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [word(rng, 1, 12, "ab")] }); // tiny alphabet → many palindromes
  }
  out.push({ name: "all same char", args: ["aaaa"] });
  out.push({ name: "no multi-char palindromes", args: ["abcd"] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=14 all same char (8192 partitions)", args: ["a".repeat(14)] }];
}

// enumerate every cut mask
export function brute(s: string): string[][] {
  const isPal = (t: string) => t === [...t].reverse().join("");
  const out: string[][] = [];
  const n = s.length;
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    const parts: string[] = [];
    let start = 0;
    for (let i = 0; i < n; i++) {
      if (i === n - 1 || mask & (1 << i)) {
        parts.push(s.slice(start, i + 1));
        start = i + 1;
      }
    }
    if (parts.every(isPal)) out.push(parts);
  }
  return out;
}
