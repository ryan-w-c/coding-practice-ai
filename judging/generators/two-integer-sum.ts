import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

function countPairs(a: number[], target: number): number {
  let c = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) c++;
  return c;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let made = 0, guard = 0;
  while (made < 10 && guard++ < 2000) {
    const n = rng.int(2, 150);
    const a = rng.ints(n, -1000, 1000);
    const i = rng.int(0, n - 2);
    const j = rng.int(i + 1, n - 1);
    const target = a[i] + a[j];
    if (countPairs(a, target) !== 1) continue; // exactly-one-solution guarantee
    out.push({ name: `random unique pair #${made} (n=${n})`, args: [a, target] });
    made++;
  }
  out.push({ name: "two elements", args: [[3, 9], 12] });
  out.push({ name: "negatives cancel", args: [[-7, 11, 2, 7], 0] });
  return out;
}

export function stress(rng: Rng) {
  // distinct values; target = the two largest, shuffled into random positions —
  // an O(n^2) index scan can't shortcut, the hash-map pass is instant
  const a = rng.shuffle(sortedDistinct(rng, 300_000, 1, 9));
  let m1 = -1, m2 = -1;
  for (const v of a) {
    if (v > m1) { m2 = m1; m1 = v; }
    else if (v > m2) m2 = v;
  }
  return [{ name: "n=300000 unique pair of the two largest", args: [a, m1 + m2] }];
}

export function brute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
}
