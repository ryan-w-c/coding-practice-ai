type GraphNode = { val: number; neighbors: GraphNode[] };

export function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const map = new Map<GraphNode, GraphNode>();
  const dfs = (n: GraphNode): GraphNode => {
    const hit = map.get(n);
    if (hit) return hit;
    const copy: GraphNode = { val: n.val, neighbors: [] };
    map.set(n, copy);
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
    return copy;
  };
  return dfs(node);
}
