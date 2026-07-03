/**
 * Time Based Key-Value Store - Medium
 *
 * https://neetcode.io/problems/time-based-key-value-store
 */

type TimeValue = {
    timestamp: number;
    value: string;
};

export class TimeMap {
    private store: Map<string, TimeValue[]>;

    constructor() {
        this.store = new Map();
    }

    set(key: string, value: string, timestamp: number): void {
        // If the key doesn't exist, initialize it with an empty array
        if (!this.store.has(key)) {
            this.store.set(key, [])
        }
        // Add the new {timestamp, value} pair to the array for the given key
        this.store.get(key)!.push({ timestamp, value })
    }

    get(key: string, timestamp: number): string {
        // If the key does not exist, return an empty string
        if (!this.store.has(key)) return ''

        // Retrieve the array of values associated with the key
        const values = this.store.get(key) || [];

        let res = ''
        let left = 0
        let right = values?.length - 1;

        // Perform binary search to find the most recent value with timestamp <= given timestamp
        while (left <= right) {
            const mid = Math.floor((right + left) / 2)
            // If the current timestamp is less than or equal to the given timestamp
            if (values[mid].timestamp <= timestamp) {
                // Update the result with the current value, as it is a potential match
                res = values[mid].value
                // Move to the right to see if there's a more recent value
                left = mid + 1
            } else {
                // If the current timestamp is greater than the given timestamp, search the left half
                right = mid - 1
            }
        }

        return res
    }
}
