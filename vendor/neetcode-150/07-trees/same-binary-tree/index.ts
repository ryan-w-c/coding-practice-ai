/**
 * Same Binary Tree - Easy
 *
 * https://neetcode.io/problems/same-binary-tree
 */

export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // Check edge case1: if both nodes are null, they are equivalent
    if (p === null && q === null) {
        return true;
    }

    // Check edge case2: if one of the nodes is null and the other is not, they are not equivalent
    if (p === null || q === null) {
        return false;
    }

    // Compare the value
    if (p.val !== q.val) {
        return false;
    }

    // Compare child nodes: Recursively compare the left and right child nodes of both trees
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
