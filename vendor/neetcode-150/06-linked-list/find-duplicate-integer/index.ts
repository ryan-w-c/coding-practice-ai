/**
 * Find Duplicate Integer - Medium
 *
 * https://neetcode.io/problems/find-duplicate-integer
 */

export function findDuplicate(nums: number[]): number {
    // init two pointer
    let slow = nums[0]
    let fast = nums[0]

    while (true) {

        slow = nums[slow] // move one step each time
        fast = nums[nums[fast]] // move two step each time

        if (slow === fast) {
            break
        }
    }

    // move slow back to the begginning
    slow = nums[0]

    while (slow !== fast) {
        slow = nums[slow] // move one step each time
        fast = nums[fast] // move one step each time
    }

    return slow
}
