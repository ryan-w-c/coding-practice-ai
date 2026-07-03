import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    let size = 0;
    for (let ops = rng.int(10, 120); ops > 0; ops--) {
      if (size === 0 || rng.next() < 0.6) {
        steps.push({ method: "addNum", args: [rng.int(-100_000, 100_000)] });
        size++;
      } else {
        steps.push({ method: "findMedian", args: [] });
      }
    }
    out.push({ name: `random stream #${i}`, steps });
  }
  // sort-per-findMedian is O(m^2 log m) over this stream
  const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
  for (let k = 0; k < 3000; k++) {
    steps.push({ method: "addNum", args: [rng.int(-100_000, 100_000)] });
    if (k % 2 === 1) steps.push({ method: "findMedian", args: [] });
  }
  out.push({ name: "3000-add interleaved medians", steps });
  return out;
}

export class bruteClass {
  private all: number[] = [];
  addNum(n: number): void {
    this.all.push(n);
  }
  findMedian(): number {
    const s = [...this.all].sort((a, b) => a - b);
    const n = s.length;
    return n % 2 === 1 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
}
