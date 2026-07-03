import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const seen = new Set<number>();
  const out: { name: string; args: unknown[] }[] = [];
  while (out.length < 10) {
    const n = rng.int(1, 25);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push({ name: `n=${n}`, args: [n] });
  }
  return out;
}

export function stress(_rng: Rng) {
  return [{ name: "n=45 (naive recursion explodes)", args: [45] }];
}

export function brute(n: number): number {
  return n <= 2 ? n : brute(n - 1) + brute(n - 2);
}
