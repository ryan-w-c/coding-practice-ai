import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 300);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -1000, 1000), rng.int(1, n)] });
  }
  out.push({ name: "k larger leaves tail", args: [[1, 2, 3, 4, 5, 6, 7], 3] });
  return out;
}

export function stress(rng: Rng) {
  return [
    { name: "n=100000 k=3", args: [rng.ints(100_000, -1000, 1000), 3] },
    { name: "n=100000 k=1000", args: [rng.ints(100_000, -1000, 1000), 1000] },
  ];
}

export function brute(arr: number[], k: number): number[] {
  const out: number[] = [];
  let i = 0;
  while (i + k <= arr.length) {
    out.push(...arr.slice(i, i + k).reverse());
    i += k;
  }
  out.push(...arr.slice(i));
  return out;
}
