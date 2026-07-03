/**
 * Merge Two Sorted Lists - Easy
 *
 * https://neetcode.io/problems/merge-two-sorted-lists
 */

class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // create a dummy node as the head of the merge list
    const dummy = new ListNode()
    let current = dummy

    // Merge the two lists while both are non-empty
    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            current.next = list1;
            list1 = list1.next
        } else {
            current.next = list2
            list2 = list2.next
        }
        // update current pointer to tail node
        current = current.next
    }

    // Append the remaining elements of either list
    if (list1 !== null) {
        current.next = list1
    } else if (list2 !== null) {
        current.next = list2
    }

    // Return the merged list, which starts at dummy.next
    return dummy.next
}

export { ListNode };
