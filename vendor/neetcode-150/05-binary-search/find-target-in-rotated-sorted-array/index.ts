/**
 * Find Target in Rotated Sorted Array - Medium
 *
 * https://neetcode.io/problems/find-target-in-rotated-sorted-array
 */

export function search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        // Determine which side of the array is sorted
        if (nums[left] <= nums[mid]) {
            // If the left side is sorted
            if (nums[left] <= target && target < nums[mid]) {
                // Target is in the left sorted portion, move to the left side
                right = mid - 1;
            } else {
                // Target is not in the left sorted portion, move to the right side
                left = mid + 1;
            }
        } else {
            // If the right side is sorted
            if (nums[mid] < target && target <= nums[right]) {
                // Target is in the right sorted portion, move to the right side
                left = mid + 1;
            } else {
                // Target is not in the right sorted portion, move to the left side
                right = mid - 1;
            }
        }
    }

    return -1; // If the target is not found
}
