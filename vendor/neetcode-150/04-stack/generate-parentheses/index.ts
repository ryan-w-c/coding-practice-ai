/**
 * Generate Parentheses - Medium
 *
 * https://neetcode.io/problems/generate-parentheses
 */

export function generateParenthesis(n: number): string[] {
    const result: string[] = []

    const backtrack = (current: string, open: number, close: number) => {
        if (current.length === 2 * n) {
            result.push(current)
        }

        if (open < n) {
            backtrack(current + '(', open + 1, close)
        }

        if (close < open) {
            backtrack(current + ')', open, close + 1)
        }

    }

    backtrack('', 0, 0)

    return result
}
   