/**
 * Maximum Product Subarray - Medium
 *
 * https://leetcode.com/problems/maximum-product-subarray/
 */

export function maxProduct(nums: number[]): number {
  let best = nums[0];
  let hi = nums[0], lo = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    const cands = [n, hi * n, lo * n];
    hi = Math.max(...cands);
    lo = Math.min(...cands);
    best = Math.max(best, hi);
  }
  return best;
}
