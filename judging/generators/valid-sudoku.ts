import type { Rng } from "./_rng";

// a complete valid sudoku solution to sample from
const SOLVED = [
  "534678912", "672195348", "198342567",
  "859761423", "426853791", "713924856",
  "961537284", "287419635", "345286179",
].map((row) => [...row]);

function partial(rng: Rng, keepPct: number): string[][] {
  return SOLVED.map((row) => row.map((c) => (rng.next() < keepPct ? c : ".")));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 5; i++) {
    out.push({ name: `valid partial #${i}`, args: [partial(rng, rng.next() * 0.7 + 0.15)] });
  }
  for (let i = 0; i < 5; i++) {
    const b = partial(rng, 0.4);
    // inject a duplicate into a random row, column, or box
    const kind = i % 3;
    const r = rng.int(0, 8), c = rng.int(0, 8);
    const v = SOLVED[r][c];
    b[r][c] = v;
    if (kind === 0) b[r][(c + rng.int(1, 8)) % 9] = v;              // row dupe
    else if (kind === 1) b[(r + rng.int(1, 8)) % 9][c] = v;          // col dupe
    else {
      const br = r - (r % 3), bc = c - (c % 3);
      let rr = br + rng.int(0, 2), cc = bc + rng.int(0, 2);
      if (rr === r && cc === c) { rr = br + ((r + 1) % 3); }
      b[rr][cc] = v;                                                  // box dupe
    }
    out.push({ name: `invalid ${["row", "column", "box"][kind]} duplicate #${i}`, args: [b] });
  }
  return out;
}

export function brute(board: string[][]): boolean {
  for (let unit = 0; unit < 9; unit++) {
    const row: string[] = [], col: string[] = [], box: string[] = [];
    for (let i = 0; i < 9; i++) {
      row.push(board[unit][i]);
      col.push(board[i][unit]);
      box.push(board[3 * Math.floor(unit / 3) + Math.floor(i / 3)][3 * (unit % 3) + (i % 3)]);
    }
    for (const cells of [row, col, box]) {
      const digits = cells.filter((x) => x !== ".");
      if (new Set(digits).size !== digits.length) return false;
    }
  }
  return true;
}
