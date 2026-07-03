/**
 * Number of One Bits - Easy
 *
 * https://leetcode.com/problems/number-of-1-bits/
 */

export function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1; // clear the lowest set bit
    count++;
    n >>>= 0;
  }
  return count;
}
