def reorder_list(head):
    if not head or not head.next:
        return
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    second, slow.next = slow.next, None
    prev = None
    while second:
        second.next, prev, second = prev, second, second.next
    first = head
    while prev:
        first.next, prev.next, first, prev = prev, first.next, first.next, prev.next
