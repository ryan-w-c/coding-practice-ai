import type { Rng } from "./_rng";
import { word } from "./_shared";

const TRICKY = " #0123456789#:;|,\\\"'";

export function cases(rng: Rng) {
  const out: { name: string; data: unknown }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(0, 40);
    const strs = Array.from({ length: n }, () => {
      const alpha = rng.next() < 0.5 ? "abcdefghij" + TRICKY : "abcdefghijklmnopqrstuvwxyz";
      return rng.next() < 0.15 ? "" : word(rng, 0, 25, alpha);
    });
    out.push({ name: `random with delimiters #${i} (n=${n})`, data: strs });
  }
  out.push({ name: "numbers-as-strings", data: ["12", "3#4", "#", "", "5"] });
  out.push({ name: "long single string", data: [word(rng, 5000, 5000)] });
  return out;
}
