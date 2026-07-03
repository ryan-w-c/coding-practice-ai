import java.util.*;

class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        Map<Character, String> mp = Map.of(
            '2', "abc", '3', "def", '4', "ghi", '5', "jkl",
            '6', "mno", '7', "pqrs", '8', "tuv", '9', "wxyz");
        res.add("");
        for (char d : digits.toCharArray()) {
            List<String> next = new ArrayList<>();
            for (String p : res)
                for (char c : mp.get(d).toCharArray()) next.add(p + c);
            res = next;
        }
        return res;
    }
}
