import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    const span = rng.int(3, 12); // small coordinate space → squares actually form
    for (let ops = rng.int(20, 250); ops > 0; ops--) {
      const p = [rng.int(0, span), rng.int(0, span)];
      if (rng.next() < 0.7) steps.push({ method: "add", args: [p] });
      else steps.push({ method: "count", args: [p] });
    }
    out.push({ name: `random ops #${i} (span=${span})`, steps });
  }
  return out;
}

// count by checking all pairs of same-x/same-y corners per query
export class bruteClass {
  private points: [number, number][] = [];
  add(p: number[]): void {
    this.points.push([p[0], p[1]]);
  }
  count(p: number[]): number {
    const [qx, qy] = p;
    let total = 0;
    for (const [x1, y1] of this.points) {
      if (x1 !== qx || y1 === qy) continue; // same column, different row
      const d = y1 - qy;
      for (const sign of [1, -1]) {
        const x2 = qx + d * sign;
        let corner1 = 0, corner2 = 0;
        for (const [x, y] of this.points) {
          if (x === x2 && y === qy) corner1++;
          if (x === x2 && y === y1) corner2++;
        }
        total += corner1 * corner2;
      }
    }
    return total;
  }
}
