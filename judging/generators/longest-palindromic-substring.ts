import type { Rng } from "./_rng";
import { word } from "./_shared";

// only inputs whose LONGEST palindrome is unique are fair under exact compare
function allLongest(s: string): Set<string> {
  const isPal = (t: string) => t === [...t].reverse().join("");
  let best = 1;
  for (let i = 0; i < s.length; i++)
    for (let j = i + best; j <= s.length; j++)
      if (isPal(s.slice(i, j))) best = Math.max(best, j - i);
  const set = new Set<string>();
  for (let i = 0; i + best <= s.length; i++)
    if (isPal(s.slice(i, i + best))) set.add(s.slice(i, i + best));
  return set;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 10 && guard++ < 500) {
    // plant a palindrome in noise, then verify uniqueness
    const half = word(rng, 2, 8, "abc");
    const pal = half + (rng.next() < 0.5 ? "" : rng.pick([..."abc"])) + [...half].reverse().join("");
    const s = word(rng, 0, 6, "xyz") + pal + word(rng, 0, 6, "xyz");
    if (allLongest(s).size !== 1) continue;
    out.push({ name: `planted unique #${out.length}`, args: [s] });
  }
  return out;
}

export function stress(rng: Rng) {
  // long noise with one long planted palindrome; O(n^3) brute-force TLEs
  const half = word(rng, 200, 200, "ab");
  const pal = half + "q" + [...half].reverse().join("");
  const noise = () => word(rng, 1500, 1800, "cdefgh"); // distinct alphabet, no long palis
  return [{ name: "n~4000 planted 401-char palindrome", args: [noise() + pal + noise()] }];
}

export function brute(s: string): string {
  return [...allLongest(s)][0] ?? "";
}
