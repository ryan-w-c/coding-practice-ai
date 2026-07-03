import { describe, it, expect } from "bun:test";
import { MinStack } from "./index";

describe("Minimum Stack", () => {
    it("should correctly perform push, pop, top, and getMin operations", () => {
        const minStack = new MinStack();

        minStack.push(1);
        minStack.push(2);
        minStack.push(0);

        expect(minStack.getMin()).toBe(0); // The minimum element should be 0

        minStack.pop();

        expect(minStack.top()).toBe(2);    // The top element should be 2
        expect(minStack.getMin()).toBe(1); // The minimum element should be 1
    });

    it("should handle push and pop of multiple elements while maintaining correct min", () => {
        const minStack = new MinStack();

        minStack.push(3);
        minStack.push(5);
        expect(minStack.getMin()).toBe(3);

        minStack.push(2);
        minStack.push(1);
        expect(minStack.getMin()).toBe(1);

        minStack.pop();
        expect(minStack.getMin()).toBe(2);

        minStack.pop();
        expect(minStack.getMin()).toBe(3);
    });

    it("should handle pushing duplicate minimum values correctly", () => {
        const minStack = new MinStack();

        minStack.push(2);
        minStack.push(2);
        minStack.push(3);
        expect(minStack.getMin()).toBe(2);

        minStack.pop();
        expect(minStack.getMin()).toBe(2);

        minStack.pop();
        expect(minStack.getMin()).toBe(2);
    });

    it("should correctly return the top element", () => {
        const minStack = new MinStack();

        minStack.push(10);
        minStack.push(20);
        expect(minStack.top()).toBe(20);

        minStack.pop();
        expect(minStack.top()).toBe(10);
    });
});
