/**
 * Linked List Cycle Detection - Easy
 *
 * https://neetcode.io/problems/linked-list-cycle-detection
 */

class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

export function hasCycle(head: ListNode | null): boolean {

    let slow = head
    let fast = head

    // loop end when fast node reach the end
    while (fast !== null && fast!.next !== null) {
        slow = slow!.next
        fast = fast!.next.next

        if (slow === fast) {
            return true
        }
    }

    return false
}

export { ListNode };