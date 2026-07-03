import type { Rng } from "./_rng";
import { word } from "./_shared";

// random VALID pattern: units are (char | '.') optionally followed by '*'
function pattern(rng: Rng, units: number): string {
  let p = "";
  for (let i = 0; i < units; i++) {
    p += rng.next() < 0.25 ? "." : rng.pick([..."ab"]);
    if (rng.next() < 0.4) p += "*";
  }
  return p || "a";
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 14; i++) {
    out.push({ name: `random #${i}`, args: [word(rng, 0, 10, "ab"), pattern(rng, rng.int(1, 7))] });
  }
  return out;
}

export function stress(_rng: Rng) {
  // classic exponential killer for memo-less matchers
  return [
    { name: "a^30 vs (a*)^15 b", args: ["a".repeat(30), "a*".repeat(15) + "b"] },
    { name: "a^30 vs (a*)^15", args: ["a".repeat(30), "a*".repeat(15)] },
  ];
}

// straightforward recursive matcher with memo
export function brute(s: string, p: string): boolean {
  const memo = new Map<string, boolean>();
  const go = (i: number, j: number): boolean => {
    if (j === p.length) return i === s.length;
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;
    const first = i < s.length && (p[j] === "." || p[j] === s[i]);
    let ok: boolean;
    if (j + 1 < p.length && p[j + 1] === "*") {
      ok = go(i, j + 2) || (first && go(i + 1, j));
    } else {
      ok = first && go(i + 1, j + 1);
    }
    memo.set(key, ok);
    return ok;
  };
  return go(0, 0);
}
