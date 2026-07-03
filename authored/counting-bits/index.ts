/**
 * Counting Bits - Easy
 *
 * https://leetcode.com/problems/counting-bits/
 */

export function countBits(n: number): number[] {
  const out = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) out[i] = out[i >> 1] + (i & 1);
  return out;
}
