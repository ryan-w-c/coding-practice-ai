import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const seen = new Set<number>();
  const out: { name: string; args: unknown[] }[] = [];
  while (out.length < 14) {
    // EVEN inputs only: the reversed value stays below 2^31, so Java's signed
    // int and Python's unsigned int agree
    const n = rng.int(0, 2_147_483_647) * 2;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push({ name: `n=${n}`, args: [n] });
  }
  return out;
}

export function brute(n: number): number {
  return parseInt([...(n >>> 0).toString(2).padStart(32, "0")].reverse().join(""), 2);
}
