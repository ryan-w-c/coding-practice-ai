import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const dictSet = new Set<string>();
    for (let k = rng.int(2, 10); k > 0; k--) dictSet.add(word(rng, 1, 5, "ab"));
    const dict = [...dictSet];
    // half: compose s from dict words (true-ish); half: random
    const s = i % 2 === 0
      ? Array.from({ length: rng.int(1, 8) }, () => rng.pick(dict)).join("")
      : word(rng, 1, 25, "ab");
    out.push({ name: `random #${i}`, args: [s, dict] });
  }
  return out;
}

export function stress(_rng: Rng) {
  // classic memo-killer: aaaa...ab with all-a dictionary
  return [{ name: "80 a's then b, all-a dict", args: ["a".repeat(80) + "b", ["a", "aa", "aaa", "aaaa", "aaaaa"]] }];
}

// exhaustive with a visited-set only on failure states avoided — plain DFS kept
// safe by small case sizes
export function brute(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const memo = new Map<number, boolean>();
  const go = (i: number): boolean => {
    if (i === s.length) return true;
    if (memo.has(i)) return memo.get(i)!;
    let ok = false;
    for (let j = i + 1; j <= s.length && !ok; j++) if (words.has(s.slice(i, j)) && go(j)) ok = true;
    memo.set(i, ok);
    return ok;
  };
  return go(0);
}
