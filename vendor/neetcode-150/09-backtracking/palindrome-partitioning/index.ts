/**
 * Palindrome Partitioning - Medium
 *
 * https://neetcode.io/problems/palindrome-partitioning
 */

// Utility function to check if a substring is a palindrome
function isPalindrome(str: string, left: number, right: number): boolean {
    while (left < right) {
        if (str[left] !== str[right]) {
            return false
        }
        left++
        right--
    }
    return true
}


export function partition(s: string): string[][] {
    // Step 0: setup variables
    const res: string[][] = []
    const part: string[] = []

    function backtracking(startIdx: number) {
        // Step 1: base case if reach the end of the string,add the partition to the result
        if (startIdx >= s.length) {
            res.push([...part])
            return
        }
        // Step 2: iterate over possible and positions for the substring
        for (let i = startIdx; i < s.length; i++) {
            if (isPalindrome(s, startIdx, i)) {
                // 2.1 Add the palindrome substring to the current partition
                part.push(s.slice(startIdx, i + 1))
                // 2.2 Recursively call dfs for the next position
                backtracking(i + 1)
                // 2.3 Backtrack by removing the last substring
                part.pop()
            }
        }
    }
    // Step 3: Start DFS from the beginning of the string
    backtracking(0)
    return res
}
