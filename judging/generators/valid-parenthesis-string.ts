import type { Rng } from "./_rng";

function candidate(rng: Rng, n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += rng.pick([..."(())**"]);
  return s;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 14; i++) {
    out.push({ name: `random #${i}`, args: [candidate(rng, rng.int(1, 18))] });
  }
  out.push({ name: "star as empty", args: ["(*)"] });
  out.push({ name: "star cannot fix order", args: ["*)("] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^2) dp is fine at 2000; exponential star-expansion is not
  return [{ name: "n=2000 mixed", args: ["(".repeat(300) + candidate(rng, 1400) + ")".repeat(300)] }];
}

// try all interpretations of each '*' (cases keep n <= 18)
export function brute(s: string): boolean {
  const go = (i: number, open: number): boolean => {
    if (open < 0) return false;
    if (i === s.length) return open === 0;
    if (s[i] === "(") return go(i + 1, open + 1);
    if (s[i] === ")") return go(i + 1, open - 1);
    return go(i + 1, open) || go(i + 1, open + 1) || go(i + 1, open - 1);
  };
  return go(0, 0);
}
