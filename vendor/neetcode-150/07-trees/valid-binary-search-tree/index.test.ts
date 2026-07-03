import { describe, it, expect } from "bun:test";
import { TreeNode, isValidBST } from "./index";

// Helper function to create a binary tree from an array representation
function createBinaryTree(arr: (number | null)[]): TreeNode | null {
    if (arr.length === 0) return null;

    const root = new TreeNode(arr[0] as number);
    const queue = [root];
    let index = 1;

    while (index < arr.length) {
        const current = queue.shift() as TreeNode;
        const leftValue = arr[index++];
        if (leftValue !== null) {
            current.left = new TreeNode(leftValue);
            queue.push(current.left);
        }
        if (index < arr.length) {
            const rightValue = arr[index++];
            if (rightValue !== null) {
                current.right = new TreeNode(rightValue);
                queue.push(current.right);
            }
        }
    }

    return root;
}

describe("Valid Binary Search Tree", () => {
    it("should return true for Example 1", () => {
        const root = createBinaryTree([2, 1, 3]);
        expect(isValidBST(root)).toBe(true);
    });

    it("should return false for Example 2", () => {
        const root = createBinaryTree([1, 2, 3]);
        expect(isValidBST(root)).toBe(false);
    });

    it("should return true for a single-node tree", () => {
        const root = createBinaryTree([1]);
        expect(isValidBST(root)).toBe(true);
    });

    it("should return false for a tree with an invalid left subtree", () => {
        const root = createBinaryTree([10, 15, 20]);
        expect(isValidBST(root)).toBe(false);
    });

    it("should return true for a balanced valid BST", () => {
        const root = createBinaryTree([5, 3, 7, 2, 4, 6, 8]);
        expect(isValidBST(root)).toBe(true);
    });

    it("should return false for a tree where the right child is smaller than the root", () => {
        const root = createBinaryTree([5, 1, 4, null, null, 3, 6]);
        expect(isValidBST(root)).toBe(false);
    });
});
