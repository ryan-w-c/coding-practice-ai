/**
 * Reverse Nodes in K-Group - Hard
 *
 * https://leetcode.com/problems/reverse-nodes-in-k-group/
 */

type ListNode = { val: number; next: ListNode | null };

export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy: ListNode = { val: 0, next: head };
  let groupPrev: ListNode = dummy;
  for (;;) {
    // find the k-th node from groupPrev
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext: ListNode | null = kth.next;
    // reverse the group
    let prev: ListNode | null = groupNext;
    let cur: ListNode | null = groupPrev.next;
    while (cur !== groupNext) {
      const nx: ListNode | null = cur!.next;
      cur!.next = prev;
      prev = cur;
      cur = nx;
    }
    const newStart = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = newStart;
  }
  return dummy.next;
}
