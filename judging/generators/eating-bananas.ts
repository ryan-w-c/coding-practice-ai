import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 20);
    const piles = rng.ints(n, 1, 5000);
    const h = rng.int(n, n * 3 + rng.int(0, 20)); // guaranteed h >= piles.length
    out.push({ name: `random #${i} (n=${n}, h=${h})`, args: [piles, h] });
  }
  out.push({ name: "h equals pile count (k = max pile)", args: [[30, 11, 23, 4, 20], 5] });
  out.push({ name: "single huge pile", args: [[1_000_000_000], 2] });
  out.push({ name: "plenty of time (k = 1)", args: [[3, 6, 7, 11], 1000] });
  return out;
}

export function stress(rng: Rng) {
  const n = 10_000;
  const piles = rng.ints(n, 1, 1_000_000_000);
  // tight h forces large k; trying speeds 1,2,3,... never finishes
  return [{ name: "n=10000 piles up to 1e9, tight h", args: [piles, n + rng.int(0, n)] }];
}

// Linear scan over k — fine for small piles, hopeless at 1e9.
export function brute(piles: number[], h: number): number {
  for (let k = 1; ; k++) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) return k;
  }
}
