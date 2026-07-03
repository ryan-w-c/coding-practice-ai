/**
 * Balanced Binary Tree - Easy
 *
 * https://neetcode.io/problems/balanced-binary-tree
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

export function isBalanced(root: TreeNode | null): boolean {

    const checkHeight = (node: TreeNode | null): number => {
        if (!node) return 0

        const leftHeight = checkHeight(node.left);
        if (leftHeight === -1) return -1

        const rightHeight = checkHeight(node.right);
        if (rightHeight === -1) return -1

        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1
        }

        return Math.max(leftHeight, rightHeight) + 1
    }

    return checkHeight(root) !== -1
}
