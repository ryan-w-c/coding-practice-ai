
/**
 * Reorder Linked List - Medium
 *
 * https://neetcode.io/problems/reorder-linked-list
 */

export class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

export function reorderList(head: ListNode | null): void {

    if (head === null || head.next === null) return

    // Step 1: Find the middle of the linked list using slow and fast pointers
    let slow: ListNode | null = head
    let fast: ListNode | null = head

    while (fast !== null && fast.next !== null) {
        slow = slow!.next // Slow pointer moves one step at a time.
        fast = fast.next.next // Fast pointer moves two steps at a time.
    }

    // Step 2: Reverse the second half of the linked list
    let prev: ListNode | null = null
    let current: ListNode | null = slow

    while (current) {
        const next = current.next as ListNode; // Store the next node temporarily.
        current.next = prev // Reverse the link.
        // Move forward
        prev = current
        current = next
    }

    // After reversing, `prev` becomes the new head of the reversed second half.

    // Step 3: Merge the two halves
    let first = head;
    let second = prev

    // The second list node is the head of the second half of the linked list.
    // It can be used to control the while loop for merging the two halves.
    while (second && second.next) {
        const temp1 = first.next
        const temp2 = second.next

        first.next = second
        second.next = temp1

        first = temp1!
        second = temp2
    }

}
