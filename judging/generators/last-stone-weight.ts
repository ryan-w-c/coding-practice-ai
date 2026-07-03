import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 60), 1, 1000)] });
  }
  out.push({ name: "single stone", args: [[5]] });
  out.push({ name: "all equal pairs to zero", args: [[4, 4, 4, 4]] });
  return out;
}

export function stress(rng: Rng) {
  // re-sorting the whole array every smash is O(n^2 log n)
  return [{ name: "n=50000 stones", args: [rng.ints(50_000, 1, 1000)] }];
}

export function brute(stones: number[]): number {
  const s = [...stones];
  while (s.length > 1) {
    s.sort((a, b) => a - b);
    const y = s.pop()!, x = s.pop()!;
    if (y !== x) s.push(y - x);
  }
  return s[0] ?? 0;
}
