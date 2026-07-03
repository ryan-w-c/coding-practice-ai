import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  const seen = new Set<number>();
  while (out.length < 14) {
    const n = rng.next() < 0.5 ? rng.int(0, 255) : rng.int(0, 4_294_967_295);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push({ name: `n=${n}`, args: [n] });
  }
  return out;
}

export function brute(n: number): number {
  return [...(n >>> 0).toString(2)].filter((b) => b === "1").length;
}
