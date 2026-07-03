/**
 * Insert New Interval - Medium
 *
 * https://neetcode.io/problems/insert-new-interval
 */

export function insertInterval(intervals: [number, number][], newInterval: [number, number]): [number, number][] {
    const reuslt: [number, number][] = []

    // Destructure the newInterval to get its start and end time.
    // This allows us to easily update nextStart and nextEnd when merging overlapping intervals.
    let [newStart, newEnd] = newInterval
    let i = 0

    // Add all intervals that come before the newInterval (no overlap)
    while (i < intervals.length && intervals[i][1] < newStart) {
        reuslt.push(intervals[i])
        i++;
    }

    // Merge all overlapping intervals with newInterval
    while (i < intervals.length && intervals[i][0] <= newEnd) {
        const [currentStart, currentEnd] = intervals[i];
        newStart = Math.min(newStart, currentStart);
        newEnd = Math.max(newEnd, currentEnd);
        i++;
    }
    // Add the merged interval
    reuslt.push([newStart, newEnd])


    // Add the remaining intervals
    while (i < intervals.length) {
        reuslt.push(intervals[i])
        i++
    }


    return reuslt
}
