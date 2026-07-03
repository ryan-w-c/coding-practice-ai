/**
 * Kth Smallest Integer in BST - Medium
 *
 * https://neetcode.io/problems/kth-smallest-integer-in-bst
 */

// Definition for a binary tree node.
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

export function kthSmallest(root: TreeNode | null, k: number): number {
    // Step1:  Set up variables for in-order traversal
    const stack = []
    let currentNode = root

    // Step2: perform in-order traverse the tree  
    while (currentNode || stack.length > 0) {

        // 2.1 Traverse left subtree by pushing node onto stack
        while (currentNode) {
            // push current node to the stack
            stack.push(currentNode);
            currentNode = currentNode.left
        }

        // 2.2 process the node on the top of the stack *
        currentNode = stack.pop()!
        k--;

        // 2.3 if k reachs 0, we have found the kth smallest tree node
        if (k === 0) {
            return currentNode.val
        }

        // 2.4 move to the right subtree
        currentNode = currentNode.right
    }

    // Step3: return 0 as a fallback
    return 0;
}


export { TreeNode };