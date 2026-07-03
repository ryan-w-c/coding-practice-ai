"""(De)serialization between neutral JSON and Python runtime values."""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Node:
    """LeetCode's multi-purpose Node: graph (val/neighbors) and random-pointer list
    (val/next/random). Which fields matter depends on the problem."""

    def __init__(self, val=0, neighbors=None, next=None, random=None):
        # LeetCode's graph signature is Node(val, neighbors); its random-list
        # signature is Node(val, next, random) — accept either positionally.
        self.val = val
        if neighbors is not None and not isinstance(neighbors, list):
            # Called as Node(x, next_node, random_node)
            self.neighbors = []
            self.next = neighbors
            self.random = next
        else:
            self.neighbors = neighbors if neighbors is not None else []
            self.next = next
            self.random = random


def _list_from_array(arr):
    head = None
    for v in reversed(arr or []):
        head = ListNode(v, head)
    return head


def _list_to_array(node):
    out, seen = [], set()
    while node is not None and id(node) not in seen:
        seen.add(id(node))
        out.append(node.val)
        node = node.next
    return out


def _tree_from_array(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.left = TreeNode(v); queue.append(node.left)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.right = TreeNode(v); queue.append(node.right)
    return root


def _tree_to_array(root):
    out = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is not None:
            out.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out


def _cycle_list_from_spec(spec):
    """{"values": [1,2,3], "pos": 1} — tail.next points at values[pos] (-1 = no cycle)."""
    values = spec.get("values") or []
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    pos = spec.get("pos", -1)
    if pos >= 0 and nodes:
        nodes[-1].next = nodes[pos]
    return nodes[0] if nodes else None


def _random_list_from_array(pairs):
    """[[val, random_index|None], ...] (LeetCode copy-random-list format)."""
    nodes = [Node(p[0]) for p in pairs or []]
    for i, node in enumerate(nodes):
        node.next = nodes[i + 1] if i + 1 < len(nodes) else None
        r = pairs[i][1]
        node.random = nodes[r] if r is not None else None
    return nodes[0] if nodes else None


def _random_list_to_array(head):
    index, cur = {}, head
    while cur is not None and id(cur) not in index:
        index[id(cur)] = len(index)
        cur = cur.next
    out, cur = [], head
    while cur is not None and len(out) < len(index):
        r = getattr(cur, "random", None)
        out.append([cur.val, index.get(id(r), -1) if r is not None else None])
        cur = cur.next
    return out


def _graph_from_adj(adj):
    """LeetCode clone-graph adjacency list: adj[i] = vals of node (i+1)'s neighbors."""
    nodes = [Node(i + 1) for i in range(len(adj or []))]
    for i, ns in enumerate(adj or []):
        nodes[i].neighbors = [nodes[v - 1] for v in ns]
    return nodes[0] if nodes else None


def _graph_to_adj(node):
    if node is None:
        return []
    seen, queue = {id(node): node}, [node]
    while queue:
        cur = queue.pop(0)
        for nb in cur.neighbors or []:
            if id(nb) not in seen:
                seen[id(nb)] = nb
                queue.append(nb)
    out = [[] for _ in seen]
    for n in seen.values():
        i = n.val - 1
        if i < 0 or i >= len(out):
            return [[-1]]  # vals not 1..n — can't match any expected
        out[i] = sorted(nb.val for nb in (n.neighbors or []))
    return out


def collect_nodes(root):
    """All node objects reachable via next/left/right/random/neighbors/list-elements."""
    seen, stack = set(), [root]
    while stack:
        v = stack.pop()
        if v is None or isinstance(v, (int, float, str, bool)) or id(v) in seen:
            continue
        seen.add(id(v))
        if isinstance(v, list):
            stack.extend(v)
            continue
        for attr in ("next", "left", "right", "random"):
            child = getattr(v, attr, None)
            if child is not None:
                stack.append(child)
        stack.extend(getattr(v, "neighbors", None) or [])
    return seen


def shares_nodes(input_, output):
    return bool(collect_nodes(input_) & collect_nodes(output))


def deserialize_arg(value, type_):
    if type_ == "float":
        # JSON "2" would arrive as int — LeetCode passes float args as floats,
        # and int arithmetic silently changes semantics (e.g. huge exact powers).
        return float(value)
    if type_ == "ListNode":
        return _list_from_array(value or [])
    if type_ == "TreeNode":
        return _tree_from_array(value or [])
    if type_ == "ListNodeCycle":
        return _cycle_list_from_spec(value or {})
    if type_ == "ListNodeRandom":
        return _random_list_from_array(value or [])
    if type_ == "GraphNode":
        return _graph_from_adj(value or [])
    if type_ == "ListNode[]":
        return [_list_from_array(a or []) for a in (value or [])]
    return value


def serialize_result(value, type_):
    if type_ == "ListNode":
        return _list_to_array(value)
    if type_ == "TreeNode":
        return _tree_to_array(value)
    if type_ == "ListNodeRandom":
        return _random_list_to_array(value)
    if type_ == "GraphNode":
        return _graph_to_adj(value)
    if type_ == "ListNode[]":
        return [_list_to_array(v) for v in (value or [])]
    return value
