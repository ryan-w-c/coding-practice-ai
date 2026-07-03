import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(0, 200);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, 0, 100)] });
  }
  // mountain: nothing trapped
  const up = rng.ints(20, 0, 100).sort((a, b) => a - b);
  const down = rng.ints(20, 0, 100).sort((a, b) => b - a);
  out.push({ name: "mountain traps nothing", args: [[...up, 100, ...down]] });
  // deep valley between walls
  out.push({ name: "single deep valley", args: [[100, ...rng.ints(50, 0, 5), 100]] });
  out.push({ name: "empty", args: [[]] });
  out.push({ name: "flat", args: [[7, 7, 7, 7]] });
  return out;
}

export function stress(rng: Rng) {
  // 300k: O(n^2) ≈ 9e10 ops TLEs even under Bun's JIT; O(n) two-pointer is instant.
  return [{ name: "n=300000 random terrain", args: [rng.ints(300_000, 0, 10_000)] }];
}

// O(n^2): water at i = min(max left, max right) - h[i].
export function brute(height: number[]): number {
  let out = 0;
  for (let i = 0; i < height.length; i++) {
    let maxL = 0, maxR = 0;
    for (let j = 0; j <= i; j++) maxL = Math.max(maxL, height[j]);
    for (let j = i; j < height.length; j++) maxR = Math.max(maxR, height[j]);
    out += Math.min(maxL, maxR) - height[i];
  }
  return out;
}
