/**
 * Pow(x, n) - Medium
 *
 * https://leetcode.com/problems/powx-n/
 */

export function myPow(x: number, n: number): number {
  if (n === 0) return 1;
  let base = x;
  let exp = Math.abs(n);
  let out = 1;
  while (exp > 0) {
    if (exp % 2 === 1) out *= base;
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return n < 0 ? 1 / out : out;
}
