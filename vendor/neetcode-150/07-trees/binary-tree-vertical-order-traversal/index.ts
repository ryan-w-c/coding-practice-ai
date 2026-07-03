/**
 * Binary Tree Vertical Order Traversal - Medium
 *
 * https://neetcode.io/problems/binary-tree-vertical-order-traversal
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

export function verticalOrder(root: TreeNode | null): number[][] {
    if (root === null) return [];

    const columnTable: Map<number, number[]> = new Map();
    const queue: [TreeNode, number][] = [[root, 0]]; // Queue containing nodes and their corresponding column index

    let minColumn = 0;
    let maxColumn = 0;

    while (queue.length > 0) {
        const [node, column] = queue.shift()!;

        if (!columnTable.has(column)) {
            columnTable.set(column, []);
        }
        columnTable.get(column)!.push(node.val);

        if (node.left !== null) {
            queue.push([node.left, column - 1]);
            minColumn = Math.min(minColumn, column - 1);
        }

        if (node.right !== null) {
            queue.push([node.right, column + 1]);
            maxColumn = Math.max(maxColumn, column + 1);
        }
    }

    const result: number[][] = [];
    for (let i = minColumn; i <= maxColumn; i++) {
        result.push(columnTable.get(i)!);
    }

    return result;
}
