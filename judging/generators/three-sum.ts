import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(3, 60);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -50, 50)] });
  }
  out.push({ name: "all zeros", args: [[0, 0, 0, 0]] });
  out.push({ name: "no solution (all positive)", args: [rng.ints(20, 1, 100)] });
  out.push({ name: "heavy duplicates", args: [rng.ints(40, -3, 3)] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^3) ≈ 6.4e10 steps at n=4000 → TLE; the O(n^2) two-pointer answer is fast.
  // Wide value range keeps the number of zero-sum triples (answer size) modest.
  return [{ name: "n=4000 wide value range", args: [rng.ints(4000, -200_000, 200_000)] }];
}

// O(n^3) with set-dedupe on sorted triples.
export function brute(nums: number[]): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] !== 0) continue;
        const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
        const key = t.join(",");
        if (!seen.has(key)) {
          seen.add(key);
          out.push(t);
        }
      }
  return out;
}
