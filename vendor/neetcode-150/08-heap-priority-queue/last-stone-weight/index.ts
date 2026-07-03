/**
 * Last Stone Weight - Easy
 *
 * https://neetcode.io/problems/last-stone-weight
 */

export function lastStoneWeight(stones: number[]): number {
    while (stones.length > 0) {
        // return the only stone if there if only one stone left 
        if (stones.length === 1) return stones[0]

        // Step 1: sort 
        stones.sort((a, b) => a - b);

        const stone1 = stones.pop()! // The heaviest stone
        const stone2 = stones.pop()! // The second heaviest stone

        // Step 2: If the two stones have different weights, push the difference back
        if (stone1 !== stone2) {
            stones.push(stone1 - stone2)
        }
    }
    // if there is no stone left 
    return 0
}
