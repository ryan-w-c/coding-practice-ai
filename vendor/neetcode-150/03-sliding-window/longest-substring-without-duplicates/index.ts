/**
 * Longest Substring Without Duplicates - Medium
 *
 * https://neetcode.io/problems/longest-substring-without-duplicates
 */

export function lengthOfLongestSubstring(s: string): number {
    let maxLength = 0
    let left = 0
    let charIndexMap: Record<string, number> = {}

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        // Move the left pointer to the position after the last occurrence of the current character
        // if it exists in the map and is within the current window
        if (charIndexMap[char] !== undefined && charIndexMap[char] >= left) {
            left = charIndexMap[char] + 1
        }
        // update char index
        charIndexMap[char] = right

        // update max length
        const curentLength = right - left + 1
        maxLength = Math.max(maxLength, curentLength)
    }

    return maxLength
}
