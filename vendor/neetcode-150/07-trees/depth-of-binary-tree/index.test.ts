import { describe, it, expect } from "bun:test";
import { TreeNode, maxDepth } from "./index";

// Helper function to create a binary tree from an array representation
function createBinaryTree(arr: (number | null)[], index: number = 0): TreeNode | null {
    if (index >= arr.length || arr[index] === null) {
        return null;
    }

    const node = new TreeNode(arr[index]);
    node.left = createBinaryTree(arr, 2 * index + 1);
    node.right = createBinaryTree(arr, 2 * index + 2);
    return node;
}

describe("Depth of Binary Tree", () => {
    it("should return correct depth for Example 1", () => {
        const root = createBinaryTree([1, 2, 3, null, null, 4]);
        expect(maxDepth(root)).toBe(3);
    });

    it("should return 0 for an empty tree", () => {
        const root = createBinaryTree([]);
        expect(maxDepth(root)).toBe(0);
    });

    it("should return 1 for a single-node tree", () => {
        const root = createBinaryTree([1]);
        expect(maxDepth(root)).toBe(1);
    });

    it("should return correct depth for a left-heavy tree", () => {
        const root = createBinaryTree([1, 2, null, 3, null, null, null]);
        expect(maxDepth(root)).toBe(3);
    });

    it("should return correct depth for a right-heavy tree", () => {
        const root = createBinaryTree([1, null, 2, null, null, null, 3]);
        expect(maxDepth(root)).toBe(3);
    });

    it("should return correct depth for a balanced tree", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        expect(maxDepth(root)).toBe(3);
    });
});
