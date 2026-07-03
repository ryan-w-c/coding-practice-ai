import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(1, 200);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -10_000, 10_000), rng.int(1, n)] });
  }
  return out;
}

export function stress(rng: Rng) {
  // O(nk) rescan TLEs at k=50000; the deque approach is O(n)
  return [{ name: "n=200000 k=50000", args: [rng.ints(200_000, -100_000, 100_000), 50_000] }];
}

export function brute(nums: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) out.push(Math.max(...nums.slice(i, i + k)));
  return out;
}
