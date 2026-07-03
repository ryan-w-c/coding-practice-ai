/**
 * Kth Largest Element in an Array - Medium
 *
 * https://neetcode.io/problems/kth-largest-element-in-an-array
 */

export function findKthLargest(nums: number[], k: number): number {
    const minHeap: number[] = []

    for (let num of nums) {
        if (minHeap.length < k) {
            minHeap.push(num)
        } else if (minHeap[0] < num) {
            minHeap[0] = num
        }

        minHeap.sort((a, b) => a - b)
    }

    return minHeap[0]
}
