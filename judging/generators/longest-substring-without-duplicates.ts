import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const alpha = rng.pick(["abc", "abcdef", "abcdefghijklmnopqrstuvwxyz", "ab0. "]);
    const n = rng.int(0, 150);
    out.push({ name: `random #${i} (n=${n}, |Σ|=${alpha.length})`, args: [rng.str(n, alpha)] });
  }
  out.push({ name: "empty string", args: [""] });
  out.push({ name: "all same char", args: ["aaaaaaaa"] });
  out.push({ name: "all distinct", args: ["abcdefghij"] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 lowercase", args: [rng.str(100_000, "abcdefghijklmnopqrstuvwxyz")] }];
}

// O(n^2) — extend from every start until a duplicate.
export function brute(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
