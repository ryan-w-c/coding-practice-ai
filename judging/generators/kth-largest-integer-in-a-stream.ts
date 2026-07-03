import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const k = rng.int(1, 8);
    // LC guarantees >= k-1 initial elements (kth is defined from the first add)
    const init = rng.ints(rng.int(k - 1, k + 20), -10_000, 10_000);
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [k, init] }];
    for (let ops = rng.int(k, 60); ops > 0; ops--) {
      steps.push({ method: "add", args: [rng.int(-10_000, 10_000)] });
    }
    out.push({ name: `random stream #${i} (k=${k})`, steps });
  }
  // heavier stream: re-sorting all numbers per add is O(m^2 log m)
  const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [10, rng.ints(9, -100_000, 100_000)] }];
  for (let i = 0; i < 2000; i++) steps.push({ method: "add", args: [rng.int(-100_000, 100_000)] });
  out.push({ name: "2000-add stream (k=10)", steps });
  return out;
}

export class bruteClass {
  private k: number;
  private all: number[] = [];
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.all = [...nums];
  }
  add(val: number): number {
    this.all.push(val);
    return [...this.all].sort((a, b) => b - a)[this.k - 1];
  }
}
