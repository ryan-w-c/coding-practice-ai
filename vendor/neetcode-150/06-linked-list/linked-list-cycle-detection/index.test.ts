import { describe, it, expect } from "bun:test";
import { hasCycle, ListNode } from "./index";

// Helper function to create a linked list with a cycle
function createLinkedListWithCycle(values: number[], pos: number): ListNode {
    const nodes = values.map(val => new ListNode(val));
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    if (pos !== -1) {
        nodes[nodes.length - 1].next = nodes[pos];
    }

    return nodes[0];
}

describe("Linked List Cycle Detection", () => {
    it("should return true for a linked list with a cycle", () => {
        const head = createLinkedListWithCycle([1, 2, 3, 4], 1);
        const result = hasCycle(head);
        expect(result).toBe(true);
    });

    it("should return false for a linked list without a cycle", () => {
        const head = createLinkedListWithCycle([1, 2], -1);
        const result = hasCycle(head);
        expect(result).toBe(false);
    });

    it("should return true for a linked list with a cycle to the first node", () => {
        const head = createLinkedListWithCycle([1, 2, 3], 0);
        const result = hasCycle(head);
        expect(result).toBe(true);
    });

    it("should return false for a single node with no cycle", () => {
        const head = new ListNode(1);
        const result = hasCycle(head);
        expect(result).toBe(false);
    });

    it("should return true for a single node that points to itself", () => {
        const head = new ListNode(1);
        head.next = head; // Create a cycle to itself
        const result = hasCycle(head);
        expect(result).toBe(true);
    });
});