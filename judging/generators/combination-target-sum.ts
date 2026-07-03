import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const nums = rng.shuffle(sortedDistinct(rng, rng.int(1, 8), 2, 5));
    out.push({ name: `random #${i}`, args: [nums, rng.int(1, 35)] });
  }
  out.push({ name: "unreachable target", args: [[4, 6], 3] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "many small candidates target 30", args: [[2, 3, 5, 7, 11], 30] }];
}

// exhaustive DFS over counts
export function brute(candidates: number[], target: number): number[][] {
  const nums = [...candidates].sort((a, b) => a - b);
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number, rem: number) => {
    if (rem === 0) {
      out.push([...cur]);
      return;
    }
    for (let i = start; i < nums.length && nums[i] <= rem; i++) {
      cur.push(nums[i]);
      go(i, rem - nums[i]);
      cur.pop();
    }
  };
  go(0, target);
  return out;
}
