import type { Rng } from "./_rng";

export function cases(_rng: Rng) {
  // whole practical domain; n=8 is 1430 strings
  return Array.from({ length: 8 }, (_, i) => ({ name: `n=${i + 1}`, args: [i + 1] }));
}

// filter all 2^(2n) strings
export function brute(n: number): string[] {
  const out: string[] = [];
  const gen = (s: string, len: number) => {
    if (len === 2 * n) {
      let bal = 0;
      for (const c of s) {
        bal += c === "(" ? 1 : -1;
        if (bal < 0) return;
      }
      if (bal === 0) out.push(s);
      return;
    }
    gen(s + "(", len + 1);
    gen(s + ")", len + 1);
  };
  gen("", 0);
  return out;
}
