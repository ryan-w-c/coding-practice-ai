import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

function input(rng: Rng, n: number, target: number) {
  const position = rng.shuffle(sortedDistinct(rng, n, -1, Math.max(1, Math.floor(target / n) || 1)))
    .map((p) => Math.min(p, target - 1)).filter((p, i, a) => a.indexOf(p) === i);
  const speed = position.map(() => rng.int(1, 10));
  return { position, speed };
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const target = rng.int(10, 1000);
    const { position, speed } = input(rng, rng.int(1, 50), target);
    out.push({ name: `random #${i} (n=${position.length})`, args: [target, position, speed] });
  }
  out.push({ name: "single car", args: [100, [0], [1]] });
  out.push({ name: "all same speed no merging", args: [100, [0, 50], [5, 5]] });
  out.push({ name: "faster car catches slower", args: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]] });
  return out;
}

export function stress(rng: Rng) {
  const target = 10_000_000;
  const position = rng.shuffle(sortedDistinct(rng, 100_000, -1, 90));
  const speed = position.map(() => rng.int(1, 100));
  return [{ name: "n=100000 cars", args: [target, position, speed] }];
}

// O(n^2): car i leads a fleet iff no car ahead of it arrives later-or-equal
export function brute(target: number, position: number[], speed: number[]): number {
  const n = position.length;
  const time = position.map((p, i) => (target - p) / speed[i]);
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    let blocked = false;
    for (let j = 0; j < n; j++) {
      if (position[j] > position[i] && time[j] >= time[i]) { blocked = true; break; }
    }
    if (!blocked) fleets++;
  }
  return fleets;
}
