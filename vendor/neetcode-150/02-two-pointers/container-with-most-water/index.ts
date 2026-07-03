/**
 * Max Water Container - Medium
 *
 * https://neetcode.io/problems/max-water-container
 */

export function maxArea(heights: number[]): number {

    let left = 0
    let right = heights.length - 1
    let maxArea = 0

    while (left < right) {
        const width = right - left;
        const minHeight = Math.min(heights[right], heights[left])
        const area = width * minHeight
        maxArea = Math.max(maxArea, area)

        // Move the pointer that has the shorter height
        if (heights[left] < heights[right]) {
            left++
        } else {
            right++
        }
    }

    return maxArea
}
