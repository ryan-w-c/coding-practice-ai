/**
 * Longest Common Subsequence - Medium
 *
 * https://neetcode.io/problems/longest-common-subsequence
 */

export function longestCommonSubsequence(text1: string, text2: string): number {
    const rows = text1.length;
    const cols = text2.length
    // step1: define state table
    const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0))

    // step2:  fill the table by state transition function
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            if (text1[r - 1] === text2[c - 1]) {
                dp[r][c] = dp[r - 1][c - 1] + 1
            } else {
                dp[r][c] = Math.max(
                    dp[r][c - 1],
                    dp[r - 1][c],
                )
            }
        }
    }

    // step3: return the result
    return dp[rows][cols]
}
