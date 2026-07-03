/**
 * Binary Tree Diameter - Medium
 *
 * https://neetcode.io/problems/binary-tree-diameter
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

export function diameterOfBinaryTree(root: TreeNode | null): number {
    let diameter = 0;

    const depth = (root: TreeNode | null): number => {
        if (!root) return 0

        const rightDepth = depth(root.right)
        const leftDepth = depth(root.left)

        diameter = Math.max(diameter, rightDepth + leftDepth)

        return Math.max(rightDepth, leftDepth) + 1
    }

    depth(root)

    return diameter
}
