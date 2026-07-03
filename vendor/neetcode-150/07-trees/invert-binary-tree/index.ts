
/**
 * Invert a Binary Tree - Easy
 *
 * https://neetcode.io/problems/invert-binary-tree
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

export function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return root

    // Store the reference to the current left subtree
    const left = root.left

    // Recursively invert the right subtree and assign it to the left child of the current root
    root.left = invertTree(root.right)
    // Recursively invert the stored left subtree and assign it to the right child of the current root
    root.right = invertTree(left)

    return root;
}
