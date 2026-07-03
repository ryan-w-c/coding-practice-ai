import { describe, it, expect } from "bun:test";
import { cloneGraph, Node } from "./index";

// Helper function to create a graph from adjacency list
function createGraph(adjList: number[][]): Node | null {
    if (adjList.length === 0) return null;

    const nodes = adjList.map((_, idx) => new Node(idx + 1));
    for (let i = 0; i < adjList.length; i++) {
        nodes[i].neighbors = adjList[i].map(val => nodes[val - 1]);
    }

    return nodes[0];
}

// Helper function to convert a graph to adjacency list
function graphToAdjList(node: Node | null): number[][] {
    if (!node) return [];

    const adjList: number[][] = [];
    const map = new Map<Node, number>();
    const queue: Node[] = [node];
    let index = 0;

    map.set(node, index);
    adjList.push([]);

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentIndex = map.get(current)!;

        while (adjList.length <= currentIndex) {
            adjList.push([]);
        }

        for (let neighbor of current.neighbors) {
            if (!map.has(neighbor)) {
                index++;
                map.set(neighbor, index);
                queue.push(neighbor);
            }
            adjList[currentIndex].push(map.get(neighbor)! + 1);
        }
    }

    return adjList;
}

describe("Clone Graph", () => {
    it("should correctly clone a graph with multiple nodes", () => {
        const adjList = [[2], [1, 3], [2]];
        const originalGraph = createGraph(adjList);
        const clonedGraph = cloneGraph(originalGraph);
        expect(graphToAdjList(clonedGraph)).toEqual(adjList);
    });

    it("should return an empty graph if input is empty", () => {
        const adjList: number[][] = [];
        const originalGraph = createGraph(adjList);
        const clonedGraph = cloneGraph(originalGraph);
        expect(graphToAdjList(clonedGraph)).toEqual(adjList);
    });

    it("should handle a graph with a single node and no neighbors", () => {
        const adjList = [[]];
        const originalGraph = createGraph(adjList);
        const clonedGraph = cloneGraph(originalGraph);
        expect(graphToAdjList(clonedGraph)).toEqual(adjList);
    });
});
