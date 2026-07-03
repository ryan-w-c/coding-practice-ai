/**
 * Longest Repeating Substring With Replacement - Medium
 *
 * https://neetcode.io/problems/longest-repeating-substring-with-replacement
 */

export function characterReplacement(s: string, k: number): number {
    let left = 0;
    let maxCount = 0;
    let maxLength = 0;

    const freqMap: Record<string, number> = {}

    for (let right = 0; right < s.length; right++) {
        const char = s[right]
        freqMap[char] = (freqMap[char] ?? 0) + 1;
        maxCount = Math.max(freqMap[char], maxCount)

        // move left when replace count is bigger than k
        if (right - left + 1 - maxCount > k) {
            const leftChar = s[left]
            freqMap[leftChar] -= 1
            left += 1
        }

        maxLength = Math.max(maxLength, right - left + 1)
    }

    return maxLength
}

