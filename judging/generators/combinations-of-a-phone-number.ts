import type { Rng } from "./_rng";
import { word } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random digits #${i}`, args: [word(rng, 0, 4, "23456789")] });
  }
  out.push({ name: "all four-letter keys", args: ["79"] });
  return out;
}

const MAP: Record<string, string> = {
  "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
  "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
};

// build combinations right-to-left (opposite direction from the usual)
export function brute(digits: string): string[] {
  if (!digits) return [];
  let acc = [""];
  for (let i = digits.length - 1; i >= 0; i--) {
    const next: string[] = [];
    for (const c of MAP[digits[i]]) for (const suffix of acc) next.push(c + suffix);
    acc = next;
  }
  return acc;
}
