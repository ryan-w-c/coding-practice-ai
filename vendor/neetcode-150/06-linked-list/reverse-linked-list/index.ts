/**
 * Reverse a Linked List - Easy
 *
 * https://neetcode.io/problems/reverse-linked-list
 */

class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

export function reverseList(head: ListNode | null): ListNode | null {
    let current = head
    let prev = null

    while (current) {
        const next = current.next // Save the next node
        current.next = prev // Reverse the pointer
        prev = current  // Move prev forward
        current = next // Move curr forward
    }
    // When current becomes null, prev will be pointing to the new head of the reversed list
    return prev
}

export { ListNode };
