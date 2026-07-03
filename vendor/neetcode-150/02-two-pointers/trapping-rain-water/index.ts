/**
 * Trapping Rain Water - Hard
 *
 * https://neetcode.io/problems/trapping-rain-water
 */

export function trap(height: number[]): number {

    // Step1: init variables to trak 
    let left = 0, right = height.length - 1;
    let maxLeft = 0, maxRight = 0;
    let waterTrapped = 0;

    // Step2: traverse from both sides towards center, start from lower side  
    while (left <= right) {
        //  2.1 if left height is lower, work from left side
        if (height[left] < height[right]) {
            // if find new max left height
            if (height[left] >= maxLeft) {
                maxLeft = height[left]
            } else {
                // Update the water mount
                waterTrapped += maxLeft - height[left]
            }
            left++
        } else {
            // if find new max right height
            if (height[right] >= maxRight) {
                maxRight = height[right]
            } else {
                // Update the water mount
                waterTrapped += maxRight - height[right]
            }
            right--
        }
    }
    // Step 3: Return the total trapped water
    return waterTrapped
}