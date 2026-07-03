/**
 * Anagram Groups - Medium
 *
 * https://neetcode.io/problems/anagram-groups
 */

export class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs: string[]): string[][] {
        const generateKey = (str: string) => {
            return str.split('').sort().join('')
        }

        const map = new Map<string, string[]>()

        strs.forEach((str) => {
            const key = generateKey(str)
            const list = map.get(key) ?? []
            list.push(str)
            map.set(key, list)
        })

        return Array.from(map.values())
    }
}
