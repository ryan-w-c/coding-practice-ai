import { describe, it, expect } from "bun:test";
import { TreeNode, isBalanced } from "./index";

// Helper function to create a binary tree from an array representation
function createBinaryTree(arr: (number | null)[]): TreeNode | null {
    if (arr.length === 0) return null;

    const root = new TreeNode(arr[0] as number);
    const queue = [root];
    let index = 1;

    while (index < arr.length) {
        // start from left to right
        const current = queue.shift() as TreeNode;
        const leftValue = arr[index++];
        if (leftValue !== null) {
            current.left = new TreeNode(leftValue);
            queue.push(current.left);
        }
        const rightValue = arr[index++];
        if (rightValue !== null) {
            current.right = new TreeNode(rightValue);
            queue.push(current.right);
        }
    }

    return root;
}


describe("Balanced Binary Tree", () => {
    it("should return true for Example 1", () => {
        const root = createBinaryTree([1, 2, 3, null, null, 4]);
        expect(isBalanced(root)).toBe(true);
    });

    it("should return false for Example 2", () => {
        const root = createBinaryTree([1, 2, 3, null, null, 4, null, 5]);
        expect(isBalanced(root)).toBe(false);
    });

    it("should return true for an empty tree", () => {
        const root = createBinaryTree([]);
        expect(isBalanced(root)).toBe(true);
    });

    it("should return true for a single-node tree", () => {
        const root = createBinaryTree([1]);
        expect(isBalanced(root)).toBe(true);
    });

    it("should return true for a balanced tree", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        expect(isBalanced(root)).toBe(true);
    });

    it("should return false for an unbalanced tree with deeper left side", () => {
        const root = createBinaryTree([1, 2, null, 3, null, 4, null, 5]);
        expect(isBalanced(root)).toBe(false);
    });
});
