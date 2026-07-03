
/**
 * Duplicate Integer - Easy
 *
 * https://neetcode.io/problems/duplicate-integer
 */


export class Solution {
    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums: number[]): boolean {
        const set = new Set()
        for (let num of nums) {
            if (set.has(num)) {
                return true
            } else {
                set.add(num)
            }
        }
        return false
    }
}