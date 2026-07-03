import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const seen = new Set<number>();
  const out: { name: string; args: unknown[] }[] = [];
  while (out.length < 10) {
    const n = rng.int(0, 500);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push({ name: `n=${n}`, args: [n] });
  }
  return out;
}

export function stress(_rng: Rng) {
  return [{ name: "n=100000", args: [100_000] }];
}

export function brute(n: number): number[] {
  return Array.from({ length: n + 1 }, (_, i) =>
    [...i.toString(2)].filter((b) => b === "1").length);
}
