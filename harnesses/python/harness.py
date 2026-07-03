"""Python judging harness. Run: python3 harness.py <case.json>
Emits the LLJUDGE protocol (docs/multi-language-judging.md §4)."""
import importlib.util
import json
import os
import sys

# Recursive solutions on deep lists/trees are legitimate (LeetCode raises this too).
sys.setrecursionlimit(100_000)

_HERE = os.path.dirname(os.path.abspath(__file__))
from serde import (deserialize_arg, serialize_result, shares_nodes,  # noqa: E402
                   ListNode, TreeNode, Node)
from comparators import compare  # noqa: E402


def _load_solution():
    path = os.path.join(_HERE, "solution.py")
    spec = importlib.util.spec_from_file_location("solution", path)
    mod = importlib.util.module_from_spec(spec)
    # Make ListNode/TreeNode available to the user's code (LeetCode convention:
    # these are pre-defined) so a solution can construct nodes without importing.
    mod.ListNode = ListNode
    mod.TreeNode = TreeNode
    mod.Node = Node
    spec.loader.exec_module(mod)
    return mod


def emit(obj):
    sys.stdout.write("LLJUDGE " + json.dumps(obj) + "\n")


def resolve_fn(mod, name):
    fn = getattr(mod, name, None)
    if callable(fn):
        return fn
    Sol = getattr(mod, "Solution", None)
    if Sol is not None:
        inst = Sol()
        m = getattr(inst, name, None)
        if callable(m):
            return m
    raise RuntimeError(f'entry "{name}" not found (expected a function or a Solution method)')


def main():
    with open(sys.argv[1]) as f:
        manifest = json.load(f)
    mod = _load_solution()
    names = manifest.get("names", {})
    passed = 0
    cases = manifest["cases"]

    for i, c in enumerate(cases):
        try:
            if manifest["kind"] == "sequence":
                cls_name = names.get("python", manifest["class"])
                Cls = getattr(mod, cls_name, None)
                if Cls is None:
                    raise RuntimeError(f'class "{cls_name}" not found')
                inst = None
                failed = False
                for step in c["steps"]:
                    if step["method"] == "constructor":
                        inst = Cls(*step["args"])
                        continue
                    ret = getattr(inst, step["method"])(*step["args"])
                    got = None if ret is None else ret
                    if not compare("exact", got, step["expected"]):
                        emit({"i": i, "name": c["name"], "status": "fail",
                              "got": got, "want": step["expected"],
                              "message": f'step {step["method"]}({step["args"]})'})
                        failed = True
                        break
                if not failed:
                    passed += 1
                    emit({"i": i, "name": c["name"], "status": "pass"})
            elif manifest["kind"] == "roundtrip":
                cls_name = names.get("python", manifest["class"])
                Cls = getattr(mod, cls_name, None)
                if Cls is None:
                    raise RuntimeError(f'class "{cls_name}" not found')
                inst = Cls()
                data_type = manifest["dataType"]
                enc = getattr(inst, manifest["encode"])(deserialize_arg(c["data"], data_type))
                got = serialize_result(getattr(inst, manifest["decode"])(enc), data_type)
                if compare("exact", got, c["data"]):
                    passed += 1
                    emit({"i": i, "name": c["name"], "status": "pass"})
                else:
                    emit({"i": i, "name": c["name"], "status": "fail",
                          "got": got, "want": c["data"],
                          "message": f'{manifest["decode"]}({manifest["encode"]}(data)) != data'})
            else:
                fn_name = names.get("python", manifest["entry"])
                fn = resolve_fn(mod, fn_name)
                arg_types = manifest.get("argTypes", [])
                args = [deserialize_arg(v, arg_types[k] if k < len(arg_types) else "any")
                        for k, v in enumerate(c["args"])]
                raw = fn(*args)
                must_copy = manifest.get("mustCopy")
                if must_copy is not None and shares_nodes(args[must_copy], raw):
                    emit({"i": i, "name": c["name"], "status": "fail",
                          "got": "(result shares nodes with the input)",
                          "want": c["expected"], "message": "must return a deep copy"})
                    continue
                result_from = manifest.get("resultFrom")
                src = args[result_from] if result_from is not None else raw
                got = serialize_result(src, manifest.get("returnType", "any"))
                if compare(manifest["comparator"], got, c["expected"]):
                    passed += 1
                    emit({"i": i, "name": c["name"], "status": "pass", "got": got})
                else:
                    emit({"i": i, "name": c["name"], "status": "fail",
                          "got": got, "want": c["expected"]})
        except Exception as e:  # noqa: BLE001
            emit({"i": i, "name": c.get("name", f"case {i}"), "status": "error",
                  "message": str(e)})

    sys.stdout.write("LLJUDGE-SUMMARY " + json.dumps({"passed": passed, "total": len(cases)}) + "\n")


if __name__ == "__main__":
    main()
