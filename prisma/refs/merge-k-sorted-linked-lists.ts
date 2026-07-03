type ListNode = { val: number; next: ListNode | null };

export function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  const merge2 = (a: ListNode | null, b: ListNode | null): ListNode | null => {
    const dummy: ListNode = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) {
        cur.next = a;
        a = a.next;
      } else {
        cur.next = b;
        b = b.next;
      }
      cur = cur.next;
    }
    cur.next = a ?? b;
    return dummy.next;
  };
  if (!lists.length) return null;
  let work = [...lists];
  while (work.length > 1) {
    const next: (ListNode | null)[] = [];
    for (let i = 0; i < work.length; i += 2) {
      next.push(i + 1 < work.length ? merge2(work[i], work[i + 1]) : work[i]);
    }
    work = next;
  }
  return work[0];
}
