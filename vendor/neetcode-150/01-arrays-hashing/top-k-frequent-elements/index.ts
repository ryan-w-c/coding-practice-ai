/**
 * Top K Frequent Elements - Medium
 *
 * https://neetcode.io/problems/top-k-frequent-elements
 */

export function topKFrequent(nums: number[], k: number): number[] {
    const freqMap = new Map<number, number>()

    for (let num of nums) {
        const freq = freqMap.get(num) ?? 0 + 1
        freqMap.set(num, freq);
    }

    return Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, k).map(([num]) => (num))
}
