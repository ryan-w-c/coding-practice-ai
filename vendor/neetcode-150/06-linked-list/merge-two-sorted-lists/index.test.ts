import { describe, it, expect } from "bun:test";
import { mergeTwoLists, ListNode } from "./index";

function createLinkedList(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function linkedListToArray(list: ListNode | null): number[] {
    const arr: number[] = [];
    while (list !== null) {
        arr.push(list.val);
        list = list.next;
    }
    return arr;
}

describe("Merge Two Sorted Lists", () => {
    it("should merge two sorted lists correctly", () => {
        const list1 = createLinkedList([1, 2, 4]);
        const list2 = createLinkedList([1, 3, 4]);
        const mergedList = mergeTwoLists(list1, list2);
        expect(linkedListToArray(mergedList)).toEqual([1, 1, 2, 3, 4, 4]);
    });

    it("should handle empty lists", () => {
        const list1 = createLinkedList([]);
        const list2 = createLinkedList([]);
        const mergedList = mergeTwoLists(list1, list2);
        expect(linkedListToArray(mergedList)).toEqual([]);
    });

    it("should handle one empty list and one non-empty list", () => {
        const list1 = createLinkedList([]);
        const list2 = createLinkedList([0]);
        const mergedList = mergeTwoLists(list1, list2);
        expect(linkedListToArray(mergedList)).toEqual([0]);
    });

    it("should handle two lists where all elements are the same", () => {
        const list1 = createLinkedList([2, 2, 2]);
        const list2 = createLinkedList([2, 2, 2]);
        const mergedList = mergeTwoLists(list1, list2);
        expect(linkedListToArray(mergedList)).toEqual([2, 2, 2, 2, 2, 2]);
    });
});
