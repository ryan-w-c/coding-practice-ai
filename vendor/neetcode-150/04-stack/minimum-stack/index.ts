/**
 * Minimum Stack - Medium
 *
 * https://neetcode.io/problems/minimum-stack
 */

class MinStack {
    private stack: number[] = []
    private minStack: number[] = []

    constructor() {
        this.stack = []
        this.minStack = []
    }

    push(val: number): void {
        this.stack.push(val)
        if (this.minStack.length === 0 || this.getMin() >= val) {
            this.minStack.push(val)
        }
    }

    pop(): void {
        const removed = this.stack.pop()
        if (removed === this.getMin()) {
            this.minStack.pop()
        }
    }

    top(): number {
        return this.stack[this.stack.length - 1]
    }

    getMin(): number {
        return this.minStack[this.minStack.length - 1]
    }
}

export { MinStack };
