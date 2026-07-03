import type { Rng } from "./_rng";

const PAIRS: Record<string, string> = { "(": ")", "[": "]", "{": "}" };

function balanced(rng: Rng, budget: number): string {
  if (budget <= 0) return "";
  const kind = rng.int(0, 2);
  const open = ["(", "[", "{"][rng.int(0, 2)];
  if (kind === 0) return open + balanced(rng, budget - 1) + PAIRS[open];
  if (kind === 1) return balanced(rng, budget >> 1) + balanced(rng, budget >> 1);
  return open + PAIRS[open] + balanced(rng, budget - 1);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 6; i++) {
    out.push({ name: `balanced #${i}`, args: [balanced(rng, rng.int(1, 40))] });
  }
  for (let i = 0; i < 6; i++) {
    const chars = [...balanced(rng, rng.int(2, 40))];
    const kind = i % 3;
    if (kind === 0 && chars.length) chars.splice(rng.int(0, chars.length - 1), 1);       // drop one
    else if (kind === 1) chars.splice(rng.int(0, chars.length), 0, rng.pick([..."()[]{}"])); // insert one
    else if (chars.length) chars[rng.int(0, chars.length - 1)] = rng.pick([..."()[]{}"]);   // swap one
    out.push({ name: `corrupted #${i}`, args: [chars.join("")] });
  }
  out.push({ name: "wrong close type", args: ["(]"] });
  out.push({ name: "close before open", args: [")("] });
  out.push({ name: "single open", args: ["["] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n~200000 deeply balanced", args: [
    "(".repeat(50_000) + balanced(rng, 25_000) + ")".repeat(50_000)] }];
}

// repeatedly delete adjacent pairs until stable
export function brute(s: string): boolean {
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }
  return s === "";
}
