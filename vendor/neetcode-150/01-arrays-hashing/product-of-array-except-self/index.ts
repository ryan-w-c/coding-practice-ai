/**
 * Products of Array Except Self - Medium
 *
 * https://neetcode.io/problems/product-of-array-except-self
 */

export function productExceptSelf(nums: number[]): number[] {
    const n = nums.length
    const output = Array.from({ length: n }, () => 1)

    // Compute prefix products
    let prefix = 1
    for (let i = 0; i < n; i++) {
        output[i] = prefix
        prefix *= nums[i]
    }

    // Compute suffix products and combine with prefix products
    let suffix = 1
    for (let i = n - 1; i >= 0; i--) {
        output[i] = suffix * output[i]
        suffix *= nums[i]
    }

    return output;
}
