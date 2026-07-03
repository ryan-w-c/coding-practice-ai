def copy_random_list(head):
    mapping = {}
    cur = head
    while cur:
        mapping[id(cur)] = Node(cur.val)  # noqa: F821 (injected by harness)
        cur = cur.next
    cur = head
    while cur:
        copy = mapping[id(cur)]
        copy.next = mapping[id(cur.next)] if cur.next else None
        copy.random = mapping[id(cur.random)] if cur.random else None
        cur = cur.next
    return mapping[id(head)] if head else None
