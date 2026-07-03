import type { Rng } from "./_rng";

// DAG: edges only from higher to lower in a hidden order; cycle: add a back edge
function prereqs(rng: Rng, n: number, edgeCount: number, cyclic: boolean): number[][] {
  const order = rng.shuffle(Array.from({ length: n }, (_, i) => i));
  const pos = new Array<number>(n);
  order.forEach((v, i) => { pos[v] = i; });
  const edges: number[][] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (edges.length < edgeCount && guard++ < edgeCount * 30) {
    const a = rng.int(0, n - 1), b = rng.int(0, n - 1);
    if (a === b || pos[a] <= pos[b]) continue; // a depends on b: pos[a] > pos[b]
    if (seen.has(`${a},${b}`)) continue;
    seen.add(`${a},${b}`);
    edges.push([a, b]);
  }
  if (cyclic && n >= 2) {
    // pick an existing edge chain endpoints reversed, or a direct 2-cycle
    const [a, b] = edges.length ? rng.pick(edges) : [0, 1];
    edges.push([b, a]);
  }
  return rng.shuffle(edges);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(2, 60);
    const cyclic = i % 2 === 1;
    out.push({ name: `${cyclic ? "cyclic" : "acyclic"} #${i} (n=${n})`, args: [n, prereqs(rng, n, rng.int(1, n * 2), cyclic)] });
  }
  out.push({ name: "no prerequisites", args: [4, []] });
  out.push({ name: "self-cycle", args: [2, [[0, 0]]] });
  return out;
}

export function stress(rng: Rng) {
  return [
    { name: "n=20000 acyclic", args: [20_000, prereqs(rng, 20_000, 40_000, false)] },
    { name: "n=20000 cyclic", args: [20_000, prereqs(rng, 20_000, 40_000, true)] },
  ];
}

// repeated elimination of zero-dependency courses
export function brute(numCourses: number, prerequisites: number[][]): boolean {
  const indeg = new Array<number>(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let done = 0;
  while (queue.length) {
    const c = queue.pop()!;
    done++;
    for (const nx of adj[c]) if (--indeg[nx] === 0) queue.push(nx);
  }
  return done === numCourses;
}
