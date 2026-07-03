/**
 * Copy Linked List with Random Pointer - Medium
 *
 * https://neetcode.io/problems/copy-linked-list-with-random-pointer
 */

export class ListNode {
    val: number;
    next: ListNode | null;
    random: ListNode | null;

    constructor(val?: number, next?: ListNode | null, random?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
        this.random = random === undefined ? null : random;
    }
}
export function copyRandomList(head: ListNode | null): ListNode | null {
    if (!head) return null;

    let current: ListNode | null = head;
    // The list structure transforms as follows:
    // Before: [A] -> [B] -> [C]
    // After:  [A] -> [A'] -> [B] -> [B'] -> [C] -> [C']
    // Where 'A', 'B', 'C' are original nodes, and 'A'', 'B'', 'C'' are their respective copies.
    while (current) {
        const copy: ListNode = new ListNode(current.val, current.next);
        current.next = copy;
        // Move fwd
        current = copy.next;
    }

    // Step 2: Assign random pointers for the copied nodes
    current = head;
    while (current) {
        if (current.random) {
            // The copied node is current.next.
            // Set the random pointer of the copied node (current.next)
            // to point to the copy of the node that current.random points to(current.random.next).
            current.next!.random = current.random.next!;
        }
        // Move to the next original node
        current = current.next!.next;
    }

    // Step 3: Separate the original list and the copied list
    current = head;
    const newHead = head.next;
    while (current) {
        const copy: ListNode = current.next!;
        // Restore the next pointer of the original node
        current.next = copy.next;
        // Set the next pointer for the copied node
        if (copy.next) {
            copy.next = copy.next.next;
        }
        // Move to the next original node
        current = current.next;
    }

    return newHead;
}
