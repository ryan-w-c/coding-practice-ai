import { describe, test, expect } from "bun:test";
import { mergeKLists, ListNode } from './index';

function arrayToList(arr: number[]): ListNode | null {
    const dummy = new ListNode(0);
    let current = dummy;
    for (let val of arr) {
        current.next = new ListNode(val);
        current = current.next;
    }
    return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

describe("Merge K Sorted Linked Lists", () => {
    test("Example 1", () => {
        const lists = [
            arrayToList([1, 2, 4]),
            arrayToList([1, 3, 5]),
            arrayToList([3, 6])
        ];
        const result = mergeKLists(lists);
        expect(listToArray(result)).toEqual([1, 1, 2, 3, 3, 4, 5, 6]);
    });

    test("Example 2", () => {
        const lists: ListNode[] = [];
        const result = mergeKLists(lists);
        expect(listToArray(result)).toEqual([]);
    });

    test("Example 3", () => {
        const lists = [arrayToList([])];
        const result = mergeKLists(lists);
        expect(listToArray(result)).toEqual([]);
    });

    test("Single list", () => {
        const lists = [arrayToList([1, 2, 3])];
        const result = mergeKLists(lists);
        expect(listToArray(result)).toEqual([1, 2, 3]);
    });

    test("Multiple lists with duplicates", () => {
        const lists = [
            arrayToList([1, 3, 5]),
            arrayToList([1, 2, 6]),
            arrayToList([2, 3, 4])
        ];
        const result = mergeKLists(lists);
        expect(listToArray(result)).toEqual([1, 1, 2, 2, 3, 3, 4, 5, 6]);
    });
});
