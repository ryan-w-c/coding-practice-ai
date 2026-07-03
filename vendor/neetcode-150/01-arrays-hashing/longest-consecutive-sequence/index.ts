/**
 * Longest Consecutive Sequence - Medium
 *
 * https://neetcode.io/problems/longest-consecutive-sequence
 */

export function longestConsecutive(nums: number[]): number {

    if (nums.length === 0) return 0

    let maxLength = 0
    const numSet = new Set(nums)

    for (let num of numSet) {
        if (numSet.has(num - 1)) {
            continue
        }

        let currentNum = num
        let currentLength = 0

        while (numSet.has(currentNum)) {
            currentLength += 1
            currentNum += 1
        }

        maxLength = Math.max(currentLength, maxLength)
    }


    return maxLength
}
