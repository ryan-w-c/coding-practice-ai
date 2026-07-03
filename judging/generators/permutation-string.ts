import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const alpha = rng.pick(["abc", "abcde"]);
    const s1 = rng.str(rng.int(1, 8), alpha);
    let s2 = rng.str(rng.int(0, 200), alpha);
    if (rng.next() < 0.5 && s2.length > 0) {
      // plant a shuffled copy of s1 so ~half the cases are true
      const perm = rng.shuffle([...s1]).join("");
      const at = rng.int(0, s2.length);
      s2 = s2.slice(0, at) + perm + s2.slice(at);
    }
    out.push({ name: `random #${i} (|s1|=${s1.length}, |s2|=${s2.length})`, args: [s1, s2] });
  }
  out.push({ name: "s1 longer than s2", args: ["abc", "ab"] });
  out.push({ name: "same multiset different order", args: ["adc", "dcda"] });
  out.push({ name: "single char match", args: ["a", "za"] });
  return out;
}

export function stress(rng: Rng) {
  const s1 = rng.str(50_000, "ab");
  const filler = rng.str(200_000, "ab");
  const perm = rng.shuffle([...s1]).join("");
  return [
    // planted at the very end → forces a full scan; sort-per-window naive TLEs
    { name: "|s1|=50k planted at end of |s2|=250k", args: [s1, filler + perm] },
    { name: "|s1|=50k no match in |s2|=200k", args: [s1 + "c", filler] },
  ];
}

// O(n·m log m) — sort every window and compare.
export function brute(s1: string, s2: string): boolean {
  const want = [...s1].sort().join("");
  for (let i = 0; i + s1.length <= s2.length; i++) {
    if ([...s2.slice(i, i + s1.length)].sort().join("") === want) return true;
  }
  return false;
}
