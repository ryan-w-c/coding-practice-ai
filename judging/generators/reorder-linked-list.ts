import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 300);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -1000, 1000)] });
  }
  return out;
}

export function stress(rng: Rng) {
  // walk-to-tail-per-step naive reordering is O(n^2)
  return [{ name: "n=100000", args: [rng.ints(100_000, -1000, 1000)] }];
}

export function brute(arr: number[]): number[] {
  const out: number[] = [];
  let l = 0, r = arr.length - 1;
  while (l < r) {
    out.push(arr[l++], arr[r--]);
  }
  if (l === r) out.push(arr[l]);
  return out;
}
