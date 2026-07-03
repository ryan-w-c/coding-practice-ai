/**
 * Target Sum - Medium
 *
 * https://leetcode.com/problems/target-sum/
 */

export function findTargetSumWays(nums: number[], target: number): number {
  let counts = new Map<number, number>([[0, 1]]);
  for (const n of nums) {
    const next = new Map<number, number>();
    for (const [sum, ways] of counts) {
      next.set(sum + n, (next.get(sum + n) ?? 0) + ways);
      next.set(sum - n, (next.get(sum - n) ?? 0) + ways);
    }
    counts = next;
  }
  return counts.get(target) ?? 0;
}
