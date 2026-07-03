import type { Rng } from "./_rng";

// unique topological order: a Hamiltonian chain over a hidden permutation,
// plus random extra forward edges (which never break uniqueness)
function uniqueOrderInput(rng: Rng, n: number, extra: number): { edges: number[][]; order: number[] } {
  const order = rng.shuffle(Array.from({ length: n }, (_, i) => i));
  const edges: number[][] = [];
  for (let i = 0; i + 1 < n; i++) edges.push([order[i + 1], order[i]]); // [a, b]: b before a
  const seen = new Set(edges.map(([a, b]) => `${a},${b}`));
  let guard = 0;
  while (extra > 0 && guard++ < extra * 30) {
    const i = rng.int(0, n - 2), j = rng.int(i + 1, n - 1);
    const key = `${order[j]},${order[i]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push([order[j], order[i]]);
    extra--;
  }
  return { edges: rng.shuffle(edges), order };
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(2, 60);
    const { edges } = uniqueOrderInput(rng, n, rng.int(0, n));
    out.push({ name: `unique-order chain #${i} (n=${n})`, args: [n, edges] });
  }
  for (let i = 0; i < 4; i++) {
    const n = rng.int(2, 40);
    const { edges } = uniqueOrderInput(rng, n, rng.int(0, n));
    edges.push([edges[0][1], edges[0][0]]); // reverse an edge -> cycle
    out.push({ name: `cyclic #${i} (n=${n})`, args: [n, rng.shuffle(edges)] });
  }
  return out;
}

export function stress(rng: Rng) {
  const { edges } = uniqueOrderInput(rng, 20_000, 20_000);
  return [{ name: "n=20000 unique chain", args: [20_000, edges] }];
}

export function brute(numCourses: number, prerequisites: number[][]): number[] {
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
