import { describe, it, expect } from "bun:test";
import { ListNode, copyRandomList } from "./index";

// Helper function to create a linked list with random pointers
function createLinkedList(values: number[], randomIndices: (number | null)[]): ListNode | null {
    if (values.length === 0) return null;

    const nodes = values.map(val => new ListNode(val));
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    for (let i = 0; i < randomIndices.length; i++) {
        if (randomIndices[i] !== null) {
            nodes[i].random = nodes[randomIndices[i]!];
        }
    }

    return nodes[0];
}

// Helper function to convert a linked list to an array representation for easier comparison
function linkedListToArray(head: ListNode | null): [number, number | null][] {
    const result: [number, number | null][] = [];
    const nodeToIndex = new Map<ListNode, number>();
    let current = head;
    let index = 0;

    while (current) {
        nodeToIndex.set(current, index);
        current = current.next;
        index++;
    }

    current = head;
    while (current) {
        const randomIndex = current.random ? nodeToIndex.get(current.random) ?? null : null;
        result.push([current.val, randomIndex]);
        current = current.next;
    }

    return result;
}

describe("Copy Linked List with Random Pointer", () => {
    it("should copy the linked list correctly - Example 1", () => {
        const head = createLinkedList([3, 7, 4, 5], [null, 3, 0, 1]);
        const copiedHead = copyRandomList(head);
        expect(linkedListToArray(copiedHead)).toEqual([[3, null], [7, 3], [4, 0], [5, 1]]);
    });

    it("should copy the linked list correctly - Example 2", () => {
        const head = createLinkedList([1, 2, 3], [null, 2, 2]);
        const copiedHead = copyRandomList(head);
        expect(linkedListToArray(copiedHead)).toEqual([[1, null], [2, 2], [3, 2]]);
    });

    it("should handle an empty list", () => {
        const head = createLinkedList([], []);
        const copiedHead = copyRandomList(head);
        expect(linkedListToArray(copiedHead)).toEqual([]);
    });

    it("should handle a single node with no random pointer", () => {
        const head = createLinkedList([1], [null]);
        const copiedHead = copyRandomList(head);
        expect(linkedListToArray(copiedHead)).toEqual([[1, null]]);
    });

    it("should handle a single node with a random pointer to itself", () => {
        const head = createLinkedList([1], [0]);
        const copiedHead = copyRandomList(head);
        expect(linkedListToArray(copiedHead)).toEqual([[1, 0]]);
    });
});
