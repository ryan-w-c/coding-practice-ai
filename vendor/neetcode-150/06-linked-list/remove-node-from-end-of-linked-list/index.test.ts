import { removeNthFromEnd, ListNode } from './index';
import { describe, it, expect } from "bun:test";
// Helper function to create a linked list from an array
function createLinkedList(arr: number[]): ListNode | null {
    let dummyHead = new ListNode(0);
    let current = dummyHead;
    for (let num of arr) {
        current.next = new ListNode(num);
        current = current.next;
    }
    return dummyHead.next;
}

// Helper function to convert linked list to array for easy comparison
function linkedListToArray(head: ListNode | null): number[] {
    let result: number[] = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

describe('removeNthFromEnd', () => {
    it('should return [1, 2, 4] for head = [1, 2, 3, 4] and n = 2', () => {
        const head = createLinkedList([1, 2, 3, 4]);
        const result = removeNthFromEnd(head, 2);
        expect(linkedListToArray(result)).toEqual([1, 2, 4]);
    });

    it('should return [] for head = [5] and n = 1', () => {
        const head = createLinkedList([5]);
        const result = removeNthFromEnd(head, 1);
        expect(linkedListToArray(result)).toEqual([]);
    });

    it('should return [2] for head = [1, 2] and n = 2', () => {
        const head = createLinkedList([1, 2]);
        const result = removeNthFromEnd(head, 2);
        expect(linkedListToArray(result)).toEqual([2]);
    });

    it('should return [1, 2, 3, 5] for head = [1, 2, 3, 4, 5] and n = 2', () => {
        const head = createLinkedList([1, 2, 3, 4, 5]);
        const result = removeNthFromEnd(head, 2);
        expect(linkedListToArray(result)).toEqual([1, 2, 3, 5]);
    });
});
