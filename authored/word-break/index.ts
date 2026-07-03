/**
 * Word Break - Medium
 *
 * https://leetcode.com/problems/word-break/
 */

export function wordBreak(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const maxLen = Math.max(...wordDict.map((w) => w.length));
  const dp = new Array<boolean>(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = Math.max(0, i - maxLen); j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}
