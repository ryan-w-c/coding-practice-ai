/**
 * Permutation String - Medium
 *
 * https://neetcode.io/problems/permutation-string
 */

export function checkInclusion(s1: string, s2: string): boolean {
    if (s1.length > s2.length) return false

    const s1Count = new Array(26).fill(0)
    const s2Count = new Array(26).fill(0)
    const charToIdx = (char: string) => char.charCodeAt(0) - 'a'.charCodeAt(0)

    const isMatch = () => {
        return s1Count.every((val, idx) => {
            return val === s2Count[idx]
        })
    }

    // init window
    for (let i = 0; i < s1.length; i++) {
        const index1 = charToIdx(s1[i])
        const index2 = charToIdx(s2[i])
        s1Count[index1]++
        s2Count[index2]++
    }

    // compare
    if (isMatch()) {
        return true
    }
    // move window

    for (let i = s1.length; i < s2.length; i++) {
        // deduct left char
        const leftIdx = charToIdx(s2[i - s1.length])
        s2Count[leftIdx]--
        // add right char
        const rightIdx = charToIdx(s2[i])
        s2Count[rightIdx]++
        // compare
        if (isMatch()) {
            return true
        }
    }

    return false;
}

