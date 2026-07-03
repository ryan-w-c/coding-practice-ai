import { describe, test, expect } from "bun:test";
import { kthSmallest, TreeNode } from './index';

// Helper function to construct a binary search tree from array
function arrayToBST(arr: (number | null)[]): TreeNode | null {
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

describe("Kth Smallest Integer in BST", () => {
    test("Example 1", () => {
        const root = arrayToBST([2, 1, 3]);
        const result = kthSmallest(root, 1);
        expect(result).toBe(1);
    });

    test("Example 2", () => {
        const root = arrayToBST([4, 3, 5, 2, null]);
        const result = kthSmallest(root, 4);
        expect(result).toBe(5);
    });

    test("BST with only one node", () => {
        const root = arrayToBST([1]);
        const result = kthSmallest(root, 1);
        expect(result).toBe(1);
    });

    test("Larger BST example", () => {
        const root = arrayToBST([5, 3, 6, 2, 4, null, null, 1]);
        const result = kthSmallest(root, 3);
        expect(result).toBe(3);
    });
});
