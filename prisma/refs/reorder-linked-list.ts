type ListNode = { val: number; next: ListNode | null };

export function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  // find middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // reverse second half
  let second: ListNode | null = slow.next;
  slow.next = null;
  let prev: ListNode | null = null;
  while (second) {
    const nx: ListNode | null = second.next;
    second.next = prev;
    prev = second;
    second = nx;
  }
  // interleave
  let first: ListNode | null = head;
  let rev: ListNode | null = prev;
  while (rev) {
    const fn: ListNode | null = first!.next;
    const rn: ListNode | null = rev.next;
    first!.next = rev;
    rev.next = fn;
    first = fn;
    rev = rn;
  }
}
