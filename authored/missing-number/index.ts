/**
 * Missing Number - Easy
 *
 * https://leetcode.com/problems/missing-number/
 */

export function missingNumber(nums: number[]): number {
  let acc = nums.length;
  for (let i = 0; i < nums.length; i++) acc ^= i ^ nums[i];
  return acc;
}
