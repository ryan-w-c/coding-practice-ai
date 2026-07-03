// Add Two Numbers - Medium
// https://neetcode.io/problems/add-two-numbers

export class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}
export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // Initialize a dummy head to simplify code for managing linked list creation
    const dummyHead = new ListNode();
    let carry = 0;  // This will store any carry from the previous digit sum
    let current = dummyHead;  // This will keep track of the current node

    // Iterate while there are nodes in l1, l2, or there's still a carry left
    while (l1 !== null || l2 !== null || carry !== 0) {
        // Get the value from the current node of l1 and l2 (use 0 if null)
        const l1Val = l1?.val ?? 0;
        const l2Val = l2?.val ?? 0;
        const sum = l1Val + l2Val + carry;  // Calculate the sum including any carry from the previous step

        // Calculate the new carry (sum can be greater than 9)
        carry = Math.floor(sum / 10);

        // Create a new node with the value of (sum % 10) and link it to the current list
        current.next = new ListNode(sum % 10);
        current = current.next;  // Move to the next position in the result linked list

        // Move to the next node in l1 and l2 if they exist
        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }

    // The dummy head's next points to the actual head of the resulting linked list
    return dummyHead.next;
}
