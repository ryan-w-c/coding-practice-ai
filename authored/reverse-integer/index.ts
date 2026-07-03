/**
 * Reverse Integer - Medium
 *
 * https://leetcode.com/problems/reverse-integer/
 */

const INT_MAX = 2147483647;
const INT_MIN = -2147483648;

export function reverse(x: number): number {
  let out = 0;
  while (x !== 0) {
    const digit = x % 10 | 0;
    x = (x / 10) | 0;
    if (out > (INT_MAX - digit) / 10 || out < (INT_MIN - digit) / 10) return 0;
    out = out * 10 + digit;
  }
  return out;
}
