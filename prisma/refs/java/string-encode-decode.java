import java.util.*;

class Codec {
    public String encode(List<String> strs) {
        StringBuilder b = new StringBuilder();
        for (String s : strs) b.append(s.length()).append('#').append(s);
        return b.toString();
    }

    public List<String> decode(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int hash = s.indexOf('#', i);
            int len = Integer.parseInt(s.substring(i, hash));
            out.add(s.substring(hash + 1, hash + 1 + len));
            i = hash + 1 + len;
        }
        return out;
    }
}
