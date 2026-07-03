/**
 * Binary Tree Right Side View - Medium
 *
 * https://neetcode.io/problems/binary-tree-right-side-view
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

export function rightSideView(root: TreeNode | null): number[] {
    // Step 1: Handle edge case
    // 1.1 If the root is null, return an empty array as there are no nodes to view
    if (root === null) {
        return [];
    }

    // Step 2: Initialize global variables
    // 2.1 Result array to store right side view nodes
    // 2.2 Queue to perform level-order traversal
    const result: number[] = [];
    const queue: TreeNode[] = [root];

    // Step 3: Traverse the tree level by level
    while (queue.length > 0) {
        const levelSize = queue.length;

        for (let i = 0; i < levelSize; i++) {
            // 3.1 Get current node from the front of the queue
            const currentNode = queue.shift()!;

            // 3.2 If this is the rightmost element at the current level, add it to the result
            if (i === levelSize - 1) {
                result.push(currentNode.val);
            }

            // 3.3 Add the left child to the queue if it exists
            if (currentNode.left) {
                queue.push(currentNode.left);
            }

            // 3.4 Add the right child to the queue if it exists
            if (currentNode.right) {
                queue.push(currentNode.right);
            }
        }
    }

    return result;
}
