import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(1, 300);
    const pos = rng.next() < 0.5 ? -1 : rng.int(0, n - 1);
    out.push({ name: `random #${i} (n=${n}, pos=${pos})`, args: [{ values: rng.ints(n, -100, 100), pos }] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [
    { name: "n=100000 cycle at start", args: [{ values: rng.ints(100_000, -100, 100), pos: 0 }] },
    { name: "n=100000 no cycle", args: [{ values: rng.ints(100_000, -100, 100), pos: -1 }] },
  ];
}

// the spec itself says whether there's a cycle
export function brute(spec: { values: number[]; pos: number }): boolean {
  return spec.pos >= 0 && spec.values.length > 0;
}
