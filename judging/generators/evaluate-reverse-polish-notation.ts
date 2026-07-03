import type { Rng } from "./_rng";

// Build a random expression tree, evaluating as we go so divisors are never 0.
function build(rng: Rng, budget: number): { tokens: string[]; value: number } {
  if (budget <= 1 || rng.next() < 0.3) {
    const v = rng.int(-20, 20);
    return { tokens: [String(v)], value: v };
  }
  const left = build(rng, budget >> 1);
  const right = build(rng, budget >> 1);
  let op = rng.pick(["+", "-", "*", "/"]);
  if (op === "/" && right.value === 0) op = "+";
  // keep magnitudes bounded so long expressions never overflow int range
  if (op === "*" && Math.abs(left.value) * Math.abs(right.value) > 1_000_000)
    op = right.value === 0 ? "+" : "/";
  let value: number;
  if (op === "+") value = left.value + right.value;
  else if (op === "-") value = left.value - right.value;
  else if (op === "*") value = left.value * right.value;
  else value = Math.trunc(left.value / right.value); // LC: division truncates toward zero
  if (Math.abs(value) > 1_000_000) {
    // fall back to subtraction, which keeps |value| <= |left| + |right|
    op = "-";
    value = left.value - right.value;
  }
  return { tokens: [...left.tokens, ...right.tokens, op], value };
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random expression #${i}`, args: [build(rng, rng.int(2, 60)).tokens] });
  }
  out.push({ name: "single number", args: [["42"]] });
  out.push({ name: "negative division truncates toward zero", args: [["7", "-2", "/"]] });
  out.push({ name: "negative numerator", args: [["-7", "2", "/"]] });
  return out;
}

export function stress(rng: Rng) {
  // left-deep chain: v op v op v op ... (recursive build shrinks too fast)
  const tokens: string[] = [String(rng.int(-20, 20))];
  let value = Number(tokens[0]);
  for (let i = 0; i < 40_000; i++) {
    const v = rng.int(-20, 20);
    let op = rng.pick(["+", "-", "*", "/"]);
    if (op === "/" && v === 0) op = "+";
    if (op === "*" && Math.abs(value) * Math.abs(v) > 1_000_000) op = v === 0 ? "+" : "/";
    tokens.push(String(v), op);
    if (op === "+") value += v;
    else if (op === "-") value -= v;
    else if (op === "*") value *= v;
    else value = Math.trunc(value / v);
  }
  return [{ name: "n~80000 token chain", args: [tokens] }];
}

// evaluate recursively from the END of the token list
export function brute(tokens: string[]): number {
  let i = tokens.length - 1;
  const evalAt = (): number => {
    const t = tokens[i--];
    if (!["+", "-", "*", "/"].includes(t)) return Number(t);
    const right = evalAt();
    const left = evalAt();
    if (t === "+") return left + right;
    if (t === "-") return left - right;
    if (t === "*") return left * right;
    return Math.trunc(left / right);
  };
  return evalAt();
}
