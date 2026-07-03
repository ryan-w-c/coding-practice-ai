/**
 * Cheapest Flight Path - Medium
 *
 * https://neetcode.io/problems/cheapest-flight-path
 */

export function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    // Step 1: Build graph using adjacent list representation
    const graph = new Map<number, [number, number][]>();
    for (let [from, to, price] of flights) {
        if (!graph.has(from)) {
            graph.set(from, []);
        }
        graph.get(from)!.push([to, price]);
    }

    // Step 2: Build queue for BFS [airport, currentCost, stops]
    const queue: [number, number, number][] = [[src, 0, 0]];
    const minCosts: number[] = new Array(n).fill(Infinity);
    minCosts[src] = 0;

    // Step 3: BFS to explore all flights starting from src
    while (queue.length > 0) {
        const [currentNode, currentCost, stops] = queue.shift()!;

        // Step 3.1: If the number of stops exceeds the allowed value, skip this path
        if (stops > k) {
            continue; // Skip processing this node and go to the next one in the queue
        }

        // Step 3.2: If valid, explore neighbors
        if (graph.has(currentNode)) {
            for (let [to, price] of graph.get(currentNode)!) {
                const newCost = currentCost + price;

                // If a cheaper path to `to` is found, update and continue BFS
                if (newCost < minCosts[to]) {
                    minCosts[to] = newCost;
                    queue.push([to, newCost, stops + 1]);
                }
            }
        }
    }

    // Step 4: Check if destination is reachable
    return minCosts[dst] === Infinity ? -1 : minCosts[dst];
}
