type RandomNode = { val: number; next: RandomNode | null; random: RandomNode | null };

export function copyRandomList(head: RandomNode | null): RandomNode | null {
  const map = new Map<RandomNode, RandomNode>();
  for (let cur = head; cur; cur = cur.next) {
    map.set(cur, { val: cur.val, next: null, random: null });
  }
  for (let cur = head; cur; cur = cur.next) {
    const copy = map.get(cur)!;
    copy.next = cur.next ? map.get(cur.next)! : null;
    copy.random = cur.random ? map.get(cur.random)! : null;
  }
  return head ? map.get(head)! : null;
}
