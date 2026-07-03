import { describe, test, expect } from "bun:test";
import { maxPathSum, TreeNode } from './index';

// Helper function to convert an array to a binary tree (level order)
function arrayToTree(arr: (number | null)[]): TreeNode | null {
    if (arr.length === 0) return null;
    const root = new TreeNode(arr[0]!);
    const queue: (TreeNode | null)[] = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift()!;
        if (node !== null) {
            if (arr[i] !== null) {
                node.left = new TreeNode(arr[i]!);
                queue.push(node.left);
            }
            i++;
            if (i < arr.length && arr[i] !== null) {
                node.right = new TreeNode(arr[i]!);
                queue.push(node.right);
            }
            i++;
        }
    }
    return root;
}

describe("Binary Tree Maximum Path Sum", () => {
    test("Example 1", () => {
        const root = arrayToTree([1, 2, 3]);
        const result = maxPathSum(root);
        expect(result).toBe(6); // Path: 2 -> 1 -> 3
    });

    test("Example 2", () => {
        const root = arrayToTree([-15, 10, 20, null, null, 15, 5, -5]);
        const result = maxPathSum(root);
        expect(result).toBe(40); // Path: 15 -> 20 -> 5
    });

    test("Tree with only negative values", () => {
        const root = arrayToTree([-10, -20, -30]);
        const result = maxPathSum(root);
        expect(result).toBe(-10); // Max path includes only the root
    });

    test("Tree with mixed positive and negative values", () => {
        const root = arrayToTree([2, -1, 3]);
        const result = maxPathSum(root);
        expect(result).toBe(5); // Path: 2 -> 3
    });
});
