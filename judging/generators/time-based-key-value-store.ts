import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const keys = Array.from({ length: rng.int(1, 6) }, (_, k) => `key${k}`);
    const lastTs = new Map<string, number>();
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    for (let ops = rng.int(20, 200); ops > 0; ops--) {
      const key = rng.pick(keys);
      if (rng.next() < 0.5) {
        // timestamps strictly increase per key (the LC guarantee)
        const ts = (lastTs.get(key) ?? 0) + rng.int(1, 10);
        lastTs.set(key, ts);
        steps.push({ method: "set", args: [key, `v${rng.int(0, 999)}`, ts] });
      } else {
        steps.push({ method: "get", args: [key, rng.int(0, (lastTs.get(key) ?? 0) + 15)] });
      }
    }
    out.push({ name: `random ops #${i}`, steps });
  }
  // linear-scan get is O(sets) per call; 3000 mixed ops punish it in aggregate
  const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
  let ts = 0;
  for (let k = 0; k < 3000; k++) {
    if (k % 2 === 0) steps.push({ method: "set", args: ["hot", `v${k}`, ++ts] });
    else steps.push({ method: "get", args: ["hot", rng.int(1, ts)] });
  }
  out.push({ name: "3000-op single hot key", steps });
  return out;
}

export class bruteClass {
  private store = new Map<string, [number, string][]>();
  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push([timestamp, value]);
  }
  get(key: string, timestamp: number): string {
    let best = "";
    let bestTs = -1;
    for (const [ts, v] of this.store.get(key) ?? []) {
      if (ts <= timestamp && ts > bestTs) {
        bestTs = ts;
        best = v;
      }
    }
    return best;
  }
}
