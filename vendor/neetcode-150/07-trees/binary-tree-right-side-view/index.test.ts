import { describe, it, expect } from "bun:test";
import { TreeNode, rightSideView } from "./index";

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

describe("Binary Tree Right Side View", () => {
    it("should return [1, 3] for Example 1", () => {
        const root = createBinaryTree([1, 2, 3]);
        expect(rightSideView(root)).toEqual([1, 3]);
    });

    it("should return [1, 3, 7] for Example 2", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        expect(rightSideView(root)).toEqual([1, 3, 7]);
    });

    it("should return [] for an empty tree", () => {
        const root = createBinaryTree([]);
        expect(rightSideView(root)).toEqual([]);
    });

    it("should return [1] for a tree with only one node", () => {
        const root = createBinaryTree([1]);
        expect(rightSideView(root)).toEqual([1]);
    });

    it("should return [1, 3, 6] for a tree with mixed children", () => {
        const root = createBinaryTree([1, 2, 3, null, 5, null, 6]);
        expect(rightSideView(root)).toEqual([1, 3, 6]);
    });
});
