import type { Rng } from "./_rng";

// random valid op streams; the driver fills expected by replaying the ref class
export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    let size = 0;
    const ops = rng.int(15, 120);
    for (let k = 0; k < ops; k++) {
      const r = rng.next();
      if (size === 0 || r < 0.45) {
        steps.push({ method: "push", args: [rng.int(-10_000, 10_000)] });
        size++;
      } else if (r < 0.6) {
        steps.push({ method: "pop", args: [] });
        size--;
      } else if (r < 0.8) {
        steps.push({ method: "top", args: [] });
      } else {
        steps.push({ method: "getMin", args: [] });
      }
    }
    out.push({ name: `random ops #${i} (${ops} ops)`, steps });
  }
  return out;
}

// linear-scan min (independent of the paired-stack optimal)
export class bruteClass {
  private stack: number[] = [];
  push(v: number) { this.stack.push(v); }
  pop() { this.stack.pop(); }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return Math.min(...this.stack); }
}
