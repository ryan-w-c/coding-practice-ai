import java.util.*;

class Solution {
    private final Map<Node, Node> map = new IdentityHashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Node hit = map.get(node);
        if (hit != null) return hit;
        Node copy = new Node(node.val);
        map.put(node, copy);
        for (Node nb : node.neighbors) copy.neighbors.add(cloneGraph(nb));
        return copy;
    }
}
