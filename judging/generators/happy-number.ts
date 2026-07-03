import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  const seen = new Set<number>();
  while (out.length < 14) {
    const n = rng.next() < 0.5 ? rng.int(1, 1000) : rng.int(1, 2_147_483_647);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push({ name: `n=${n}`, args: [n] });
  }
  return out;
}

// set-based cycle detection (ref uses Floyd)
export function brute(n: number): boolean {
  const seen = new Set<number>();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    let s = 0;
    while (n > 0) {
      const d = n % 10;
      s += d * d;
      n = Math.floor(n / 10);
    }
    n = s;
  }
  return n === 1;
}
