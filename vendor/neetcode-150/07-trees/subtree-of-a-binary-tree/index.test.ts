import { describe, it, expect } from "bun:test";
import { TreeNode, isSubtree } from "./index";

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


describe("Subtree of a Binary Tree", () => {
    it("should return true for Example 1", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5]);
        const subRoot = createBinaryTree([2, 4, 5]);
        expect(isSubtree(root, subRoot)).toBe(true);
    });

    it("should return false for Example 2", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, null, null, 6]);
        const subRoot = createBinaryTree([2, 4, 5]);
        expect(isSubtree(root, subRoot)).toBe(false);
    });

    it("should return true for the same tree", () => {
        const root = createBinaryTree([1, 2, 3]);
        const subRoot = createBinaryTree([1, 2, 3]);
        expect(isSubtree(root, subRoot)).toBe(true);
    });

    it("should return false for an empty subRoot and a non-empty root", () => {
        const root = createBinaryTree([1, 2, 3]);
        const subRoot = createBinaryTree([]);
        expect(isSubtree(root, subRoot)).toBe(true);
    });

    it("should return true for both empty root and subRoot", () => {
        const root = createBinaryTree([]);
        const subRoot = createBinaryTree([]);
        expect(isSubtree(root, subRoot)).toBe(true);
    });

    it("should handle a single-node tree", () => {
        const root = createBinaryTree([1]);
        const subRoot = createBinaryTree([1]);
        expect(isSubtree(root, subRoot)).toBe(true);
    });
});
