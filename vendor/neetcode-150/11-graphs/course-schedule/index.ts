/**
 * Course Schedule - Medium
 *
 * https://neetcode.io/problems/course-schedule
 */
export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // Step 1: Initialize adjacency list and in-degree array
    const adjList: number[][] = Array.from({ length: numCourses }, () => [] as number[]);
    const indegree: number[] = new Array(numCourses).fill(0);

    // Step 2: Build the graph
    for (let [a, b] of prerequisites) {
        adjList[b].push(a);
        indegree[a]++;
    }

    // Step 3: Find all nodes with zero in-degree and add them to the queue
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }

    // Step 4: Process nodes in topological order
    let courseTaken = 0;
    while (queue.length > 0) {
        const currentNode = queue.shift()!;
        courseTaken++;

        // Visit all downstream nodes (courses dependent on current course)
        for (let neighbor of adjList[currentNode]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }

    // Step 5: Check if all courses have been taken
    return courseTaken === numCourses;
}