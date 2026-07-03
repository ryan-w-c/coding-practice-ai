/**
 * Clone Graph - Medium
 *
 * https://neetcode.io/problems/clone-graph
 */

export class Node {
    val: number;
    neighbors: Node[];

    constructor(val?: number, neighbors?: Node[]) {
        this.val = val === undefined ? 0 : val;
        this.neighbors = neighbors === undefined ? [] : neighbors;
    }
}

export function cloneGraph(node: Node | null): Node | null {
    if (!node) return null

    const map = new Map()

    const dfs = (currentNode: Node | null) => {
        if (map.has(currentNode)) {
            return map.get(currentNode)
        }

        const clone = new Node(currentNode?.val)
        map.set(currentNode, clone)

        for (let neighbor of currentNode?.neighbors ?? []) {
            clone.neighbors.push(dfs(neighbor))
        }

        return clone
    }


    return dfs(node)
}
