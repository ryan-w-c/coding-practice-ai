// Java judging harness. Compile: javac Harness.java <Solution>.java
// Run: java Harness case.json   → emits the LLJUDGE protocol (docs/multi-language-judging.md §4)
//
// All classes live in this one file (only Harness is public) so a single
// `javac Harness.java Solution.java` compiles everything in the default package,
// and the user's solution can reference ListNode / TreeNode directly.

import java.lang.reflect.*;
import java.util.*;

public class Harness {
    @SuppressWarnings("unchecked")
    public static void main(String[] argv) throws Exception {
        String json = new String(
            java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(argv[0])),
            java.nio.charset.StandardCharsets.UTF_8);
        Map<String, Object> m = (Map<String, Object>) Json.parse(json);
        String kind = (String) m.get("kind");
        String comparator = (String) m.getOrDefault("comparator", "exact");
        List<Object> cases = (List<Object>) m.get("cases");

        int passed = 0;
        for (int ci = 0; ci < cases.size(); ci++) {
            Map<String, Object> c = (Map<String, Object>) cases.get(ci);
            String name = String.valueOf(c.getOrDefault("name", "case " + ci));
            try {
                if ("sequence".equals(kind)) {
                    if (runSequence((String) m.get("class"), (List<Object>) c.get("steps"), ci, name)) {
                        passed++;
                        emit(ci, name, "pass", null, null, null);
                    }
                } else if ("roundtrip".equals(kind)) {
                    if (runRoundtrip(m, c.get("data"), ci, name)) {
                        passed++;
                        emit(ci, name, "pass", null, null, null);
                    }
                } else {
                    Object got = runFunction(m, (List<Object>) c.get("args"), ci, name);
                    if (got == FAILED) continue;
                    Object want = c.get("expected");
                    if (Cmp.compare(comparator, got, want)) {
                        passed++;
                        emit(ci, name, "pass", got, null, null);
                    } else {
                        emit(ci, name, "fail", got, want, null);
                    }
                }
            } catch (Throwable t) {
                Throwable cause = (t instanceof InvocationTargetException && t.getCause() != null) ? t.getCause() : t;
                emit(ci, name, "error", null, null, cause.toString());
            }
        }
        System.out.println("LLJUDGE-SUMMARY {\"passed\": " + passed + ", \"total\": " + cases.size() + "}");
    }

    static final Object FAILED = new Object(); // sentinel: fail already emitted

    @SuppressWarnings("unchecked")
    static Object runFunction(Map<String, Object> m, List<Object> args, int ci, String name) throws Exception {
        String entry = (String) m.get("entry");
        String returnType = (String) m.get("returnType");
        List<Object> argTypes = (List<Object>) m.getOrDefault("argTypes", new ArrayList<>());
        Object inst = Class.forName("Solution").getDeclaredConstructor().newInstance();
        Method mm = findMethod(inst.getClass(), entry, args.size());
        mm.setAccessible(true);
        Object[] coerced = Coerce.args(mm.getGenericParameterTypes(), args, argTypes);
        Object r = mm.invoke(inst, coerced);
        if (mm.getReturnType() == void.class) r = null;
        Object mustCopy = m.get("mustCopy");
        if (mustCopy != null && Serde.sharesNodes(coerced[((Number) mustCopy).intValue()], r)) {
            emit(ci, name, "fail", "(result shares nodes with the input)", null, "must return a deep copy");
            return FAILED;
        }
        Object resultFrom = m.get("resultFrom");
        Object src = resultFrom != null ? coerced[((Number) resultFrom).intValue()] : r;
        return Serde.serialize(src, resultFrom != null ? (String) argTypes.get(((Number) resultFrom).intValue()) : returnType);
    }

    static boolean runRoundtrip(Map<String, Object> m, Object data, int ci, String name) throws Exception {
        String dataType = (String) m.get("dataType");
        Class<?> cls = Class.forName((String) m.get("class"));
        Object inst = cls.getDeclaredConstructor().newInstance();
        Method enc = findMethod(cls, (String) m.get("encode"), 1);
        Method dec = findMethod(cls, (String) m.get("decode"), 1);
        enc.setAccessible(true);
        dec.setAccessible(true);
        Object arg = Coerce.to(data, enc.getGenericParameterTypes()[0], dataType);
        Object encoded = enc.invoke(inst, arg);
        Object decoded = dec.invoke(inst, encoded);
        Object got = Serde.serialize(decoded, dataType);
        if (Cmp.compare("exact", got, data)) return true;
        emit(ci, name, "fail", got, data, m.get("decode") + "(" + m.get("encode") + "(data)) != data");
        return false;
    }

    @SuppressWarnings("unchecked")
    static boolean runSequence(String className, List<Object> steps, int ci, String name) throws Exception {
        Class<?> cls = Class.forName(className);
        Object inst = null;
        for (Object so : steps) {
            Map<String, Object> step = (Map<String, Object>) so;
            String method = (String) step.get("method");
            List<Object> args = (List<Object>) step.get("args");
            Object want = step.get("expected");
            if ("constructor".equals(method)) {
                Constructor<?> ctor = findCtor(cls, args.size());
                ctor.setAccessible(true);
                inst = ctor.newInstance(Coerce.args(ctor.getGenericParameterTypes(), args));
                continue;
            }
            Method mm = findMethod(cls, method, args.size());
            mm.setAccessible(true);
            Object r = mm.invoke(inst, Coerce.args(mm.getGenericParameterTypes(), args));
            Object got = Serde.serialize(mm.getReturnType() == void.class ? null : r);
            if (!Cmp.compare("exact", got, want)) {
                emit(ci, name, "fail", got, want, "step " + method);
                return false;
            }
        }
        return true;
    }

    static Method findMethod(Class<?> cls, String name, int argc) {
        for (Method mm : cls.getMethods())
            if (mm.getName().equals(name) && mm.getParameterCount() == argc) return mm;
        for (Method mm : cls.getDeclaredMethods())
            if (mm.getName().equals(name) && mm.getParameterCount() == argc) return mm;
        throw new RuntimeException("method not found: " + name + "/" + argc);
    }

    static Constructor<?> findCtor(Class<?> cls, int argc) {
        for (Constructor<?> c : cls.getDeclaredConstructors())
            if (c.getParameterCount() == argc) return c;
        throw new RuntimeException("constructor not found /" + argc);
    }

    static void emit(int i, String name, String status, Object got, Object want, String message) {
        StringBuilder b = new StringBuilder();
        b.append("LLJUDGE {\"i\": ").append(i)
         .append(", \"name\": ").append(Json.stringify(name))
         .append(", \"status\": ").append(Json.stringify(status));
        if ("fail".equals(status)) {
            b.append(", \"got\": ").append(Json.stringify(got));
            b.append(", \"want\": ").append(Json.stringify(want));
        } else if ("pass".equals(status) && got != null) {
            b.append(", \"got\": ").append(Json.stringify(got));
        }
        if (message != null) b.append(", \"message\": ").append(Json.stringify(message));
        b.append("}");
        System.out.println(b.toString());
    }
}

// ---- data structures the user's Solution references ----
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

// LeetCode's multi-purpose Node: graph problems use val/neighbors, the
// random-pointer list uses val/next/random. One class serves both.
class Node {
    int val;
    Node next, random;
    List<Node> neighbors = new ArrayList<>();
    Node() {}
    Node(int val) { this.val = val; }
    Node(int val, List<Node> neighbors) { this.val = val; this.neighbors = neighbors; }
    Node(int val, Node next, Node random) { this.val = val; this.next = next; this.random = random; }
}

// ---- coercion: neutral JSON value -> the method's declared Java type ----
class Coerce {
    static Object[] args(Type[] types, List<Object> args) {
        return args(types, args, new ArrayList<>());
    }

    static Object[] args(Type[] types, List<Object> args, List<Object> argTypes) {
        Object[] a = new Object[args.size()];
        for (int i = 0; i < a.length; i++)
            a[i] = to(args.get(i), types[i], i < argTypes.size() ? (String) argTypes.get(i) : null);
        return a;
    }

    static Object to(Object v, Type t) { return to(v, t, null); }

    @SuppressWarnings("unchecked")
    static Object to(Object v, Type t, String argType) {
        if (t instanceof Class) {
            Class<?> c = (Class<?>) t;
            if (c == int.class || c == Integer.class) return v == null ? 0 : ((Number) v).intValue();
            if (c == long.class || c == Long.class) return v == null ? 0L : ((Number) v).longValue();
            if (c == double.class || c == Double.class) return v == null ? 0.0 : ((Number) v).doubleValue();
            if (c == float.class || c == Float.class) return v == null ? 0f : ((Number) v).floatValue();
            if (c == boolean.class || c == Boolean.class) return v != null && (Boolean) v;
            if (c == char.class || c == Character.class) return ((String) v).charAt(0);
            if (c == String.class) return v;
            if (c == ListNode.class) {
                if ("ListNodeCycle".equals(argType) || v instanceof Map)
                    return Serde.toCycleList((Map<String, Object>) v);
                return Serde.toList((List<Object>) v);
            }
            if (c == TreeNode.class) return Serde.toTree((List<Object>) v);
            if (c == Node.class) {
                if ("GraphNode".equals(argType)) return Serde.toGraph((List<Object>) v);
                return Serde.toRandomList((List<Object>) v);
            }
            if (c.isArray()) return toArray((List<Object>) v, c.getComponentType());
            if (List.class.isAssignableFrom(c)) return toList(v, Object.class);
            return v;
        }
        if (t instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) t;
            if (List.class.isAssignableFrom((Class<?>) pt.getRawType()))
                return toList(v, pt.getActualTypeArguments()[0]);
        }
        return v;
    }

    @SuppressWarnings("unchecked")
    static List<Object> toList(Object v, Type elem) {
        List<Object> out = new ArrayList<>();
        if (v != null) for (Object e : (List<Object>) v) out.add(to(e, elem));
        return out;
    }

    static Object toArray(List<Object> v, Class<?> comp) {
        int n = v == null ? 0 : v.size();
        Object arr = Array.newInstance(comp, n);
        for (int i = 0; i < n; i++) Array.set(arr, i, to(v.get(i), comp));
        return arr;
    }
}

// ---- serialize a Java value back to neutral JSON values (Long/Double/String/Boolean/List) ----
class Serde {
    static ListNode toList(List<Object> a) {
        ListNode dummy = new ListNode(), cur = dummy;
        if (a != null) for (Object o : a) { cur.next = new ListNode(((Number) o).intValue()); cur = cur.next; }
        return dummy.next;
    }

    static TreeNode toTree(List<Object> a) {
        if (a == null || a.isEmpty() || a.get(0) == null) return null;
        TreeNode root = new TreeNode(((Number) a.get(0)).intValue());
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < a.size()) {
            TreeNode n = q.poll();
            if (i < a.size()) { Object l = a.get(i++); if (l != null) { n.left = new TreeNode(((Number) l).intValue()); q.add(n.left); } }
            if (i < a.size()) { Object r = a.get(i++); if (r != null) { n.right = new TreeNode(((Number) r).intValue()); q.add(n.right); } }
        }
        return root;
    }

    static ListNode toCycleList(Map<String, Object> spec) {
        List<Object> values = (List<Object>) spec.getOrDefault("values", new ArrayList<>());
        int pos = ((Number) spec.getOrDefault("pos", -1L)).intValue();
        List<ListNode> nodes = new ArrayList<>();
        for (Object v : values) nodes.add(new ListNode(((Number) v).intValue()));
        for (int i = 0; i + 1 < nodes.size(); i++) nodes.get(i).next = nodes.get(i + 1);
        if (pos >= 0 && !nodes.isEmpty()) nodes.get(nodes.size() - 1).next = nodes.get(pos);
        return nodes.isEmpty() ? null : nodes.get(0);
    }

    // Random-pointer list: [[val, randomIndex|null], ...]
    @SuppressWarnings("unchecked")
    static Node toRandomList(List<Object> pairs) {
        if (pairs == null || pairs.isEmpty()) return null;
        List<Node> nodes = new ArrayList<>();
        for (Object p : pairs) nodes.add(new Node(((Number) ((List<Object>) p).get(0)).intValue()));
        for (int i = 0; i < nodes.size(); i++) {
            nodes.get(i).next = i + 1 < nodes.size() ? nodes.get(i + 1) : null;
            Object r = ((List<Object>) pairs.get(i)).get(1);
            nodes.get(i).random = r == null ? null : nodes.get(((Number) r).intValue());
        }
        return nodes.get(0);
    }

    static Object randomListToJson(Node head) {
        Map<Node, Integer> index = new IdentityHashMap<>();
        for (Node c = head; c != null && !index.containsKey(c); c = c.next) index.put(c, index.size());
        List<Object> out = new ArrayList<>();
        for (Node c = head; c != null && out.size() < index.size(); c = c.next) {
            List<Object> pair = new ArrayList<>();
            pair.add((long) c.val);
            pair.add(c.random == null ? null : (long) index.getOrDefault(c.random, -1).intValue());
            out.add(pair);
        }
        return out;
    }

    // Graph: LeetCode clone-graph adjacency list; neighbor lists sorted on output.
    static Node toGraph(List<Object> adj) {
        if (adj == null || adj.isEmpty()) return null;
        List<Node> nodes = new ArrayList<>();
        for (int i = 0; i < adj.size(); i++) nodes.add(new Node(i + 1));
        for (int i = 0; i < adj.size(); i++)
            for (Object v : (List<Object>) adj.get(i))
                nodes.get(i).neighbors.add(nodes.get(((Number) v).intValue() - 1));
        return nodes.get(0);
    }

    static Object graphToJson(Node node) {
        List<Object> out = new ArrayList<>();
        if (node == null) return out;
        Set<Node> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        Deque<Node> queue = new ArrayDeque<>();
        seen.add(node); queue.add(node);
        while (!queue.isEmpty()) {
            Node cur = queue.poll();
            for (Node nb : cur.neighbors) if (seen.add(nb)) queue.add(nb);
        }
        for (int i = 0; i < seen.size(); i++) out.add(new ArrayList<>());
        for (Node n : seen) {
            int i = n.val - 1;
            if (i < 0 || i >= out.size()) { // vals not 1..n — can't match any expected
                List<Object> bad = new ArrayList<>(); bad.add(-1L);
                List<Object> wrap = new ArrayList<>(); wrap.add(bad);
                return wrap;
            }
            List<Long> vals = new ArrayList<>();
            for (Node nb : n.neighbors) vals.add((long) nb.val);
            Collections.sort(vals);
            out.set(i, new ArrayList<Object>(vals));
        }
        return out;
    }

    // mustCopy support: all node objects reachable via next/left/right/random/neighbors.
    static Set<Object> collectNodes(Object root) {
        Set<Object> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        Deque<Object> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            Object v = stack.pop();
            if (v == null || !seen.add(v)) continue;
            if (v instanceof ListNode && ((ListNode) v).next != null) stack.push(((ListNode) v).next);
            else if (v instanceof TreeNode) {
                if (((TreeNode) v).left != null) stack.push(((TreeNode) v).left);
                if (((TreeNode) v).right != null) stack.push(((TreeNode) v).right);
            } else if (v instanceof Node) {
                Node n = (Node) v;
                if (n.next != null) stack.push(n.next);
                if (n.random != null) stack.push(n.random);
                if (n.neighbors != null) for (Node nb : n.neighbors) if (nb != null) stack.push(nb);
            } else if (v instanceof List) {
                for (Object e : (List<?>) v) if (e != null) stack.push(e);
            } else if (v.getClass().isArray() && !v.getClass().getComponentType().isPrimitive()) {
                for (int i = 0; i < Array.getLength(v); i++) {
                    Object e = Array.get(v, i);
                    if (e != null) stack.push(e);
                }
            }
        }
        return seen;
    }

    static boolean sharesNodes(Object input, Object output) {
        Set<Object> in = collectNodes(input);
        for (Object n : collectNodes(output))
            if ((n instanceof ListNode || n instanceof TreeNode || n instanceof Node) && in.contains(n))
                return true;
        return false;
    }

    // Return-type-aware entry point: a null ListNode/TreeNode result serializes
    // to [] (an empty structure), matching the TS/Python harnesses. Node results
    // are ambiguous (graph vs random list) so they dispatch on the declared type.
    static Object serialize(Object o, String returnType) {
        if ("ListNodeRandom".equals(returnType)) return randomListToJson((Node) o);
        if ("GraphNode".equals(returnType)) return graphToJson((Node) o);
        if (o == null)
            return ("ListNode".equals(returnType) || "TreeNode".equals(returnType))
                ? new ArrayList<>() : null;
        return serialize(o);
    }

    static Object serialize(Object o) {
        if (o == null) return null;
        if (o instanceof ListNode) {
            List<Object> out = new ArrayList<>();
            Set<ListNode> seen = new HashSet<>();
            ListNode c = (ListNode) o;
            while (c != null && !seen.contains(c)) { seen.add(c); out.add((long) c.val); c = c.next; }
            return out;
        }
        if (o instanceof TreeNode) {
            List<Object> out = new ArrayList<>();
            Queue<TreeNode> q = new LinkedList<>();
            q.add((TreeNode) o);
            while (!q.isEmpty()) {
                TreeNode n = q.poll();
                if (n != null) { out.add((long) n.val); q.add(n.left); q.add(n.right); }
                else out.add(null);
            }
            while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
            return out;
        }
        if (o.getClass().isArray()) {
            int n = Array.getLength(o);
            List<Object> out = new ArrayList<>();
            for (int i = 0; i < n; i++) out.add(serialize(Array.get(o, i)));
            return out;
        }
        if (o instanceof List) {
            List<Object> out = new ArrayList<>();
            for (Object e : (List<?>) o) out.add(serialize(e));
            return out;
        }
        if (o instanceof Integer || o instanceof Short || o instanceof Byte) return ((Number) o).longValue();
        if (o instanceof Long) return o;
        if (o instanceof Double || o instanceof Float) return ((Number) o).doubleValue();
        if (o instanceof Character) return o.toString();
        return o; // Boolean / String
    }
}

// ---- comparators over neutral JSON values ----
class Cmp {
    @SuppressWarnings("unchecked")
    static boolean compare(String kind, Object got, Object want) {
        switch (kind) {
            case "float": return floatEq(got, want);
            case "unordered":
                return Json.stringify(sort(asList(got))).equals(Json.stringify(sort(asList(want))));
            case "unordered-nested":
                return Json.stringify(nested(got)).equals(Json.stringify(nested(want)));
            case "set":
                return Json.stringify(dedupe(asList(got))).equals(Json.stringify(dedupe(asList(want))));
            default: // exact / linkedlist / tree
                return Json.stringify(got).equals(Json.stringify(want));
        }
    }

    @SuppressWarnings("unchecked")
    static List<Object> asList(Object o) {
        return o instanceof List ? (List<Object>) o : new ArrayList<>(Collections.singletonList(o));
    }

    static List<Object> sort(List<Object> l) {
        List<Object> c = new ArrayList<>(l);
        c.sort(Comparator.comparing(Json::stringify));
        return c;
    }

    @SuppressWarnings("unchecked")
    static List<Object> nested(Object o) {
        List<Object> out = new ArrayList<>();
        for (Object e : asList(o)) out.add(e instanceof List ? sort((List<Object>) e) : e);
        return sort(out);
    }

    static List<Object> dedupe(List<Object> l) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (Object e : l) m.put(Json.stringify(e), e);
        return sort(new ArrayList<>(m.values()));
    }

    static boolean floatEq(Object a, Object b) {
        if (a instanceof Number && b instanceof Number)
            return Math.abs(((Number) a).doubleValue() - ((Number) b).doubleValue()) <= 1e-6;
        if (a instanceof List && b instanceof List) {
            List<?> x = (List<?>) a, y = (List<?>) b;
            if (x.size() != y.size()) return false;
            for (int i = 0; i < x.size(); i++) if (!floatEq(x.get(i), y.get(i))) return false;
            return true;
        }
        return Json.stringify(a).equals(Json.stringify(b));
    }
}

// ---- minimal JSON parser + stable stringify ----
class Json {
    private final String s;
    private int i;
    private Json(String s) { this.s = s; }

    static Object parse(String s) {
        Json j = new Json(s);
        j.ws();
        return j.value();
    }

    private void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }

    private Object value() {
        ws();
        char c = s.charAt(i);
        switch (c) {
            case '{': return obj();
            case '[': return arr();
            case '"': return str();
            case 't': i += 4; return Boolean.TRUE;
            case 'f': i += 5; return Boolean.FALSE;
            case 'n': i += 4; return null;
            default: return num();
        }
    }

    private Map<String, Object> obj() {
        Map<String, Object> m = new LinkedHashMap<>();
        i++; ws();
        if (s.charAt(i) == '}') { i++; return m; }
        while (true) {
            ws();
            String k = str();
            ws();
            i++; // ':'
            m.put(k, value());
            ws();
            if (s.charAt(i++) == '}') break;
        }
        return m;
    }

    private List<Object> arr() {
        List<Object> a = new ArrayList<>();
        i++; ws();
        if (s.charAt(i) == ']') { i++; return a; }
        while (true) {
            a.add(value());
            ws();
            if (s.charAt(i++) == ']') break;
        }
        return a;
    }

    private String str() {
        StringBuilder b = new StringBuilder();
        i++; // opening quote
        while (true) {
            char c = s.charAt(i++);
            if (c == '"') break;
            if (c == '\\') {
                char e = s.charAt(i++);
                switch (e) {
                    case 'n': b.append('\n'); break;
                    case 't': b.append('\t'); break;
                    case 'r': b.append('\r'); break;
                    case 'b': b.append('\b'); break;
                    case 'f': b.append('\f'); break;
                    case 'u': b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; break;
                    default: b.append(e);
                }
            } else b.append(c);
        }
        return b.toString();
    }

    private Object num() {
        int start = i;
        while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
        String n = s.substring(start, i);
        if (n.indexOf('.') >= 0 || n.indexOf('e') >= 0 || n.indexOf('E') >= 0) return Double.parseDouble(n);
        return Long.parseLong(n);
    }

    static String stringify(Object o) {
        StringBuilder b = new StringBuilder();
        write(o, b);
        return b.toString();
    }

    private static void write(Object o, StringBuilder b) {
        if (o == null) { b.append("null"); return; }
        if (o instanceof String) { b.append('"'); esc((String) o, b); b.append('"'); return; }
        if (o instanceof Boolean || o instanceof Long || o instanceof Integer) { b.append(o.toString()); return; }
        if (o instanceof Double) {
            double d = (Double) o;
            if (d == Math.floor(d) && !Double.isInfinite(d)) b.append(Long.toString((long) d));
            else b.append(Double.toString(d));
            return;
        }
        if (o instanceof List) {
            b.append('[');
            List<?> l = (List<?>) o;
            for (int k = 0; k < l.size(); k++) { if (k > 0) b.append(','); write(l.get(k), b); }
            b.append(']');
            return;
        }
        if (o instanceof Map) {
            b.append('{');
            Map<?, ?> m = (Map<?, ?>) o;
            List<String> keys = new ArrayList<>();
            for (Object k : m.keySet()) keys.add(k.toString());
            Collections.sort(keys);
            for (int k = 0; k < keys.size(); k++) {
                if (k > 0) b.append(',');
                b.append('"'); esc(keys.get(k), b); b.append("\":");
                write(m.get(keys.get(k)), b);
            }
            b.append('}');
            return;
        }
        b.append('"'); esc(o.toString(), b); b.append('"');
    }

    private static void esc(String s, StringBuilder b) {
        for (int k = 0; k < s.length(); k++) {
            char c = s.charAt(k);
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\t': b.append("\\t"); break;
                case '\r': b.append("\\r"); break;
                default: b.append(c);
            }
        }
    }
}
