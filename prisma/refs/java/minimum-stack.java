import java.util.*;

class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public MinStack() {}

    public void push(int val) {
        stack.push(val);
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        stack.pop();
        mins.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
