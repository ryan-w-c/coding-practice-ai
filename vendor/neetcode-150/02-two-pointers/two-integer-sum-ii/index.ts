/**
 * Two Integer Sum II - Medium
 *
 * https://neetcode.io/problems/two-integer-sum-ii
 */

export function twoSum(numbers: number[], target: number): number[] {
    let left = 0
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            return [left + 1, right + 1]
        } else if (sum < target) {
            left++
        } else {
            right--
        }
    }

    return []; // This line should never be reached due to the assumption that there is always a valid solution
}
