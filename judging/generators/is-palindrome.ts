import type { Rng } from "./_rng";

const ALNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const NOISE = " ,.:;!?'\"()-_/@#";

function withNoise(rng: Rng, core: string): string {
  let s = "";
  for (const c of core) {
    while (rng.next() < 0.3) s += rng.pick([...NOISE]);
    s += rng.next() < 0.5 ? c.toUpperCase() : c.toLowerCase();
  }
  while (rng.next() < 0.3) s += rng.pick([...NOISE]);
  return s;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 6; i++) {
    // true palindrome core, then case/punctuation noise
    const half = rng.str(rng.int(1, 40), "abcdefghijklmnopqrstuvwxyz0123456789");
    const mid = rng.next() < 0.5 ? rng.pick([..."xyz09"]) : "";
    out.push({ name: `noisy palindrome #${i}`, args: [withNoise(rng, half + mid + [...half].reverse().join(""))] });
  }
  for (let i = 0; i < 5; i++) {
    out.push({ name: `random #${i}`, args: [rng.str(rng.int(1, 80), ALNUM + NOISE)] });
  }
  out.push({ name: "punctuation only", args: [",.! ?"] });
  out.push({ name: "single letter with noise", args: [" a."] });
  out.push({ name: "near-palindrome (one char off)", args: ["ab@ba c"] });
  return out;
}

export function stress(rng: Rng) {
  const half = rng.str(50_000, "abcdefghijklmnopqrstuvwxyz0123456789");
  return [{ name: "n=100000 palindrome with noise", args: [half + [...half].reverse().join("")] }];
}

export function brute(s: string): boolean {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return t === [...t].reverse().join("");
}
