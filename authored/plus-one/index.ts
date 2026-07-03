/**
 * Plus One - Easy
 *
 * https://leetcode.com/problems/plus-one/
 */

export function plusOne(digits: number[]): number[] {
  const out = [...digits];
  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i] < 9) {
      out[i]++;
      return out;
    }
    out[i] = 0;
  }
  return [1, ...out];
}
