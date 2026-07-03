import { describe, it, expect } from "bun:test";
import { carFleet } from "./index";

describe("Car Fleet", () => {
    it("should return 1 for target = 10, position = [1, 4], speed = [3, 2]", () => {
        const target = 10;
        const position = [1, 4];
        const speed = [3, 2];
        const result = carFleet(target, position, speed);
        expect(result).toBe(1);
    });

    it("should return 3 for target = 10, position = [4, 1, 0, 7], speed = [2, 2, 1, 1]", () => {
        const target = 10;
        const position = [4, 1, 0, 7];
        const speed = [2, 2, 1, 1];
        const result = carFleet(target, position, speed);
        expect(result).toBe(3);
    });

    it("should return 3 for target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]", () => {
        const target = 12;
        const position = [10, 8, 0, 5, 3];
        const speed = [2, 4, 1, 1, 3];
        const result = carFleet(target, position, speed);
        expect(result).toBe(3);
    });

    it("should return 1 for target = 100, position = [0], speed = [1]", () => {
        const target = 100;
        const position = [0];
        const speed = [1];
        const result = carFleet(target, position, speed);
        expect(result).toBe(1);
    });

    it("should return 0 when no cars are present", () => {
        const target = 10;
        const position: number[] = [];
        const speed: number[] = [];
        const result = carFleet(target, position, speed);
        expect(result).toBe(0);
    });
});
