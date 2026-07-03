/**
 * K Closest Points to Origin - Medium
 *
 * https://neetcode.io/problems/k-closest-points-to-origin
 */



export function kClosest(points: number[][], k: number): number[][] {
    // Step 1: Sort points based on their distance from the origin in ascending order
    const sortedPoints = points.sort((a, b) => {
        // Calculate Euclidean distance for point a from the origin (0, 0)
        const distanceA = a[0] * a[0] + a[1] * a[1];
        // Calculate Euclidean distance for point b from the origin (0, 0)
        const distanceB = b[0] * b[0] + b[1] * b[1];

        return distanceA - distanceB; // Sort in ascending order based on distance
    });

    // Step 2: Return the first k points from the sorted list
    return sortedPoints.slice(0, k);
}
