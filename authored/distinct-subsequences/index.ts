/**
 * Distinct Subsequences - Hard
 *
 * https://leetcode.com/problems/distinct-subsequences/
 */

export function numDistinct(s: string, t: string): number {
  const n = t.length;
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  for (const c of s) {
    for (let j = n; j >= 1; j--) {
      if (t[j - 1] === c) dp[j] += dp[j - 1];
    }
  }
  return dp[n];
}
