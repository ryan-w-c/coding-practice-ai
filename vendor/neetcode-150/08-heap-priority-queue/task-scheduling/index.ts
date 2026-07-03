/**
 * Task Scheduling - Medium
 *
 * https://neetcode.io/problems/task-scheduling
 */


export function leastInterval(tasks: string[], n: number): number {
    // Step 1: Count Task Frequency
    // 1.1: Initialize an array of length 26 to store task frequencies ('A' to 'Z')
    const taskCount: number[] = new Array(26).fill(0);

    // 1.2: Calculate the frequency of each task
    for (let task of tasks) {
        const idx = task.charCodeAt(0) - 'A'.charCodeAt(0);
        taskCount[idx]++;
    }

    // 1.3: Sort frequencies in descending order to prioritize high-frequency tasks
    taskCount.sort((a, b) => b - a);

    // Step 2: Calculate Initial Idle Slots
    // 2.1: Get the highest task frequency
    const maxFrequency = taskCount[0];

    // 2.2: Calculate initial idle slots needed based on the most frequent task
    // (maxFrequency - 1) groups, each requiring n idle slots
    let bucketSlots = (maxFrequency - 1) * n;

    // Step 3: Update Idle Slots
    // 3.1: Use other tasks to fill idle slots
    for (let i = 1; i < taskCount.length && bucketSlots > 0; i++) {
        const currentTaskCount = taskCount[i];
        const bucketCount = maxFrequency - 1;

        // Fill idle slots with as many of the current task as possible
        if (currentTaskCount >= bucketCount) {
            bucketSlots -= bucketCount;
        } else {
            bucketSlots -= currentTaskCount;
        }
    }

    // 3.2: Ensure idle slots are not negative
    bucketSlots = Math.max(bucketSlots, 0);

    // Step 4: Return total time needed to complete all tasks
    return tasks.length + bucketSlots;
}
