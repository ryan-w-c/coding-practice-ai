import { describe, it, expect } from "bun:test";
import { TreeNode, invertTree } from "./index";

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

// Helper function to convert a binary tree to an array representation (level order)
function treeToArray(root: TreeNode | null): (number | null)[] {
    if (!root) {
        return [];
    }

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

    // Remove trailing null values for a more concise representation
    while (result[result.length - 1] === null) {
        result.pop();
    }

    return result;
}

describe("Invert a Binary Tree", () => {
    it("should invert a tree - Example 1", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([1, 3, 2, 7, 6, 5, 4]);
    });

    it("should invert a tree - Example 2", () => {
        const root = createBinaryTree([3, 2, 1]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([3, 1, 2]);
    });

    it("should handle an empty tree", () => {
        const root = createBinaryTree([]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([]);
    });

    it("should handle a single-node tree", () => {
        const root = createBinaryTree([1]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([1]);
    });

    it("should handle a tree with only left children", () => {
        const root = createBinaryTree([1, 2, null, 3]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([1, null, 2, null, 3]);
    });

    it("should handle a tree with only right children", () => {
        const root = createBinaryTree([1, null, 2, null, null, null, 3]);
        const invertedRoot = invertTree(root);
        expect(treeToArray(invertedRoot)).toEqual([1, 2, null, 3]);
    });
});
