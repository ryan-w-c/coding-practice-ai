import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const alpha = rng.pick(["AB", "ABC", "ABCD"]);
    const n = rng.int(1, 100);
    out.push({ name: `random #${i} (n=${n}, |Σ|=${alpha.length})`, args: [rng.str(n, alpha), rng.int(0, 10)] });
  }
  out.push({ name: "k=0 uniform run", args: ["AAAA", 0] });
  out.push({ name: "k covers whole string", args: [rng.str(30, "ABC"), 30] });
  out.push({ name: "single char k=2", args: ["B", 2] });
  return out;
}

export function stress(rng: Rng) {
  // 200k: O(n^2) window growth ≈ 4e10 steps TLEs; O(26n) sliding window is instant.
  return [{ name: "n=200000 binary alphabet k=1000", args: [rng.str(200_000, "AB"), 1000] }];
}

// O(26·n^2): grow each window from every left index, tracking max char freq.
export function brute(s: string, k: number): number {
  const A = "A".charCodeAt(0);
  let best = 0;
  for (let l = 0; l < s.length; l++) {
    const count = new Array<number>(26).fill(0);
    let maxFreq = 0;
    for (let r = l; r < s.length; r++) {
      maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(r) - A]);
      if (r - l + 1 - maxFreq <= k) best = Math.max(best, r - l + 1);
    }
  }
  return best;
}
