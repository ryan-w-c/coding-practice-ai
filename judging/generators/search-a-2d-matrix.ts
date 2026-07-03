import type { Rng } from "./_rng";

// LC 74 matrix: rows sorted, first of each row > last of previous row —
// i.e. the flattened matrix is strictly increasing.
function matrix(rng: Rng, m: number, n: number): number[][] {
  const flat: number[] = [];
  let v = rng.int(-10_000, 0);
  for (let i = 0; i < m * n; i++) {
    v += rng.int(1, 15);
    flat.push(v);
  }
  return Array.from({ length: m }, (_, r) => flat.slice(r * n, (r + 1) * n));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const m = rng.int(1, 15), n = rng.int(1, 15);
    const mat = matrix(rng, m, n);
    const present = rng.next() < 0.5;
    const target = present
      ? mat[rng.int(0, m - 1)][rng.int(0, n - 1)]
      : mat[rng.int(0, m - 1)][rng.int(0, n - 1)] + (rng.next() < 0.5 ? -1 : 1) * 100_000;
    out.push({ name: `random #${i} (${m}x${n}, ${present ? "present" : "likely absent"})`, args: [mat, target] });
  }
  out.push({ name: "1x1 hit", args: [[[7]], 7] });
  out.push({ name: "1x1 miss", args: [[[7]], 8] });
  out.push({ name: "single row", args: [[[1, 4, 9, 20]], 9] });
  out.push({ name: "single column", args: [[[2], [5], [11]], 3] });
  out.push({ name: "between rows (gap value)", args: [[[1, 3], [10, 12]], 5] });
  return out;
}

export function stress(rng: Rng) {
  const mat = matrix(rng, 300, 300);
  return [
    { name: "300x300 present", args: [mat, mat[rng.int(0, 299)][rng.int(0, 299)]] },
    { name: "300x300 absent", args: [mat, mat[299][299] + 1] },
  ];
}

export function brute(mat: number[][], target: number): boolean {
  return mat.some((row) => row.includes(target));
}
