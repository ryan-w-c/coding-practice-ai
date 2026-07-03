/**
 * Eating Bananas - Medium
 *
 * https://neetcode.io/problems/eating-bananas
 */

export function minEatingSpeed(piles: number[], h: number): number {
    const canFinish = (k: number) => {
        let hours = 0
        for (let pile of piles) {
            hours += Math.ceil(pile / k)
        }
        return hours <= h
    }

    let left = 1;
    let right = Math.max(...piles)

    while (left < right) {

        const mid = Math.floor((left + right) / 2)

        if (canFinish(mid)) {
            // keep mid value and search left part for smaller k value
            right = mid
        } else {
            left = mid + 1
        }

    }

    return left
}
