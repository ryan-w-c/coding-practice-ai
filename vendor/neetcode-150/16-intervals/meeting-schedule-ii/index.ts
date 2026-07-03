/**
 * Meeting Schedule II - Medium
 *
 * https://neetcode.io/problems/meeting-schedule-ii
 */

export function minMeetingDays(meetings: [number, number][]): number {
    if (meetings.length === 0) return 0;

    // Sort meetings by their start time
    meetings.sort((a, b) => a[0] - b[0]);

    // Initialize a min heap to track end times of ongoing meetings
    const minHeap: number[] = [];

    // Loop through each meeting interval
    for (let meeting of meetings) {
        const [currentStartTime, currentEndTime] = meeting;
        const prevEndTime = minHeap[0];

        // If the earliest ending meeting ends before or when the current meeting starts,
        // remove it from the heap since there is no conflict, i.e., the meeting room becomes free.
        if (minHeap.length > 0 && prevEndTime <= currentStartTime) {
            minHeap.shift();
        }

        // Add the current meeting's end time to the heap
        minHeap.push(currentEndTime);

        // Sort the heap to ensure that the earliest end time is always at the top
        minHeap.sort((a, b) => a - b);
    }

    // The length of the heap represents the minimum number of meeting rooms/days required
    return minHeap.length;
}
