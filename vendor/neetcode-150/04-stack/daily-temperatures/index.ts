/**
 * Daily Temperatures - Medium
 *
 * https://neetcode.io/problems/daily-temperatures
 */

export function dailyTemperatures(temperatures: number[]): number[] {
    // store index looking for higher temperatures
    const stack: number[] = []
    const result: number[] = Array.from({ length: temperatures.length }, () => 0)

    for (let i = 0; i < temperatures.length; i++) {
        const peakStackTop = (stack: number[]) => stack[stack.length - 1]
        while (stack.length > 0 && temperatures[i] > temperatures[peakStackTop(stack)]) {
            const idx = stack.pop()!
            result[idx] = i - idx
        }
        stack.push(i)
    }

    return result
}
