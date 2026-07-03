import { describe, test, expect } from "bun:test";
import { Codec, TreeNode } from './index';

// Helper function to convert array to tree for comparison
function arrayToTree(arr: (number | null)[]): TreeNode | null {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]!);
    const queue: (TreeNode | null)[] = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift()!;
        if (node !== null) {
            if (arr[i] !== null) {
                node.left = new TreeNode(arr[i]!);
                queue.push(node.left);
            }
            i++;
            if (i < arr.length && arr[i] !== null) {
                node.right = new TreeNode(arr[i]!);
                queue.push(node.right);
            }
            i++;
        }
    }
    return root;
}

// Helper function to convert tree to array (level order) for comparison
function treeToArray(root: TreeNode | null): (number | null)[] {
    const result: (number | null)[] = [];
    const queue: (TreeNode | null)[] = [root];
    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result[result.length - 1] === null) {
        result.pop();
    }
    return result;
}

describe("Codec - Serialize and Deserialize Binary Tree", () => {
    const codec = new Codec();

    test("Example 1", () => {
        const root = arrayToTree([1, 2, 3, null, null, 4, 5]);
        const serialized = codec.serialize(root);
        expect(serialized).toBe("[1,2,3,null,null,4,5]");
        const deserializedRoot = codec.deserialize(serialized);
        expect(treeToArray(deserializedRoot)).toEqual([1, 2, 3, null, null, 4, 5]);
    });

    test("Example 2", () => {
        const root = arrayToTree([]);
        const serialized = codec.serialize(root);
        expect(serialized).toBe("[]");
        const deserializedRoot = codec.deserialize(serialized);
        expect(treeToArray(deserializedRoot)).toEqual([]);
    });

    test("Single node tree", () => {
        const root = arrayToTree([1]);
        const serialized = codec.serialize(root);
        expect(serialized).toBe("[1]");
        const deserializedRoot = codec.deserialize(serialized);
        expect(treeToArray(deserializedRoot)).toEqual([1]);
    });

    test("Tree with multiple levels", () => {
        const root = arrayToTree([1, 2, 3, 4, 5, null, 7]);
        const serialized = codec.serialize(root);
        expect(serialized).toBe("[1,2,3,4,5,null,7]");
        const deserializedRoot = codec.deserialize(serialized);
        expect(treeToArray(deserializedRoot)).toEqual([1, 2, 3, 4, 5, null, 7]);
    });
});
