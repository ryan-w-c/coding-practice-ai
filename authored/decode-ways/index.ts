/**
 * Decode Ways - Medium
 *
 * https://leetcode.com/problems/decode-ways/
 */

export function numDecodings(s: string): number {
  if (s[0] === "0") return 0;
  let prev = 1, cur = 1; // ways for i-2 / i-1
  for (let i = 1; i < s.length; i++) {
    let ways = 0;
    if (s[i] !== "0") ways += cur;
    const two = Number(s.slice(i - 1, i + 1));
    if (two >= 10 && two <= 26) ways += prev;
    prev = cur;
    cur = ways;
  }
  return cur;
}
