def merge_k_lists(lists):
    def merge2(a, b):
        dummy = ListNode(0)  # noqa: F821 (injected by harness)
        cur = dummy
        while a and b:
            if a.val <= b.val:
                cur.next, a = a, a.next
            else:
                cur.next, b = b, b.next
            cur = cur.next
        cur.next = a or b
        return dummy.next

    if not lists:
        return None
    work = list(lists)
    while len(work) > 1:
        work = [merge2(work[i], work[i + 1]) if i + 1 < len(work) else work[i]
                for i in range(0, len(work), 2)]
    return work[0]
