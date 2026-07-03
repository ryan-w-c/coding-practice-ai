import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 250);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, 30, 100)] });
  }
  out.push({ name: "strictly increasing", args: [[30, 40, 50, 60]] });
  out.push({ name: "strictly decreasing", args: [[60, 50, 40, 30]] });
  out.push({ name: "all equal", args: [[50, 50, 50]] });
  out.push({ name: "single day", args: [[70]] });
  return out;
}

export function stress(rng: Rng) {
  // strictly decreasing: the answer is all zeros and a scan-ahead naive does n^2/2 work
  const dec: number[] = [];
  let v = 1_000_000;
  for (let i = 0; i < 300_000; i++) { v -= rng.int(1, 3); dec.push(v); }
  return [
    { name: "n=300000 strictly decreasing", args: [dec] },
    { name: "n=100000 random", args: [rng.ints(100_000, 30, 100)] },
  ];
}

export function brute(temps: number[]): number[] {
  const out = new Array<number>(temps.length).fill(0);
  for (let i = 0; i < temps.length; i++)
    for (let j = i + 1; j < temps.length; j++)
      if (temps[j] > temps[i]) { out[i] = j - i; break; }
  return out;
}
