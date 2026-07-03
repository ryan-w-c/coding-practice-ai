/**
 * Valid Parenthesis String - Medium
 *
 * https://neetcode.io/problems/valid-parenthesis-string
 */

export function checkValidString(s: string): boolean {
    let minOpen = 0;
    let maxOpen = 0;

    for (let char of s) {
        if (char === '(') {
            minOpen++;
            maxOpen++;
        } else if (char === ')') {
            minOpen--;
            maxOpen--;
        } else if (char === '*') {
            minOpen--; // Treat '*' as ')'
            maxOpen++; // Treat '*' as '('
        }

        // If minOpen falls below zero, it means we have unmatched ')'
        if (minOpen < 0) {
            minOpen = 0; // Reset it to zero, since '*' could potentially balance it out
        }

        // If maxOpen falls below zero, it means there's no way to match all ')' encountered so far
        if (maxOpen < 0) {
            return false;
        }
    }

    // Finally, minOpen must be zero for a valid string
    return minOpen === 0;
}
