/**
 * Binary Tree Maximum Path Sum - Hard
 *
 * https://neetcode.io/problems/binary-tree-maximum-path-sum
 */

class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

export function maxPathSum(root: TreeNode | null): number {
    // Step1: initialize the maxsum to track the maximum path sum
    let maxSum = Number.NEGATIVE_INFINITY;

    // Step2: define dfs helper function to traverse the tree
    const dfs = (node: TreeNode | null): number => {
        // 2.1 edge cases
        if (!node) return 0

        // 2.2 call recursively to calculate the max path sum for left and right subtrees
        // drop negative sums to zero since they decrease the path sum
        const leftMax = Math.max(dfs(node.left), 0);
        const rightMax = Math.max(dfs(node.right), 0);

        // 2.3 calculate the potential max path including current node as the root of the path
        const currentPathSum = node.val + leftMax + rightMax
        maxSum = Math.max(maxSum, currentPathSum)

        // 2.4 return max path sum can contribute to its parent node
        return node.val + Math.max(leftMax, rightMax)
    }

    // Step3: call dfs with root node and return the max sum 
    dfs(root)
    return maxSum;
}

export { TreeNode };
