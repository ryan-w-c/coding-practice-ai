"""Comparators (see docs/multi-language-judging.md §2)."""
import json


def _norm(x):
    # Integral floats canonicalize as ints: JSON.stringify(2.0) is "2" in the
    # TS harness and the Java harness writes integral doubles as longs, so a
    # Python solution returning 2.0 must equal an expected value of 2.
    if isinstance(x, float) and x.is_integer():
        return int(x)
    if isinstance(x, list):
        return [_norm(v) for v in x]
    if isinstance(x, dict):
        return {k: _norm(v) for k, v in x.items()}
    return x


def _canon(x):
    return json.dumps(_norm(x), sort_keys=True)


def _deep_equal(a, b):
    return _canon(a) == _canon(b)


def _sorted_by_canon(arr):
    return sorted(arr, key=_canon)


def _float_equal(a, b, tol=1e-6):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) <= tol
    if isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        return all(_float_equal(x, y, tol) for x, y in zip(a, b))
    return _deep_equal(a, b)


def compare(kind, got, want):
    if kind in ("exact", "linkedlist", "tree"):
        return _deep_equal(got, want)
    if kind == "float":
        return _float_equal(got, want)
    if kind == "unordered":
        if not isinstance(got, list) or not isinstance(want, list):
            return _deep_equal(got, want)
        return _deep_equal(_sorted_by_canon(got), _sorted_by_canon(want))
    if kind == "unordered-nested":
        if not isinstance(got, list) or not isinstance(want, list):
            return _deep_equal(got, want)
        g = _sorted_by_canon([_sorted_by_canon(x) for x in got])
        w = _sorted_by_canon([_sorted_by_canon(x) for x in want])
        return _deep_equal(g, w)
    if kind == "set":
        if not isinstance(got, list) or not isinstance(want, list):
            return _deep_equal(got, want)
        def uniq(a):
            seen, out = set(), []
            for item in a:
                c = _canon(item)
                if c not in seen:
                    seen.add(c); out.append(item)
            return _sorted_by_canon(out)
        return _deep_equal(uniq(got), uniq(want))
    if kind.startswith("validator:"):
        raise NotImplementedError(f"validator comparators not implemented: {kind}")
    return _deep_equal(got, want)
