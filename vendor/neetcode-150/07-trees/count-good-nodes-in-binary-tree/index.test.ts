import { describe, it, expect } from "bun:test";
import { TreeNode, goodNodes } from "./index";

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

describe("Count Good Nodes in Binary Tree", () => {
    it("should return 3 for Example 1", () => {
        const root = createBinaryTree([2, 1, 1, 3, null, 1, 5]);
        expect(goodNodes(root)).toBe(3);
    });

    it("should return 4 for Example 2", () => {
        const root = createBinaryTree([1, 2, -1, 3, 4]);
        expect(goodNodes(root)).toBe(4);
    });

    it("should return 1 for a single node tree", () => {
        const root = createBinaryTree([5]);
        expect(goodNodes(root)).toBe(1);
    });

    it("should return 1 for a tree with decreasing values", () => {
        const root = createBinaryTree([5, 3, null, 2, 1]);
        expect(goodNodes(root)).toBe(1);
    });

    it("should return 3 for a tree with all same values", () => {
        const root = createBinaryTree([1, 1, 1]);
        expect(goodNodes(root)).toBe(3);
    });
});
