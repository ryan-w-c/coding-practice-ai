import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const s1 = word(rng, 0, 8, "ab");
    const s2 = word(rng, 0, 8, "ab");
    let s3: string;
    if (i % 2 === 0) {
      // true interleaving: random merge
      const a = [...s1], b = [...s2];
      let m = "";
      while (a.length || b.length) {
        if (!b.length || (a.length && rng.next() < 0.5)) m += a.shift();
        else m += b.shift();
      }
      s3 = m;
    } else {
      s3 = word(rng, s1.length + s2.length, s1.length + s2.length, "ab");
    }
    out.push({ name: `random #${i}`, args: [s1, s2, s3] });
  }
  return out;
}

export function stress(_rng: Rng) {
  // uniform strings: memo-less recursion is exponential, dp is 10^4
  const a = "a".repeat(100);
  return [
    { name: "100+100 uniform true", args: [a, a, "a".repeat(200)] },
    { name: "100+100 uniform false tail", args: [a, a, "a".repeat(199) + "b"] },
  ];
}

export function brute(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) return false;
  const memo = new Map<string, boolean>();
  const go = (i: number, j: number): boolean => {
    if (i === s1.length && j === s2.length) return true;
    const k = `${i},${j}`;
    if (memo.has(k)) return memo.get(k)!;
    const c = s3[i + j];
    const ok =
      (i < s1.length && s1[i] === c && go(i + 1, j)) ||
      (j < s2.length && s2[j] === c && go(i, j + 1));
    memo.set(k, ok);
    return ok;
  };
  return go(0, 0);
}
