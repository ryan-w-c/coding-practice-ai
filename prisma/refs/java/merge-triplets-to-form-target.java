class Solution {
    public boolean mergeTriplets(int[][] triplets, int[] target) {
        boolean[] achieved = new boolean[3];
        for (int[] t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
            for (int i = 0; i < 3; i++) if (t[i] == target[i]) achieved[i] = true;
        }
        return achieved[0] && achieved[1] && achieved[2];
    }
}
