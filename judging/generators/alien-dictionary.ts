import type { Rng } from "./_rng";
import { word } from "./_shared";

// words whose adjacent-pair constraints form a Hamiltonian chain over the
// chosen letters — the valid order is unique by construction
function chainWords(rng: Rng, letters: string[]): string[] {
  return letters.map((c) => c + word(rng, 0, 3, letters.join("")));
}

const POOL = "abcdefghijklmnop";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const k = rng.int(1, 10);
    const letters = rng.shuffle([...POOL]).slice(0, k);
    out.push({ name: `unique chain #${i} (${k} letters)`, args: [chainWords(rng, letters)] });
  }
  for (let i = 0; i < 3; i++) {
    const letters = rng.shuffle([...POOL]).slice(0, rng.int(2, 6));
    const words = chainWords(rng, letters);
    words.push(words[0]); // repeat the first word after the last -> cycle
    out.push({ name: `cyclic #${i}`, args: [words] });
  }
  const letters = rng.shuffle([...POOL]).slice(0, 3);
  const w = letters.join("");
  out.push({ name: "prefix violation", args: [[w, w.slice(0, 2)]] });
  return out;
}

export function stress(rng: Rng) {
  // long word list, still a unique chain over 16 letters
  const letters = rng.shuffle([...POOL]);
  const words: string[] = [];
  for (const c of letters) {
    // several words per letter, sorted within the letter group by construction:
    // same first letter -> constraint comes from the SECOND letter chain too;
    // keep it simple: one word per letter but long suffixes
    words.push(c + word(rng, 20, 40, POOL));
  }
  return [{ name: "16-letter chain with long words", args: [words] }];
}

// derive constraints, then topological sort (queue-based)
export function brute(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) for (const c of w) {
    if (!adj.has(c)) adj.set(c, new Set());
    if (!indeg.has(c)) indeg.set(c, 0);
  }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1];
    const minLen = Math.min(a.length, b.length);
    if (a.length > b.length && a.slice(0, minLen) === b.slice(0, minLen)) return "";
    for (let j = 0; j < minLen; j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j])!.has(b[j])) {
          adj.get(a[j])!.add(b[j]);
          indeg.set(b[j], indeg.get(b[j])! + 1);
        }
        break;
      }
    }
  }
  const queue = [...indeg.keys()].filter((c) => indeg.get(c) === 0).sort();
  const out: string[] = [];
  while (queue.length) {
    const c = queue.shift()!;
    out.push(c);
    for (const nx of adj.get(c)!) {
      indeg.set(nx, indeg.get(nx)! - 1);
      if (indeg.get(nx) === 0) queue.push(nx);
    }
  }
  return out.length === indeg.size ? out.join("") : "";
}
