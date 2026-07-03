/**
 * Burst Balloons - Hard
 *
 * https://leetcode.com/problems/burst-balloons/
 */

export function maxCoins(nums: number[]): number {
  const a = [1, ...nums, 1];
  const n = a.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  // dp[l][r]: max coins bursting everything strictly between l and r
  for (let len = 2; len < n; len++) {
    for (let l = 0; l + len < n; l++) {
      const r = l + len;
      for (let k = l + 1; k < r; k++) {
        dp[l][r] = Math.max(dp[l][r], dp[l][k] + a[l] * a[k] * a[r] + dp[k][r]);
      }
    }
  }
  return dp[0][n - 1];
}
