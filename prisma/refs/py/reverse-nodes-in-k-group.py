def reverse_k_group(head, k):
    dummy = ListNode(0, head)  # noqa: F821 (injected by harness)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if kth is None:
                return dummy.next
        group_next = kth.next
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            cur.next, prev, cur = prev, cur, cur.next
        new_start = group_prev.next
        group_prev.next = kth
        group_prev = new_start
