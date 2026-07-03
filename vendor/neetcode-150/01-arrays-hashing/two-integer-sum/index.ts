/**
 * Two Integer Sum - Easy
 *
 * https://neetcode.io/problems/two-integer-sum
 */

export class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    twoSum(nums: number[], target: number): number[] {
        const map = new Map<number, number>()
        for (let i = 0; i < nums.length; i++) {
            const current = nums[i]
            const gap = target - current
            if (map.has(gap)) {
                return [map.get(gap)!, i]
            } else {
                map.set(nums[i], i)
            }
        }
        return []
    }
}
