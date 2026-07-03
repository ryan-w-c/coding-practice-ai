/**
 * Min Cost to Connect All Points - Medium
 *
 * https://leetcode.com/problems/min-cost-to-connect-all-points/
 */

export function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const dist = new Array<number>(n).fill(Infinity);
  const inTree = new Array<boolean>(n).fill(false);
  dist[0] = 0;
  let total = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inTree[i] && (u === -1 || dist[i] < dist[u])) u = i;
    inTree[u] = true;
    total += dist[u];
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (d < dist[v]) dist[v] = d;
    }
  }
  return total;
}
