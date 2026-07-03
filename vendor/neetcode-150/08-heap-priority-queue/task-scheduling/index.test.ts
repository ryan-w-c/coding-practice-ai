import { describe, it, expect } from "bun:test";
import { leastInterval } from "./index";

describe("Task Scheduling", () => {
    it("should return 5 for input tasks ['X', 'X', 'Y', 'Y'] with cooldown 2", () => {
        const tasks = ["X", "X", "Y", "Y"];
        const n = 2;
        expect(leastInterval(tasks, n)).toBe(5);
    });

    it("should return 9 for input tasks ['A', 'A', 'A', 'B', 'C'] with cooldown 3", () => {
        const tasks = ["A", "A", "A", "B", "C"];
        const n = 3;
        expect(leastInterval(tasks, n)).toBe(9);
    });

    it("should return 6 for input tasks ['A', 'A', 'A', 'B', 'B', 'B'] with cooldown 2", () => {
        const tasks = ["A", "A", "A", "B", "B", "B"];
        const n = 2;
        expect(leastInterval(tasks, n)).toBe(8);
    });

    it("should return 4 for input tasks ['A', 'B', 'A', 'B'] with cooldown 1", () => {
        const tasks = ["A", "B", "A", "B"];
        const n = 1;
        expect(leastInterval(tasks, n)).toBe(4);
    });

    it("should return 2 for input tasks ['A', 'B'] with cooldown 0", () => {
        const tasks = ["A", "B"];
        const n = 0;
        expect(leastInterval(tasks, n)).toBe(2);
    });
});
