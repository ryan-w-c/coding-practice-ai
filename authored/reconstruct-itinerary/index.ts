/**
 * Reconstruct Itinerary - Hard
 *
 * https://leetcode.com/problems/reconstruct-itinerary/
 */

export function findItinerary(tickets: string[][]): string[] {
  const adj = new Map<string, string[]>();
  for (const [f, t] of tickets) {
    if (!adj.has(f)) adj.set(f, []);
    adj.get(f)!.push(t);
  }
  for (const list of adj.values()) list.sort().reverse(); // pop() gives smallest
  const out: string[] = [];
  const stack = ["JFK"];
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const dests = adj.get(cur);
    if (dests && dests.length) {
      stack.push(dests.pop()!);
    } else {
      out.push(stack.pop()!);
    }
  }
  return out.reverse();
}
