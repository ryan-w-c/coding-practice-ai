/**
 * Regular Expression Matching - Hard
 *
 * https://leetcode.com/problems/regular-expression-matching/
 */

export function isMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array<boolean>(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j++) dp[0][j] = p[j - 1] === "*" && dp[0][j - 2];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] =
          dp[i][j - 2] || // zero occurrences
          ((p[j - 2] === "." || p[j - 2] === s[i - 1]) && dp[i - 1][j]);
      } else {
        dp[i][j] = (p[j - 1] === "." || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}
