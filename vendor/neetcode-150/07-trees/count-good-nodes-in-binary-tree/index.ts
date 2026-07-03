/**
 * Count Good Nodes in Binary Tree - Medium
 *
 * https://neetcode.io/problems/count-good-nodes-in-binary-tree
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

export function goodNodes(root: TreeNode | null): number {

    const countGoodNodes = (node: TreeNode | null, maxSoFar: number) => {
        if (node === null) {
            return 0
        }

        let count = 0;

        if (node.val >= maxSoFar) {
            count = 1
        }

        maxSoFar = Math.max(maxSoFar, node.val)

        count += countGoodNodes(node.left, maxSoFar)
        count += countGoodNodes(node.right, maxSoFar);

        return count
    }


    return countGoodNodes(root, root!.val)
}
