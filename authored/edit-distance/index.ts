/**
 * Edit Distance - Medium
 *
 * https://leetcode.com/problems/edit-distance/
 */

export function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] =
        word1[i - 1] === word2[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}
