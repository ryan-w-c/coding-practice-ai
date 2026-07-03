/**
 * House Robber - Medium
 *
 * https://leetcode.com/problems/house-robber/
 */

export function rob(nums: number[]): number {
  let take = 0, skip = 0;
  for (const n of nums) {
    [take, skip] = [skip + n, Math.max(take, skip)];
  }
  return Math.max(take, skip);
}
