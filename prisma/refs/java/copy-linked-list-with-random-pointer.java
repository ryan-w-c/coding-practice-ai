import java.util.*;

class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> map = new IdentityHashMap<>();
        for (Node cur = head; cur != null; cur = cur.next) map.put(cur, new Node(cur.val));
        for (Node cur = head; cur != null; cur = cur.next) {
            map.get(cur).next = cur.next == null ? null : map.get(cur.next);
            map.get(cur).random = cur.random == null ? null : map.get(cur.random);
        }
        return head == null ? null : map.get(head);
    }
}
