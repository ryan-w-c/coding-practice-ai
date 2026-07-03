/**
 * Three Integer Sum - Medium
 *
 * https://neetcode.io/problems/three-sum
 */

export function threeSum(nums: number[]): number[][] {
    const result = []
    nums.sort((a, b) => a - b)

    // [-1,  0,  1, 2, -1, -4 ]
    // [-4, -1, -1, 0,  1,  2 ]

    for (let i = 0; i < nums.length; i++) {
        // skip duplicates
        if (i > 0 && nums[i] === nums[i - 1]) { continue }

        let left = i + 1;
        let right = nums.length - 1;

        // search for all possibilities
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right]

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]])
                // skip  duplicates for right and left
                while (left < right && nums[left] === nums[left + 1]) left++
                while (left < right && nums[right] === nums[right - 1]) right--
                // move to next
                left++
                right++
            } else if (sum < 0) {
                left++
            } else {
                right--
            }
        }
    }
    return result;
}
