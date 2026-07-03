/**
 * Merge K Sorted Linked Lists - Hard
 *
 * https://neetcode.io/problems/merge-k-sorted-linked-lists
 */

class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val: number, next: ListNode | null = null) {
        this.val = val;
        this.next = next;
    }
}

export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    // Step 1: Handle edge case - if the list is empty, return null
    if (lists.length === 0) return null;

    // Step 2: Use a min-heap (simulated with a sorted array) to merge the lists
    // 2.1 Initialize an empty heap
    const minHeap: ListNode[] = [];

    // 2.2 Add the head of each list to the heap
    for (let head of lists) {
        if (head) minHeap.push(head);
    }
    // 2.3 Sort the heap by node values to maintain ascending order
    minHeap.sort((a, b) => a.val - b.val);

    // Step 3: Set up a dummy head for the result list
    const dummy = new ListNode(0);
    let current = dummy;

    // Step 4: Process the heap until all nodes are merged
    while (minHeap.length > 0) {
        // 4.1 Extract the smallest node from the heap and add it to the result list
        const smallestNode = minHeap.shift()!;
        current.next = smallestNode;
        current = current.next;

        // 4.2 If the extracted node has a next node, add it to the heap and re-sort
        if (smallestNode.next) {
            minHeap.push(smallestNode.next);
            minHeap.sort((a, b) => a.val - b.val);
        }
    }

    // Step 5: Return the merged list starting from dummy.next
    return dummy.next;
}