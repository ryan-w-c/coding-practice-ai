import type { Rng } from "./_rng";

function numStr(rng: Rng, len: number): string {
  if (len === 1) return String(rng.int(0, 9));
  let s = String(rng.int(1, 9));
  for (let i = 1; i < len; i++) s += String(rng.int(0, 9));
  return s;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [numStr(rng, rng.int(1, 60)), numStr(rng, rng.int(1, 60))] });
  }
  out.push({ name: "times zero", args: [numStr(rng, 20), "0"] });
  return out;
}

export function stress(rng: Rng) {
  // repeated-addition naive is hopeless; digit dp is 10^6
  return [{ name: "1000x1000 digits", args: [numStr(rng, 1000), numStr(rng, 1000)] }];
}

export function brute(a: string, b: string): string {
  return (BigInt(a) * BigInt(b)).toString();
}
