import { describe, it, expect } from "bun:test";
import { verticalOrder, TreeNode } from "./index";

// Helper function to create a TreeNode from an array (level order input)
function createBinaryTree(arr: (number | null)[]): TreeNode | null {
    if (arr.length === 0) return null;
    const root = new TreeNode(arr[0]!);
    const queue: TreeNode[] = [root];
    let i = 1;
    while (i < arr.length) {
        const current = queue.shift()!;
        if (arr[i] !== null) {
            current.left = new TreeNode(arr[i]!);
            queue.push(current.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            current.right = new TreeNode(arr[i]!);
            queue.push(current.right);
        }
        i++;
    }
    return root;
}

describe("Binary Tree Vertical Order Traversal", () => {
    it("should return the vertical order for a simple binary tree", () => {
        const root = createBinaryTree([3, 9, 20, null, null, 15, 7]);
        const result = verticalOrder(root);
        expect(result).toEqual([[9], [3, 15], [20], [7]]);
    });

    it("should return the vertical order for a complete binary tree", () => {
        const root = createBinaryTree([1, 2, 3, 4, 5, 6, 7]);
        const result = verticalOrder(root);
        expect(result).toEqual([[4], [2], [1, 5, 6], [3], [7]]);
    });

    it("should handle a single node tree", () => {
        const root = createBinaryTree([1]);
        const result = verticalOrder(root);
        expect(result).toEqual([[1]]);
    });

    it("should handle an empty tree", () => {
        const root = createBinaryTree([]);
        const result = verticalOrder(root);
        expect(result).toEqual([]);
    });

    it("should handle a skewed tree to the left", () => {
        const root = createBinaryTree([1, 2, null, 3, null, 4, null]);
        const result = verticalOrder(root);
        expect(result).toEqual([[3], [2], [1, 4]]);
    });

});
