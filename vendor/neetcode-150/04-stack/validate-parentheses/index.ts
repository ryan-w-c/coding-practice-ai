/**
 * Validate Parentheses - Easy
 *
 * https://neetcode.io/problems/validate-parentheses
 */

export function isValid(s: string): boolean {
    const stack = []
    const bracketPairs: Record<string, string> = {
        ')': '(',
        ']': '[',
        '}': '{',
    }

    const closeBrackets = Object.keys(bracketPairs)
    const openBrackets = Object.values(bracketPairs)

    for (let char of s) {
        if (openBrackets.includes(char)) {
            stack.push(char)
        } else if (closeBrackets.includes(char)) {
            if (stack.length === 0 || stack.pop() !== bracketPairs[char]) {
                return false
            }
        }
    }

    // Ensure no unclosed brackets remain
    return stack.length === 0
}
