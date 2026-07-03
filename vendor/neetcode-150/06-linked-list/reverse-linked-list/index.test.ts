import { describe, it, expect } from "bun:test";
import { reverseList, ListNode } from "./index";

// Helper function to create a linked list from an array
function createLinkedList(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// Helper function to convert a linked list to an array
function linkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

describe("Reverse Linked List", () => {
    it("should reverse a list with multiple nodes", () => {
        const list = createLinkedList([0, 1, 2, 3]);
        const reversedList = reverseList(list);
        expect(linkedListToArray(reversedList)).toEqual([3, 2, 1, 0]);
    });

    it("should return an empty list if the input is an empty list", () => {
        const list = createLinkedList([]);
        const reversedList = reverseList(list);
        expect(linkedListToArray(reversedList)).toEqual([]);
    });

    it("should reverse a list with one node", () => {
        const list = createLinkedList([7]);
        const reversedList = reverseList(list);
        expect(linkedListToArray(reversedList)).toEqual([7]);
    });

    it("should handle a large list correctly", () => {
        const arr = Array.from({ length: 1000 }, (_, i) => i);
        const list = createLinkedList(arr);
        const reversedList = reverseList(list);
        expect(linkedListToArray(reversedList)).toEqual(arr.reverse());
    });
});
