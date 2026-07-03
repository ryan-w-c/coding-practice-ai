export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const indeg = new Array<number>(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  const out: number[] = [];
  while (queue.length) {
    const c = queue.shift()!;
    out.push(c);
    for (const nx of adj[c]) if (--indeg[nx] === 0) queue.push(nx);
  }
  return out.length === numCourses ? out : [];
}
