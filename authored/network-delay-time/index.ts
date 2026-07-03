/**
 * Network Delay Time - Medium
 *
 * https://leetcode.com/problems/network-delay-time/
 */

export function networkDelayTime(times: number[][], n: number, k: number): number {
  const dist = new Array<number>(n + 1).fill(Infinity);
  const done = new Array<boolean>(n + 1).fill(false);
  const adj = new Map<number, [number, number][]>();
  for (const [u, v, w] of times) {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u)!.push([v, w]);
  }
  dist[k] = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let i = 1; i <= n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    done[u] = true;
    for (const [v, w] of adj.get(u) ?? []) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let out = 0;
  for (let i = 1; i <= n; i++) out = Math.max(out, dist[i]);
  return out === Infinity ? -1 : out;
}
