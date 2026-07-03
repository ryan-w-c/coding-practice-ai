import { describe, it, expect } from "bun:test";
import { TreeNode, isSameTree } from "./index";

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

describe("Same Binary Tree", () => {
    it("should return true for Example 1", () => {
        const p = createBinaryTree([1, 2, 3]);
        const q = createBinaryTree([1, 2, 3]);
        expect(isSameTree(p, q)).toBe(true);
    });

    it("should return false for Example 2", () => {
        const p = createBinaryTree([4, 7]);
        const q = createBinaryTree([4, null, 7]);
        expect(isSameTree(p, q)).toBe(false);
    });

    it("should return false for Example 3", () => {
        const p = createBinaryTree([1, 2, 3]);
        const q = createBinaryTree([1, 3, 2]);
        expect(isSameTree(p, q)).toBe(false);
    });

    it("should return true for two empty trees", () => {
        const p = createBinaryTree([]);
        const q = createBinaryTree([]);
        expect(isSameTree(p, q)).toBe(true);
    });

    it("should return false for one empty tree and one non-empty tree", () => {
        const p = createBinaryTree([1]);
        const q = createBinaryTree([]);
        expect(isSameTree(p, q)).toBe(false);
    });
});
