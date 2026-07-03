/**
 * Meeting Schedule - Medium
 *
 * https://neetcode.io/problems/meeting-schedule
 */

export function canAttendAllMeetings(intervals: [number, number][]): boolean {
    // sort intervals by the start time in ascending way
    intervals.sort((a, b) => a[0] - b[0])
    for (let i = 1; i < intervals.length; i++) {

        const currentStartTime = intervals[i][0]
        const lastEndTime = intervals[i - 1][1]
        // confilcts means 
        if (currentStartTime < lastEndTime) {
            return false
        }
    }

    return true;
}
