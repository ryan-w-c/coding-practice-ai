/**
 * Binary Search - Easy
 *
 * https://neetcode.io/problems/binary-search
 */
export function binarySearch(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1
    // need comparation when left and right are equal
    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        if (nums[mid] === target) {
            return mid
        } else if (nums[mid] > target) {
            // move search to left part
            right = mid - 1
        } else {
            // move search to right part
            left = mid + 1
        }
    }

    return -1; // target not found
}
