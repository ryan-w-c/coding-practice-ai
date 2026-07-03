/**
 * Valid Binary Search Tree - Medium
 *
 * https://neetcode.io/problems/valid-binary-search-tree
 */

export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}



export function isValidBST(root: TreeNode | null): boolean {

    let prev: number | null = null

    /**
     * Helper function: inorder traversal to check if the tree is a valid BST.
     * 
     * Background:
     * - A Binary Search Tree (BST) is a tree in which:
     *   1. The left subtree of each node contains only nodes with values less than the node's value.
     *   2. The right subtree of each node contains only nodes with values greater than the node's value.
     *   3. Both left and right subtrees must also be BSTs.
     * 
     * - In an **inorder traversal** of a BST, nodes are visited in **strictly increasing** order.
     *   This means that if we traverse the tree using an inorder traversal and the node values do not
     *   strictly increase, then the tree is not a valid BST.
     * 
     * - The inorder traversal visits nodes in the order: **left subtree -> root -> right subtree**.
     *   Therefore, during this traversal, each node value must be greater than the value of the previously
     *   visited node (`prev`).
     * 
     * Logic:
     * - We use a variable `prev` to keep track of the value of the previously visited node during the inorder traversal.
     * - If at any point, the current node value is less than or equal to `prev`, the BST property is violated.
     */

    const inOrder = (node: TreeNode | null): boolean => {
        if (node === null) return true // If the node is null, return true, as an empty node does not violate BST properties

        // Step 1: Recursively traverse the left subtree
        if (!inOrder(node.left)) {
            return false
        }

        // Step 2: Check the current node's value against the previous node's value
        if (prev !== null && prev >= node.val) {
            return false
        }
        // Step 2.1 : Update `prev` to the current node's value
        prev = node.val

        // Step 3: Recursively traverse the right subtree and return
        return inOrder(node.right)
    }

    return inOrder(root)
}