/**
 * Partition Equal Subset Sum - Medium
 *
 * https://leetcode.com/problems/partition-equal-subset-sum/
 */

export function canPartition(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 === 1) return false;
  const target = total / 2;
  const dp = new Array<boolean>(target + 1).fill(false);
  dp[0] = true;
  for (const n of nums) {
    for (let s = target; s >= n; s--) {
      if (dp[s - n]) dp[s] = true;
    }
  }
  return dp[target];
}
