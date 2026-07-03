/**
 * Car Fleet - Medium
 *
 * https://neetcode.io/problems/car-fleet
 */


export function carFleet(target: number, position: number[], speed: number[]): number {
    // Combine position and speed into a single array where each element is [position, speed]
    const cars = position.map((pos, idx) => [pos, speed[idx]]);

    // Sort cars by their position in descending order so that we start processing from the car closest to the target
    cars.sort((a, b) => b[0] - a[0]);

    let fleets = 0;  // Initialize the number of car fleets
    let timeToReachTarget = 0;  // Time taken by the current fleet to reach the target

    // Iterate through the sorted cars array
    for (let car of cars) {
        const [pos, spd] = car;
        // Calculate the time needed for the current car to reach the target
        const time = (target - pos) / spd;

        // If the current car's time to reach the target is greater than the timeToReachTarget of the last fleet,
        // it means this car cannot catch up with the previous fleet and forms a new fleet
        if (time > timeToReachTarget) {
            fleets++;  // Increment the fleet count since a new fleet is formed
            timeToReachTarget = time;  // Update the time for the new fleet to reach the target
        }
    }

    // Return the total number of fleets that will reach the target
    return fleets;
}
