import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const groupSize = rng.int(1, 5);
    const groups = rng.int(1, 8);
    let hand: number[] = [];
    if (i % 2 === 0) {
      for (let g = 0; g < groups; g++) {
        const start = rng.int(0, 40);
        for (let k = 0; k < groupSize; k++) hand.push(start + k);
      }
    } else {
      hand = rng.ints(groups * groupSize, 0, 30);
    }
    out.push({ name: `${i % 2 === 0 ? "groupable" : "random"} #${i}`, args: [rng.shuffle(hand), groupSize] });
  }
  return out;
}

export function stress(rng: Rng) {
  const hand: number[] = [];
  for (let g = 0; g < 20_000; g++) {
    const start = rng.int(0, 1_000_000);
    for (let k = 0; k < 5; k++) hand.push(start + k);
  }
  return [{ name: "n=100000 groupable size 5", args: [rng.shuffle(hand), 5] }];
}

// repeatedly extract a straight starting at the minimum remaining card
export function brute(hand: number[], groupSize: number): boolean {
  if (hand.length % groupSize !== 0) return false;
  const cards = [...hand].sort((a, b) => a - b);
  while (cards.length) {
    const start = cards[0];
    for (let k = 0; k < groupSize; k++) {
      const at = cards.indexOf(start + k);
      if (at === -1) return false;
      cards.splice(at, 1);
    }
  }
  return true;
}
