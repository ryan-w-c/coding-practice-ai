/**
 * Lowest Common Ancestor in Binary Search Tree - Easy
 *
 * https://neetcode.io/problems/lowest-common-ancestor-in-bst
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

export function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    // 1. Edge cases: handle if root is null
    // 1.1 If root is null, return null as there's no LCA possible
    if (root === null) {
        return null
    }

    // 2. BST properties: traverse based on value comparison
    // 2.1 If both p and q are greater than root, LCA must be in the right subtree
    if (q.val > root.val && p.val > root.val) {
        return lowestCommonAncestor(root.right, p, q)
    }
    // 2.2 If both p and q are less than root, LCA must be in the left subtree
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }

    // 3. LCA found: root is between p and q, or equal to one of them
    return root;
}
