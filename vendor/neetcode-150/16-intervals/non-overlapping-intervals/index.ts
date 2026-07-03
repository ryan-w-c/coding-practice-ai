/**
 * Non-overlapping Intervals - Medium
 *
 * https://neetcode.io/problems/non-overlapping-intervals
 */

export function eraseOverlapIntervals(intervals: [number, number][]): number {
    if (intervals.length <= 1) return 0;

    // Sort intervals by their end time, preferring those that finish earlier to minimize overlap
    intervals.sort((a, b) => a[1] - b[1]);

    // Initialize the count of intervals to be removed
    let count = 0;

    // Pick the first interval as the current interval to compare with others
    let current = intervals[0];

    // Loop through the remaining intervals
    for (let i = 1; i < intervals.length; i++) {
        const [currentStart, currentEnd] = current;
        const [nextStart, nextEnd] = intervals[i];

        if (currentEnd > nextStart) {
            // If there is an overlap with the next interval, increment the count
            count++;
        } else {
            // If no overlap, move to the next interval and make it the current interval
            current = intervals[i];
        }
    }

    // Return the count of intervals that need to be removed
    return count;
}
