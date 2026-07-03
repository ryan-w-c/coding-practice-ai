export function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
  }
  return true;
}
