import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(1, 120);
    const seeds = Array.from({ length: rng.int(1, 12) }, () => word(rng, 1, 8, "abcd"));
    const words = Array.from({ length: n }, () =>
      rng.shuffle([...rng.pick(seeds)]).join(""));
    out.push({ name: `random #${i} (n=${n})`, args: [words] });
  }
  out.push({ name: "empty strings group", args: [["", "", "a"]] });
  out.push({ name: "single word", args: [["hello"]] });
  out.push({ name: "no anagrams", args: [["ab", "cd", "ef"]] });
  return out;
}

export function stress(rng: Rng) {
  const seeds = Array.from({ length: 500 }, () => word(rng, 6, 10));
  const words = Array.from({ length: 50_000 }, () => rng.shuffle([...rng.pick(seeds)]).join(""));
  return [{ name: "n=50000 words from 500 anagram classes", args: [words] }];
}

// O(n^2) pairwise grouping with sort-compare.
export function brute(strs: string[]): string[][] {
  const canon = strs.map((s) => [...s].sort().join(""));
  const used = new Array<boolean>(strs.length).fill(false);
  const out: string[][] = [];
  for (let i = 0; i < strs.length; i++) {
    if (used[i]) continue;
    const group = [strs[i]];
    used[i] = true;
    for (let j = i + 1; j < strs.length; j++) {
      if (!used[j] && canon[j] === canon[i]) {
        group.push(strs[j]);
        used[j] = true;
      }
    }
    out.push(group);
  }
  return out;
}
