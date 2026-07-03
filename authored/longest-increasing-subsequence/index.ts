/**
 * Longest Increasing Subsequence - Medium
 *
 * https://leetcode.com/problems/longest-increasing-subsequence/
 */

export function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []; // tails[k] = smallest tail of an LIS of length k+1
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = n;
  }
  return tails.length;
}
