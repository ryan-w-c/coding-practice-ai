/**
 * Is Anagram - Easy
 *
 * https://neetcode.io/problems/is-anagram
 */

export class Solution {
    /**
     * @param {string} s
     * @param {string} t
     * @return {boolean}
     */
    isAnagram(s: string, t: string): boolean {
        const map = new Map<string, number>()
        for (let char of s) {
            const count = map.get(char) || 0
            map.set(char, count + 1)
        }
        for (let char of t) {
            // if characters are different then return false
            if (!map.has(char)) { return false }
            // update count 
            const updatedCount = (map.get(char) || 0) - 1
            map.set(char, updatedCount)
            // clear when reach 0
            if (updatedCount === 0) { map.delete(char) }
        }
        return map.size === 0
    }
}
