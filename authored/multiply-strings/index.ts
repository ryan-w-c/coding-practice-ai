/**
 * Multiply Strings - Medium
 *
 * https://leetcode.com/problems/multiply-strings/
 */

export function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";
  const m = num1.length, n = num2.length;
  const acc = new Array<number>(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const prod = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48) + acc[i + j + 1];
      acc[i + j + 1] = prod % 10;
      acc[i + j] += (prod / 10) | 0;
    }
  }
  const out = acc.join("").replace(/^0+/, "");
  return out;
}
