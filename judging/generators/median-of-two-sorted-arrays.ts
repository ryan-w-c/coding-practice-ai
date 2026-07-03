import type { Rng } from "./_rng";

const sorted = (rng: Rng, n: number) => rng.ints(n, -10_000, 10_000).sort((a, b) => a - b);

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const m = rng.int(0, 200), n = rng.int(m === 0 ? 1 : 0, 200);
    out.push({ name: `random #${i} (${m}+${n})`, args: [sorted(rng, m), sorted(rng, n)] });
  }
  out.push({ name: "single elements", args: [[3], [7]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "1000+1000 (LC max)", args: [sorted(rng, 1000), sorted(rng, 1000)] }];
}

// merge and take the middle
export function brute(a: number[], b: number[]): number {
  const all = [...a, ...b].sort((x, y) => x - y);
  const n = all.length;
  return n % 2 === 1 ? all[n >> 1] : (all[n / 2 - 1] + all[n / 2]) / 2;
}
