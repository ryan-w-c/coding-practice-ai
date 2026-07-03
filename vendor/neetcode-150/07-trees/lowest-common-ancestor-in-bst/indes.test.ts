import { describe, it, expect } from "bun:test";
import { TreeNode, lowestCommonAncestor } from "./index";

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

describe("Lowest Common Ancestor in Binary Search Tree", () => {
    it("should return 5 for Example 1", () => {
        const root = createBinaryTree([5, 3, 8, 1, 4, 7, 9, null, 2]);
        const p = new TreeNode(3);
        const q = new TreeNode(8);
        expect(lowestCommonAncestor(root, p, q)?.val).toBe(5);
    });

    it("should return 3 for Example 2", () => {
        const root = createBinaryTree([5, 3, 8, 1, 4, 7, 9, null, 2]);
        const p = new TreeNode(3);
        const q = new TreeNode(4);
        expect(lowestCommonAncestor(root, p, q)?.val).toBe(3);
    });

    it("should return 3 when both nodes are in left subtree", () => {
        const root = createBinaryTree([5, 3, 8, 1, 4, 7, 9, null, 2]);
        const p = new TreeNode(1);
        const q = new TreeNode(4);
        expect(lowestCommonAncestor(root, p, q)?.val).toBe(3);
    });

    it("should return 8 when nodes are in right subtree", () => {
        const root = createBinaryTree([5, 3, 8, 1, 4, 7, 9]);
        const p = new TreeNode(7);
        const q = new TreeNode(9);
        expect(lowestCommonAncestor(root, p, q)?.val).toBe(8);
    });

    it("should return 5 when p and q are 5 itself", () => {
        const root = createBinaryTree([5, 3, 8, 1, 4, 7, 9]);
        const p = new TreeNode(5);
        const q = new TreeNode(5);
        expect(lowestCommonAncestor(root, p, q)?.val).toBe(5);
    });
});
