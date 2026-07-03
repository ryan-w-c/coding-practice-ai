import type { Rng } from "./_rng";

// segments of small values separated by zeros keep every prefix/suffix product
// inside 32 bits (the LC guarantee)
function input(rng: Rng, n: number): number[] {
  const out: number[] = [];
  let run = 0;
  while (out.length < n) {
    if (run >= 20 || rng.next() < 0.1) {
      out.push(0);
      run = 0;
    } else {
      out.push(rng.pick([-2, -1, -1, 1, 1, 2, 2, 3]));
      run++;
    }
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [input(rng, rng.int(1, 60))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 segmented", args: [input(rng, 100_000)] }];
}

// O(n^2) products
export function brute(nums: number[]): number {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let p = 1;
    for (let j = i; j < nums.length; j++) {
      p *= nums[j];
      best = Math.max(best, p);
    }
  }
  return best;
}
