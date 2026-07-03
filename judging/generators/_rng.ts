// Deterministic seeded RNG (mulberry32) + helpers for case generators.
// Generators must be pure functions of the Rng so re-running the driver with
// the same seed reproduces the same cases.

export type Rng = {
  /** float in [0, 1) */
  next(): number;
  /** integer in [lo, hi] inclusive */
  int(lo: number, hi: number): number;
  /** pick a random element */
  pick<T>(arr: readonly T[]): T;
  /** random string of `len` chars drawn from `alphabet` */
  str(len: number, alphabet: string): string;
  /** array of `len` ints in [lo, hi] */
  ints(len: number, lo: number, hi: number): number[];
  /** in-place Fisher–Yates shuffle; returns the array */
  shuffle<T>(arr: T[]): T[];
};

export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    str: (len, alphabet) => {
      let s = "";
      for (let i = 0; i < len; i++) s += alphabet[Math.floor(next() * alphabet.length)];
      return s;
    },
    ints: (len, lo, hi) => Array.from({ length: len }, () => rng.int(lo, hi)),
    shuffle: (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
  return rng;
}

export function seedFor(slug: string): number {
  // FNV-1a over the slug: stable per problem, different across problems.
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A generator module (judging/generators/<id>.ts) exports this shape. */
export type Generator = {
  /** small/medium random cases; each is cross-checked against `brute` */
  cases(rng: Rng): { name: string; args: unknown[] }[];
  /** large inputs meant to TLE wrong-complexity solutions; ref-only expected */
  stress?(rng: Rng): { name: string; args: unknown[] }[];
  /** independent second oracle (different algorithm than the ref) */
  brute?(...args: never[]): unknown;
};
