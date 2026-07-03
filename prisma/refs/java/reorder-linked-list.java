class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null;
        while (second != null) {
            ListNode nx = second.next;
            second.next = prev;
            prev = second;
            second = nx;
        }
        ListNode first = head;
        while (prev != null) {
            ListNode fn = first.next, rn = prev.next;
            first.next = prev;
            prev.next = fn;
            first = fn;
            prev = rn;
        }
    }
}
