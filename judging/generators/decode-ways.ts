import type { Rng } from "./_rng";

// BigInt-exact count used both as the oracle and to reject >32-bit answers
function exact(s: string): bigint {
  if (!s.length || s[0] === "0") return 0n;
  let prev = 1n, cur = 1n;
  for (let i = 1; i < s.length; i++) {
    let ways = 0n;
    if (s[i] !== "0") ways += cur;
    const two = Number(s.slice(i - 1, i + 1));
    if (two >= 10 && two <= 26) ways += prev;
    prev = cur;
    cur = ways;
  }
  return cur;
}

function randomDigits(rng: Rng, n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += String(rng.int(0, 9));
  return s;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 400) {
    const s = randomDigits(rng, rng.int(1, 40));
    if (exact(s) > 2n ** 31n - 1n) continue;
    out.push({ name: `random #${out.length}`, args: [s] });
  }
  return out;
}

export function stress(rng: Rng) {
  // long decodable string with answer capped by frequent 0-pairs
  let s = "";
  while (s.length < 2000) s += rng.pick(["10", "20", "30" === "30" ? "1" : "1", "5"]);
  // ensure validity: strip any "30"-style invalid runs by regenerating deterministically
  s = "";
  while (s.length < 2000) s += rng.pick(["10", "20", "11", "5", "9"]);
  if (exact(s) > 2n ** 31n - 1n) s = "10".repeat(1000);
  return [{ name: "n~2000 decodable", args: [s] }];
}

export function brute(s: string): number {
  return Number(exact(s));
}
