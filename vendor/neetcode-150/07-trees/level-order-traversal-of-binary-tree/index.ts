/**
 * Level Order Traversal of Binary Tree - Medium
 *
 * https://neetcode.io/problems/level-order-traversal
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

export function levelOrder(root: TreeNode | null): number[][] {
    const result: number[][] = []

    if (root === null) {
        return result
    }

    const queue: TreeNode[] = [root]

    while (queue.length > 0) {

        const levelSize = queue.length;
        const currentLevel: number[] = [];

        for (let i = 0; i < levelSize; i++) {

            const currentNode = queue.shift()!
            currentLevel.push(currentNode?.val!)

            if (currentNode.left) {
                queue.push(currentNode?.left)
            }

            if (currentNode.right) {
                queue.push(currentNode.right)
            }
        }

        result.push(currentLevel)
    }

    return result
}
