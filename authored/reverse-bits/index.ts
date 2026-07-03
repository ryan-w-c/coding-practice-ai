/**
 * Reverse Bits - Easy
 *
 * https://leetcode.com/problems/reverse-bits/
 */

export function reverseBits(n: number): number {
  let out = 0;
  for (let i = 0; i < 32; i++) {
    out = (out << 1) | (n & 1);
    n >>>= 1;
  }
  return out >>> 0;
}
