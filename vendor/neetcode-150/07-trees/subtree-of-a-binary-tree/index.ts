/**
 * Subtree of a Binary Tree - Medium
 *
 * https://neetcode.io/problems/subtree-of-a-binary-tree
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

// Function to check if two binary trees are identical
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // 1. Edge cases: handle null nodes
    // 1.1 If both nodes are null, they are considered identical
    if (p === null && q === null) {
        return true;
    }

    // 1.2 If only one of the nodes is null, they are not identical
    if (p === null || q === null) {
        return false;
    }

    // 2. Value check: compare the values of the current nodes
    if (p.val !== q.val) {
        return false;
    }

    // 3. Recursive check: verify the left and right subtrees are identical
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// Function to check if subRoot is a subtree of root
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    // 1. Edge cases: handle null nodes
    // 1.1 If subRoot is null, it is a subtree of any tree
    if (subRoot === null) {
        return true;
    }

    // 1.2 If root is null and subRoot is not, subRoot cannot be a subtree
    if (root === null) {
        return false;
    }

    // 2. Match check: check if the current subtree matches subRoot
    if (isSameTree(root, subRoot)) {
        return true;
    }

    // 3. Recursive check: verify if subRoot is a subtree of the left or right subtree of root
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
