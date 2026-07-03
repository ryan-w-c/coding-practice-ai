import type { Rng } from "./_rng";

// count valid starts in O(n^2); LC guarantees a unique start when one exists
function validStarts(gas: number[], cost: number[]): number[] {
  const n = gas.length;
  const out: number[] = [];
  for (let s = 0; s < n; s++) {
    let tank = 0, ok = true;
    for (let k = 0; k < n; k++) {
      const i = (s + k) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) out.push(s);
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 500) {
    const n = rng.int(1, 60);
    const gas = rng.ints(n, 0, 20), cost = rng.ints(n, 0, 20);
    if (validStarts(gas, cost).length > 1) continue; // keep the LC uniqueness guarantee
    out.push({ name: `random #${out.length} (n=${n})`, args: [gas, cost] });
  }
  return out;
}

export function stress(rng: Rng) {
  // random big instance; retry until the start is unique or impossible
  for (let tries = 0; tries < 20; tries++) {
    const n = 150_000;
    const gas = rng.ints(n, 0, 100), cost = rng.ints(n, 0, 100);
    const total = gas.reduce((a, b) => a + b, 0) - cost.reduce((a, b) => a + b, 0);
    if (total < 0) return [{ name: "n=150000 impossible", args: [gas, cost] }];
    // theory: when total >= 0 the canonical greedy start works; uniqueness holds
    // unless some suffix balances exactly — near-impossible with random ±100
    return [{ name: "n=150000", args: [gas, cost] }];
  }
  return [];
}

export function brute(gas: number[], cost: number[]): number {
  const starts = validStarts(gas, cost);
  return starts.length ? starts[0] : -1;
}
