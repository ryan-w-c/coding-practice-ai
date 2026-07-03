/**
 * Evaluate Reverse Polish Notation - Medium
 *
 * https://neetcode.io/problems/evaluate-reverse-polish-notation
 */

export function evalRPN(tokens: string[]): number {
    const stack: number[] = []
    const isOperators = (o: string) => ["+", "-", "*", "/"].includes(o)

    for (let token of tokens) {
        if (isOperators(token)) {
            // pop b first
            const b = stack.pop()!
            const a = stack.pop()!

            let result = 0

            switch (token) {
                case '+':
                    result = a + b
                    break;
                case '-':
                    result = a - b
                    break;
                case '*':
                    result = a * b
                    break;
                case '/':
                    result = Math.trunc(a / b)
                    break;
                default:
                    break;
            }

            stack.push(result)

        } else {
            stack.push(Number.parseInt(token, 10))
        }
    }

    return stack.pop()!
}
