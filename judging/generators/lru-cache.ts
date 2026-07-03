import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const cap = rng.int(1, 10);
    const keys = rng.int(2, 15);
    const ops = rng.int(20, 200);
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [cap] }];
    for (let k = 0; k < ops; k++) {
      if (rng.next() < 0.55) steps.push({ method: "put", args: [rng.int(1, keys), rng.int(1, 1000)] });
      else steps.push({ method: "get", args: [rng.int(1, keys)] });
    }
    out.push({ name: `random ops #${i} (cap=${cap}, ${ops} ops)`, steps });
  }
  // bigger workload: an O(capacity)-per-op cache still passes, but this fuzzes evictions hard
  const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [50] }];
  for (let k = 0; k < 3000; k++) {
    if (rng.next() < 0.5) steps.push({ method: "put", args: [rng.int(1, 200), rng.int(1, 1000)] });
    else steps.push({ method: "get", args: [rng.int(1, 200)] });
  }
  out.push({ name: "3000-op eviction fuzz (cap=50)", steps });
  return out;
}

// array-of-pairs with explicit recency reordering
export class bruteClass {
  private cap: number;
  private items: [number, number][] = []; // most recent LAST
  constructor(cap: number) { this.cap = cap; }
  get(key: number): number {
    const i = this.items.findIndex(([k]) => k === key);
    if (i === -1) return -1;
    const [item] = this.items.splice(i, 1);
    this.items.push(item);
    return item[1];
  }
  put(key: number, value: number): void {
    const i = this.items.findIndex(([k]) => k === key);
    if (i !== -1) this.items.splice(i, 1);
    this.items.push([key, value]);
    if (this.items.length > this.cap) this.items.shift();
  }
}
