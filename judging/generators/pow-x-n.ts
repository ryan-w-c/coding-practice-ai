import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 500) {
    const x = Math.round((rng.next() * 3.6 + 0.4) * 100) / 100 * (rng.next() < 0.3 ? -1 : 1);
    const n = rng.int(-40, 40);
    const v = Math.pow(x, n);
    if (!Number.isFinite(v) || Math.abs(v) > 10_000 || Math.abs(v) < 1e-8) continue;
    out.push({ name: `x=${x} n=${n}`, args: [x, n] });
  }
  return out;
}

export function brute(x: number, n: number): number {
  return Math.pow(x, n);
}
