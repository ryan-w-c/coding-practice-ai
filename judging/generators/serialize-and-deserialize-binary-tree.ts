import type { Rng } from "./_rng";
import { randomTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; data: unknown }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, data: randomTree(rng, rng.int(0, 300), -10_000, 10_000) });
  }
  out.push({ name: "n=10000 wide tree", data: randomTree(rng, 10_000) });
  return out;
}
