import { describe, test, expect } from "bun:test";
import { buildTree, TreeNode } from './index';

// Helper function to convert a binary tree to an array (level order traversal) for testing
function treeToArray(root: TreeNode | null): (number | null)[] {
    const result: (number | null)[] = [];
    const queue: (TreeNode | null)[] = [root];

    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }

    // Trim trailing null values
    while (result[result.length - 1] === null) {
        result.pop();
    }

    return result;
}

describe("Binary Tree from Preorder and Inorder Traversal", () => {
    test("Example 1", () => {
        const preorder = [1, 2, 3, 4];
        const inorder = [2, 1, 3, 4];
        const result = buildTree(preorder, inorder);
        expect(treeToArray(result)).toEqual([1, 2, 3, null, null, null, 4]);
    });

    test("Example 2", () => {
        const preorder = [1];
        const inorder = [1];
        const result = buildTree(preorder, inorder);
        expect(treeToArray(result)).toEqual([1]);
    });

    test("Larger Tree", () => {
        const preorder = [3, 9, 20, 15, 7];
        const inorder = [9, 3, 15, 20, 7];
        const result = buildTree(preorder, inorder);
        expect(treeToArray(result)).toEqual([3, 9, 20, null, null, 15, 7]);
    });
});
