import type { Rng } from "./_rng";

const AIRPORTS = ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"];

// tickets from a random walk starting at JFK: always a valid itinerary
function walkTickets(rng: Rng, legs: number, spread: number): string[][] {
  const stops = ["JFK", ...AIRPORTS.slice(0, spread)];
  const tickets: string[][] = [];
  let at = "JFK";
  for (let i = 0; i < legs; i++) {
    let next = rng.pick(stops);
    while (next === at) next = rng.pick(stops);
    tickets.push([at, next]);
    at = next;
  }
  return rng.shuffle(tickets);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random walk #${i}`, args: [walkTickets(rng, rng.int(1, 9), rng.int(2, 5))] });
  }
  return out;
}

export function stress(rng: Rng) {
  // greedy-without-backtracking fails structurally; naive full backtracking blows up
  return [{ name: "280-ticket walk", args: [walkTickets(rng, 280, 6)] }];
}

// lexical-first DFS backtracking (small inputs only)
export function brute(tickets: string[][]): string[] {
  const adj = new Map<string, string[]>();
  for (const [f, t] of tickets) {
    if (!adj.has(f)) adj.set(f, []);
    adj.get(f)!.push(t);
  }
  for (const list of adj.values()) list.sort();
  const route = ["JFK"];
  const total = tickets.length;
  const dfs = (at: string, used: number): boolean => {
    if (used === total) return true;
    const dests = adj.get(at);
    if (!dests) return false;
    for (let i = 0; i < dests.length; i++) {
      const next = dests[i];
      if (next === "#") continue;
      dests[i] = "#";
      route.push(next);
      if (dfs(next, used + 1)) return true;
      route.pop();
      dests[i] = next;
    }
    return false;
  };
  dfs("JFK", 0);
  return route;
}
