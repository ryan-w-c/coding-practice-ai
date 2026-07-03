class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        int n = lists.length;
        while (n > 1) {
            int k = 0;
            for (int i = 0; i < n; i += 2)
                lists[k++] = i + 1 < n ? merge2(lists[i], lists[i + 1]) : lists[i];
            n = k;
        }
        return lists[0];
    }

    private ListNode merge2(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), cur = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) {
                cur.next = a;
                a = a.next;
            } else {
                cur.next = b;
                b = b.next;
            }
            cur = cur.next;
        }
        cur.next = a != null ? a : b;
        return dummy.next;
    }
}
