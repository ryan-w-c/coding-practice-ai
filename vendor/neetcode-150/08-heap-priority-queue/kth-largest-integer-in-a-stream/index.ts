/**
 * Kth Largest Integer in a Stream - Medium
 *
 * https://neetcode.io/problems/kth-largest-integer-in-a-stream
 */

class KthLargest {
    private minHeap: number[] = []
    private k: number


    constructor(k: number, nums: number[]) {
        this.k = k
        //  add each number to the heap, maintaining its size
        for (let num of nums) {
            this.add(num)
        }
    }

    add(val: number): number {
        // add value to the heap
        this.minHeap.push(val)
        this.minHeap.sort((a, b) => a - b)

        // keep only the k largest elements
        if (this.minHeap.length > this.k) {
            this.minHeap.shift()
        }

        // the kth largest is now the smallest in the heap
        return this.minHeap[0]
    }
}

export { KthLargest };
