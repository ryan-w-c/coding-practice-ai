// Remove Node From End of Linked List - Medium
// https://neetcode.io/problems/remove-node-from-end-of-linked-list

export class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}

export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // Create a dummy node that points to the head to simplify edge cases
    const dummy = new ListNode(0, head);
    let first: ListNode | null = dummy;
    let second: ListNode | null = dummy;

    // Step 1: Move the first pointer n + 1 steps ahead to create a gap of n nodes between first and second pointers
    for (let i = 0; i <= n; i++) {
        first = first!.next;
    }

    // Step 2: Move both first and second pointers until first reaches the end of the list
    while (first !== null) {
        first = first.next;
        second = second!.next;
    }

    // Step 3: Detach the nth node from the end by skipping it in the linked list
    if (second && second.next) {
        second.next = second.next.next;
    }

    // Return the updated list starting from dummy.next (head of the original list, potentially updated)
    return dummy.next;
}
