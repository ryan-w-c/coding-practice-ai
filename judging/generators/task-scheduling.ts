import type { Rng } from "./_rng";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const kinds = rng.int(1, 8);
    const tasks: string[] = [];
    for (let t = 0; t < kinds; t++) {
      const c = LETTERS[t];
      for (let r = rng.int(1, 12); r > 0; r--) tasks.push(c);
    }
    out.push({ name: `random #${i} (${tasks.length} tasks)`, args: [rng.shuffle(tasks), rng.int(0, 6)] });
  }
  out.push({ name: "n=0 back to back", args: [["A", "A", "B"], 0] });
  out.push({ name: "single task type large gap", args: [["A", "A", "A"], 5] });
  return out;
}

// actual greedy simulation (most-remaining-first with cooldowns)
export function brute(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const t of tasks) count.set(t, (count.get(t) ?? 0) + 1);
  const nextFree = new Map<string, number>();
  let remaining = tasks.length;
  let time = 0;
  while (remaining > 0) {
    let pick: string | null = null;
    for (const [task, c] of count) {
      if (c === 0 || (nextFree.get(task) ?? 0) > time) continue;
      if (pick === null || c > count.get(pick)!) pick = task;
    }
    if (pick !== null) {
      count.set(pick, count.get(pick)! - 1);
      nextFree.set(pick, time + n + 1);
      remaining--;
    }
    time++;
  }
  return time;
}
