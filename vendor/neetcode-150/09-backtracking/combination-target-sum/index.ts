/**
 * Combination Target Sum - Medium
 *
 * https://neetcode.io/problems/combination-target-sum
 */

export function combinationSum(nums: number[], target: number): number[][] {
    const result: number[][] = []
    
    // define the helper function
    function backtracking(currentCombo: number[], currentSum: number, startIdx: number) {
        // Step1: handle the base cases
        // 1.1 if currentSum equal the target, add the combination to the reuslt
        if (currentSum === target) {
            result.push([...currentCombo]) // add a copy to the result
        }

        // 1.2 if sum is greater than target stop explore further
        if (currentSum > target) {
            return
        }

        // Step 2: inter through the candidates
        for (let i = startIdx; i < nums.length; i++) {
            // 2.1 choose the current number and explore further
            currentCombo.push(nums[i])
            backtracking(currentCombo, currentSum + nums[i], i)

            // 2.2 give up current number and continue 
            currentCombo.pop()
        }
    }
    
    // Step3:  start the backtracking process from the begginning of the nums
    backtracking([], 0, 0)
    return result
}
