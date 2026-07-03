/**
 * Binary Tree from Preorder and Inorder Traversal - Medium
 *
 * https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal
 */

class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    // Step 1: Handle base case
    // 1.1 If there are no elements in preorder or inorder, return null (empty tree)
    if (!preorder.length || !inorder.length) {
        return null
    }

    // Step 2: Create root node 
    // 2.1 Root node is the first element in preorder
    const rootValue = preorder[0]
    const root = new TreeNode(rootValue)

    // Step3: Recursively build left and right subtrees
    // 3.1 find root idx in inorder lists
    const mid = inorder.indexOf(rootValue)

    // 3.2 Build the left subtree from the left part of preorder and inorder arrays
    root.left = buildTree(
        preorder.slice(1, mid + 1),  // Left subtree in preorder (skip root)
        inorder.slice(0, mid)        // Left subtree in inorder
    );

    // 3.3 Build the right subtree from the right part of preorder and inorder arrays
    root.right = buildTree(
        preorder.slice(mid + 1), // Right subtree in preorder
        inorder.slice(mid + 1)   // Right subtree in preorder
    )

    // Return the constructed root node
    return root
}

export { TreeNode };
