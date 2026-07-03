import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const s = word(rng, 1, 120, "abcdef");
    const kind = i % 3;
    let t: string;
    if (kind === 0) t = rng.shuffle([...s]).join("");                 // true anagram
    else if (kind === 1) {
      const chars = [...s];
      chars[rng.int(0, chars.length - 1)] = rng.pick([..."abcdef"]); // maybe corrupted
      t = rng.shuffle(chars).join("");
    } else t = word(rng, 1, 120, "abcdef");                           // unrelated
    out.push({ name: `random #${i}`, args: [s, t] });
  }
  out.push({ name: "length mismatch", args: ["ab", "abb"] });
  out.push({ name: "same string", args: ["xyz", "xyz"] });
  out.push({ name: "single chars differ", args: ["a", "b"] });
  return out;
}

export function stress(rng: Rng) {
  const s = word(rng, 200_000, 200_000);
  return [{ name: "n=200000 shuffled anagram", args: [s, rng.shuffle([...s]).join("")] }];
}

export function brute(s: string, t: string): boolean {
  return [...s].sort().join("") === [...t].sort().join("");
}
