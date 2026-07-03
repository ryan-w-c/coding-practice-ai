import { describe, it, expect } from "bun:test";
import { TreeNode, diameterOfBinaryTree } from "./index";

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


describe("Binary Tree Diameter", () => {
    it("should return correct diameter for Example 1", () => {
        const root = createBinaryTree([1, null, 2, 3, 4, 5]);
        expect(diameterOfBinaryTree(root)).toBe(3);
    });

    it("should return correct diameter for Example 2", () => {
        const root = createBinaryTree([1, 2, 3]);
        expect(diameterOfBinaryTree(root)).toBe(2);
    });

    it("should handle a single-node tree", () => {
        const root = createBinaryTree([1]);
        expect(diameterOfBinaryTree(root)).toBe(0);
    });

    it("should handle a tree with multiple levels", () => {
        const root = createBinaryTree([1, 2, null, 3, null, 4, null, 5]);
        expect(diameterOfBinaryTree(root)).toBe(4);
    });

    it("should handle a balanced tree", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        expect(diameterOfBinaryTree(root)).toBe(4);
    });
});
