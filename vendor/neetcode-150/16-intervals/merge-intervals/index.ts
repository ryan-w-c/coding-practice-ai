/**
 * Merge Intervals - Medium
 *
 * https://neetcode.io/problems/merge-intervals
 */

export function mergeIntervals(intervals: [number, number][]): [number, number][] {
    // If there is only one interval or no intervals, return them directly as no merging is needed
    if (intervals.length <= 1) return intervals;

    const result = [];

    // Sort intervals by their start time to ensure correct order for merging
    intervals.sort((a, b) => a[0] - b[0]);

    // Use currentInterval to compare with the subsequent intervals for possible merging
    let currentInterval = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const [currStart, currEnd] = currentInterval;
        const [nextStart, nextEnd] = intervals[i];

        // If current interval overlaps with the next interval, merge them
        if (currEnd >= nextStart) {
            const mergedStart = Math.min(currStart, nextStart);
            const mergedEnd = Math.max(currEnd, nextEnd);
            currentInterval = [mergedStart, mergedEnd];
        } else {
            // If no overlap, add the current interval to the result and move to the next one
            result.push(currentInterval);
            currentInterval = intervals[i];
        }
    }

    // Add the last interval to the result
    result.push(currentInterval);

    return result;

}
