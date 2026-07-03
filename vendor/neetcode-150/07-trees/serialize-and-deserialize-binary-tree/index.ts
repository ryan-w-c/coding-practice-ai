/**
 * Serialize and Deserialize Binary Tree - Hard
 *
 * https://neetcode.io/problems/serialize-and-deserialize-binary-tree
 */

class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

export class Codec {
    serialize(root: TreeNode | null): string {
        // Step 1: Handle edge case
        // 1.1 If the root is null, return an empty array representation "[]"
        if (!root) return "[]";

        // Step 2: Perform level-order traversal to serialize the tree
        const queue: (TreeNode | null)[] = [root];
        const result: (string | number)[] = [];

        while (queue.length > 0) {
            const node = queue.shift();

            // 2.1 Add current node's value to result or "null" if it's missing
            if (node) {
                result.push(node.val);
                queue.push(node.left);
                queue.push(node.right);
            } else {
                result.push("null");
            }
        }

        // Step 3: Remove unnecessary trailing "null" values
        // 3.1 Remove "null" values at the end of the result array
        while (result[result.length - 1] === "null") {
            result.pop();
        }

        // 3.2 Convert the result array to a string and return
        return "[" + result.join(",") + "]";
    }

    deserialize(data: string): TreeNode | null {
        // Step 1: Handle base case for an empty tree
        // 1.1 If data is "[]", return null indicating an empty tree
        if (data === "[]") return null;

        // Step 2: Parse data and create root node
        // 2.1 Remove brackets, split by commas to get node values
        const values = data.slice(1, -1).split(",");

        // 2.2 Initialize the root node and queue for level-order reconstruction
        const root = new TreeNode(parseInt(values[0]));
        const queue: TreeNode[] = [root];
        let i = 1; // Pointer for tracking values in the data array

        // Step 3: Rebuild tree using queue (level-order)
        while (queue.length > 0 && i < values.length) {
            const node = queue.shift(); // Process next node in the queue

            // 3.1 Build the left child
            if (values[i] !== "null") {
                node!.left = new TreeNode(parseInt(values[i]));;
                queue.push(node!.left);
            }
            i++;

            // 3.2 Build the right child (ensure there are values remaining)
            if (i < values.length && values[i] !== "null") {
                node!.right = new TreeNode(parseInt(values[i]));;
                queue.push(node!.right);
            }
            i++;
        }

        // Return the reconstructed root node
        return root;
    }
}

export { TreeNode };
