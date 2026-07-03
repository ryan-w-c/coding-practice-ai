/**
 * Find Minimum in Rotated Sorted Array - Medium
 *
 * https://neetcode.io/problems/find-minimum-in-rotated-sorted-array
 */

export function findMin(nums: number[]): number {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // If the middle value is greater than the rightmost value,
        // the minimum value must be on the right side of mid (excluding mid itself).
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Otherwise, the minimum value could be on the left side, including mid.
            right = mid;
        }
    }

    // When the loop ends, left will be equal to right, pointing to the minimum value.
    return nums[left];
}
