import { addTwoNumbers, ListNode } from './index';
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

describe('addTwoNumbers', () => {
    it('should return [5, 7, 9] for l1 = [1, 2, 3] and l2 = [4, 5, 6]', () => {
        const l1 = createLinkedList([1, 2, 3]);
        const l2 = createLinkedList([4, 5, 6]);
        const result = addTwoNumbers(l1, l2);
        expect(linkedListToArray(result)).toEqual([5, 7, 9]);
    });

    it('should return [8, 1] for l1 = [9] and l2 = [9]', () => {
        const l1 = createLinkedList([9]);
        const l2 = createLinkedList([9]);
        const result = addTwoNumbers(l1, l2);
        expect(linkedListToArray(result)).toEqual([8, 1]);
    });

    it('should handle carry over correctly', () => {
        const l1 = createLinkedList([2, 4, 3]);
        const l2 = createLinkedList([5, 6, 4]);
        const result = addTwoNumbers(l1, l2);
        expect(linkedListToArray(result)).toEqual([7, 0, 8]);
    });

    it('should return [0] for l1 = [0] and l2 = [0]', () => {
        const l1 = createLinkedList([0]);
        const l2 = createLinkedList([0]);
        const result = addTwoNumbers(l1, l2);
        expect(linkedListToArray(result)).toEqual([0]);
    });

    it('should handle different lengths of linked lists', () => {
        const l1 = createLinkedList([1, 8]);
        const l2 = createLinkedList([0]);
        const result = addTwoNumbers(l1, l2);
        expect(linkedListToArray(result)).toEqual([1, 8]);
    });
});
