/**
 * Is Palindrome - Easy
 *
 * https://neetcode.io/problems/is-palindrome
 */

export function isPalindrome(s: string): boolean {
    const filterdString = s.replace(/[^A-Za-z0-9]/g, '').toLowerCase()

    let left = 0;
    let right = filterdString.length - 1;

    while (left < right) {
        if (filterdString[left] !== filterdString[right]) {
            return false
        }
        left++
        right--
    }
    return true;
}
