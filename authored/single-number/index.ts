/**
 * Single Number - Easy
 *
 * https://leetcode.com/problems/single-number/
 */

export function singleNumber(nums: number[]): number {
  let acc = 0;
  for (const n of nums) acc ^= n;
  return acc;
}
