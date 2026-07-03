import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const target = [rng.int(1, 50), rng.int(1, 50), rng.int(1, 50)];
    const triplets: number[][] = [];
    for (let k = rng.int(1, 15); k > 0; k--) {
      triplets.push([rng.int(1, 60), rng.int(1, 60), rng.int(1, 60)]);
    }
    if (i % 2 === 0) {
      // plant achievers for each axis (still may exceed on other axes randomly)
      for (let axis = 0; axis < 3; axis++) {
        const t = [rng.int(1, target[0]), rng.int(1, target[1]), rng.int(1, target[2])];
        t[axis] = target[axis];
        triplets.push(t);
      }
    }
    out.push({ name: `random #${i}`, args: [rng.shuffle(triplets), target] });
  }
  return out;
}

export function stress(rng: Rng) {
  const target = [500, 500, 500];
  const triplets = Array.from({ length: 100_000 }, () => [rng.int(1, 1000), rng.int(1, 1000), rng.int(1, 1000)]);
  return [{ name: "n=100000", args: [triplets, target] }];
}

export function brute(triplets: number[][], target: number[]): boolean {
  // try all merges implicitly: axis coverage by usable triplets
  const usable = triplets.filter((t) => t.every((v, i) => v <= target[i]));
  return [0, 1, 2].every((axis) => usable.some((t) => t[axis] === target[axis]));
}
