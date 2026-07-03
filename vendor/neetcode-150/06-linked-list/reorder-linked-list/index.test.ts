import { describe, it, expect } from "bun:test";
import { reorderList, ListNode } from "./index";

/**
 * Reorder Linked List - Medium
 * 
 * https://neetcode.io/problems/reorder-linked-list
 */

function createLinkedList(values: number[]): ListNode | null {
    if (values.length === 0) return null;

    let head = new ListNode(values[0]);
    let current = head;

    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }

    return head;
}

function convertLinkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;

    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

describe("Reorder Linked List", () => {
    it("should reorder the linked list for even length", () => {
        const head = createLinkedList([2, 4, 6, 8]);
        reorderList(head);
        expect(convertLinkedListToArray(head)).toEqual([2, 8, 4, 6]);
    });

    it("should reorder the linked list for odd length", () => {
        const head = createLinkedList([2, 4, 6, 8, 10]);
        reorderList(head);
        expect(convertLinkedListToArray(head)).toEqual([2, 10, 4, 8, 6]);
    });

    it("should handle a single element linked list", () => {
        const head = createLinkedList([5]);
        reorderList(head);
        expect(convertLinkedListToArray(head)).toEqual([5]);
    });

    it("should handle a two-element linked list", () => {
        const head = createLinkedList([1, 2]);
        reorderList(head);
        expect(convertLinkedListToArray(head)).toEqual([1, 2]);
    });

    it("should handle a three-element linked list", () => {
        const head = createLinkedList([1, 2, 3]);
        reorderList(head);
        expect(convertLinkedListToArray(head)).toEqual([1, 3, 2]);
    });
});
