# Multi-language judging — design spec

> Status: **implemented** (TypeScript, Python, Java). All 99 vendored problems
> plus 18 authored problems (tries / math-geometry / bit-manipulation, under
> `authored/<slug>/index.ts`, seeded by `prisma/seed-authored.ts`) have a case
> file under `judging/problems/` and are judged in all three languages via the
> harnesses under `harnesses/`. Reference solutions used to gate every case
> file live in `prisma/refs/` (TS; authored problems use their `index.ts`),
> `prisma/refs/py/`, and `prisma/refs/java/`; run one with
> `bun prisma/run-harness.ts <lang> <case.json> <solution>`.

## 0. The core idea

A problem's test cases are **language-agnostic**: `twoSum([3,4,5,6], 7) → [0,1]` is
true whether you solve it in Python, Go, or Rust. What's TS-specific in this repo
is only that the vendored cases are *embedded inside TypeScript assertion code*
(`vendor/neetcode-150/<problem>/index.test.ts`).

So instead of hand-writing a test suite per language (99 files × N languages), we:

1. **Extract** each problem's cases once into a neutral JSON file.
2. **Author a manifest** once per problem: entry point, argument/return types, comparator.
3. **Write one generic harness per language** that reads the JSON, calls the
   solution, and emits a standard result protocol.

Adding a language then ≈ writing **one harness + a few (de)serializers**, reusing
all the data and manifests. This is the harness+comparator layer DESIGN.md §5
deliberately skipped to ship TS-only fast — build it only when multi-language is the goal.

### Effort reality (measured against the 99 vendored suites)

| Bucket | Count | What it needs |
|---|---:|---|
| Plain value-in → value-out (ints/strings/arrays) | ~75 | Trivial extract; `exact` comparator |
| Structured I/O (`ListNode`/`TreeNode`/graphs/grids) | ~24 | Per-language (de)serializers; structural comparator |
| Order-insensitive / multiple-valid output | ~11 | Per-problem comparator (sort/set/validator) |
| Design / sequence (LRU, MinStack, TimeMap) | a handful | `sequence` case shape (operations + per-call expected) |

(Buckets overlap.) The one-time cost is concentrated in the ~35 non-plain problems.
The 75 plain ones are as trivial as they look.

---

## 1. Neutral case format

One file per problem: `judging/problems/<id>.json`. It carries the manifest **and**
the cases so everything for a problem lives together.

### 1a. Function problems (the common case)

```jsonc
{
  "id": "two-integer-sum",
  "kind": "function",
  "entry": "twoSum",                 // canonical name; per-language overrides below
  "names": { "python": "two_sum" }, // optional; default = camelCase `entry`
  "argTypes": ["int[]", "int"],     // positional, matches the function signature
  "returnType": "int[]",
  "comparator": "exact",
  "cases": [
    { "name": "basic",     "args": [[3, 4, 5, 6], 7], "expected": [0, 1] },
    { "name": "negatives", "args": [[-3, 4, 3, 90], 0], "expected": [0, 2] }
  ]
}
```

`args` is a JSON array of the positional arguments. Values are plain JSON; the
harness reconstructs typed inputs from `argTypes` (see §3).

### 1b. Structured I/O — the JSON is a *serialization*, not the argument

```jsonc
{
  "id": "reverse-linked-list",
  "kind": "function",
  "entry": "reverseList",
  "argTypes": ["ListNode"],          // [0,1,2,3] is a serialized list, not an array
  "returnType": "ListNode",
  "comparator": "linkedlist",
  "cases": [{ "name": "basic", "args": [[0, 1, 2, 3]], "expected": [3, 2, 1, 0] }]
}
```

The harness deserializes `[0,1,2,3]` into the language's `ListNode` before calling,
and serializes the returned node back to an array before comparing. Trees use
level-order-with-nulls (`[3, null, 9, 20]`); grids use `int[][]` / `char[][]`.

### 1c. Order-insensitive output

```jsonc
{
  "id": "anagram-groups",
  "kind": "function",
  "entry": "groupAnagrams",
  "argTypes": ["string[]"],
  "returnType": "string[][]",
  "comparator": "unordered-nested",  // inner groups and outer list both order-free
  "cases": [
    { "name": "basic", "args": [["act","pots","tops","cat","stop","hat"]],
      "expected": [["act","cat"],["pots","tops","stop"],["hat"]] }
  ]
}
```

For problems that accept *any* valid answer (e.g. "return any one pair"), use a
`validator` comparator (§2) instead of a fixed `expected`.

### 1d. Sequence / design problems

These are not one input→output; they're a sequence of method calls with an
expected result per call.

```jsonc
{
  "id": "lru-cache",
  "kind": "sequence",
  "class": "LRUCache",
  "names": { "python": "LRUCache" },
  "comparator": "exact",
  "cases": [
    { "name": "evicts LRU",
      "steps": [
        { "method": "constructor", "args": [2],     "expected": null },
        { "method": "put",         "args": [1, 10], "expected": null },
        { "method": "get",         "args": [1],     "expected": 10 },
        { "method": "put",         "args": [2, 20], "expected": null },
        { "method": "put",         "args": [3, 30], "expected": null },
        { "method": "get",         "args": [2],     "expected": -1 }
      ] }
  ]
}
```

### 1e. Round-trip (codec) problems

`serialize-and-deserialize-binary-tree` and `string-encode-decode` have
implementation-defined intermediate encodings, so asserting an exact encoded
string (as the vendored tests do) is too strict. `kind: "roundtrip"` judges
`decode(encode(data)) == data` on a fresh instance of `class`:

```jsonc
{
  "id": "string-encode-decode",
  "kind": "roundtrip",
  "class": "Codec",
  "encode": "encode",      // method names
  "decode": "decode",
  "dataType": "string[]",  // or "TreeNode" — (de)serialized via §3
  "comparator": "exact",
  "cases": [{ "name": "basic", "data": ["neet", "code"] }]
}
```

### 1f. Void / in-place and deep-copy problems

Two optional manifest keys on `kind: "function"` problems:

- `"resultFrom": <argIndex>` — the solution returns nothing; the harness
  serializes that (mutated) argument after the call instead of the return value
  (`reorder-linked-list`, `islands-and-treasure`, `surrounded-regions`).
- `"mustCopy": <argIndex>` — the case fails if the returned structure shares any
  node (identity) with that input argument (`clone-graph`,
  `copy-linked-list-with-random-pointer`), so returning the input can't pass.

### 1f-bis. Where case files live

`judging/problems/` is a **gitignored build artifact** (~88MB with all generated
cases). The committed sources are:

- `judging/curated/<id>.json` — canonical manifests + hand-authored cases (edit
  these, not the built files)
- `judging/generators/<id>.ts` — random + stress case generators

`bun prisma/build-cases.ts` builds whatever is missing (it runs automatically
via the `predev`/`prestart` npm hooks, so a fresh checkout self-heals on first
`npm run dev`; a full rebuild takes ~8s). `npm run build:cases` forces a full
rebuild. Generation is seeded per slug, so rebuilds are deterministic.

### 1g. Generated + stress cases

Hand-picked cases can't catch wrong-complexity solutions, so problems can carry
machine-generated cases (LeetCode-style "hidden tests"):

- `judging/generators/<id>.ts` — seeded random-input generator exporting
  `cases(rng)` (small/medium inputs), optional `stress(rng)` (large inputs sized
  so one-complexity-class-worse solutions TLE within the 10s budget in every
  language, while the optimal Python solution stays well under it), and `brute`
  (an independent second-oracle algorithm).
- `bun prisma/generate-cases.ts <slug>...` — computes `expected` with the
  `prisma/refs/<slug>.ts` reference, cross-checks every non-stress case against
  `brute` under the manifest's comparator, and appends `gen:`/`stress:` cases to
  the case file (idempotent: re-running replaces them; RNG is seeded per slug).
  Case files with big stress arrays are written one-case-per-line, not
  pretty-printed.
- Problems where the answer must be unique (two-integer-sum-ii's "exactly one
  solution") construct inputs that provably satisfy that (e.g. target = sum of
  the two largest distinct values).
- Bun's JIT is fast: an O(n²) loop over n=100k finishes in ~3s, so array stress
  cases use n≈300k (~4.5e10 ops). Every stress case was negative-tested: the
  canonical naive solution must actually get verdict `tle`.
- Caveat: binary-search-family problems can't TLE a linear scan at sane input
  sizes; their stress cases only add correctness coverage at scale.

---

## 2. Comparator vocabulary

`comparator` is one of:

| Name | Meaning |
|---|---|
| `exact` | Deep structural equality of JSON values. |
| `float` | Numeric equality within a tolerance (`1e-6`); also for arrays of floats. |
| `unordered` | Compare as multisets (sort then deep-equal). |
| `unordered-nested` | Order-free at both the outer and inner level (subsets, three-sum, group-anagrams). |
| `set` | Compare as sets (dedupe + order-free). |
| `linkedlist` | Serialize result `ListNode` → array, then `exact`. |
| `tree` | Serialize result `TreeNode` → level-order-with-nulls, then `exact`. |
| `validator:<name>` | No fixed `expected`; call a per-problem validator `<name>(args, output) → bool`. For multiple-valid-answer problems. |

Comparators live **once** in a language-agnostic sense but are *implemented per
language* inside each harness's shared comparator module. The manifest only names
the kind; each harness knows how to run it.

`validator` functions are the one piece of genuine per-problem logic that must be
ported per language (rare — only the handful of "any valid answer" problems).

---

## 3. Type vocabulary (`argTypes` / `returnType`)

Primitives and containers map directly to each language's natural type:

```
int, long, float, bool, string, char
int[], string[], int[][], char[][] (grid), ...
ListNode, TreeNode, Graph (adjacency form), GraphNode (clone-graph)
ListNode[]      — array of serialized lists: [[1,2],[3]] (merge-k-lists)
ListNodeCycle   — {"values":[1,2,3],"pos":1}; tail.next -> values[pos], -1 = none
ListNodeRandom  — [[val, randomIndex|null], ...] (copy-random-list format)
```

`GraphNode` uses the LeetCode clone-graph adjacency form (`adj[i]` = the vals of
node `i+1`'s neighbors, vals are 1..n); harnesses sort neighbor lists when
serializing a returned graph so neighbor order can't fail a case. In Python and
Java the graph/random-list node class is the LeetCode-style `Node` (injected /
compiled alongside); in TypeScript plain structural objects work.

Structured types (`ListNode`, `TreeNode`, `Graph`, `GraphNode`) require a small
(de)serialization module per language:

- `ListNode`: array `[a,b,c]` ↔ singly-linked chain.
- `TreeNode`: level-order array with `null` holes ↔ binary tree.
- `GraphNode`: adjacency list (LeetCode clone-graph format) ↔ node graph.

This is the bulk of per-language work for the ~24 structured problems. Write it
once per language; it's reused across every structured problem.

---

## 4. Harness contract (per language)

Each language ships one harness program under `harnesses/<language>/`:

```
harnesses/
  typescript/  harness.ts   serde.ts   comparators.ts
  python/      harness.py   serde.py   comparators.py
  go/          harness.go   ...
```

At judge time the executor writes into a temp dir: the **user's solution**, the
**problem JSON** (`case.json`), and copies the language harness in. The harness:

1. Reads `case.json` (path via argv) and imports the user's solution module.
2. Resolves the entry point: `names[language]` or the language's natural casing of
   `entry`/`class`.
3. For each case: deserialize `args` per `argTypes`, invoke the entry (or replay
   `steps` for `kind: "sequence"`), serialize the result per `returnType`.
4. Compare against `expected` using `comparator`.
5. Emit the **standard protocol** (below). Exit `0` iff every case passed.

### Output protocol (one parser for all languages)

The harness prints one line per case plus a summary, each prefixed `LLJUDGE`:

```
LLJUDGE {"i":0,"name":"basic","status":"pass"}
LLJUDGE {"i":1,"name":"negatives","status":"fail","got":[],"want":[0,2]}
LLJUDGE-SUMMARY {"passed":1,"total":2}
```

A single parser `lib/harnessparse.ts` (sibling of `lib/bunparse.ts`) reads these
lines → `{ passed, total, failing[] }`. This is the key win over parsing
`bun test` / `pytest` / `go test` output differently per language.

Crashes / compile errors → no `LLJUDGE-SUMMARY` line → verdict `error` (mirror the
`bunparse` "parsedOk" logic). Wall-clock timeout in the executor → `tle`.

---

## 5. How it plugs into the existing code

- **`lib/executor.ts`** — add `judgeHarness({ problemDir, language, solutionCode, caseJson })`:
  temp dir → write solution (`solution.<ext>`) + `case.json` + copy `harnesses/<language>/*`
  → `spawnCapture(runtimeFor(language))` → `parseHarness(stdout+stderr)`. Reuse the
  existing timeout/cleanup machinery. `runtimeFor` already exists.
- **`lib/harnessparse.ts`** — new pure parser for the `LLJUDGE` protocol; unit-test
  it like `lib/bunparse.test.ts`.
- **`app/api/judge/route.ts`** — accept `language`; load `judging/problems/<id>.json`;
  for `typescript` either keep the current `bun test` path or route through the
  harness (see §6); for others use `judgeHarness`. Also accepts
  `mode: "run" | "submit"` (run skips hidden `gen:`/`stress:` cases; nothing is
  logged) and `custom: unknown[][]` (user-supplied argument arrays; the expected
  answer is computed by the reference solution). Every returned test carries
  truncated `input`/`expected`/`got` previews plus a `hidden` flag, and function
  harnesses emit `got` on pass as well as fail to support this.
- **`prisma/schema.prisma`** — replace the single `Problem.judged: Boolean` with
  per-language support, e.g. `judgedLanguages Json` (`["typescript","python"]`) or a
  `ProblemLanguage` join table. The UI gates Submit on the selected language being
  in that set (today's gate in `components/EditorPanel.tsx` is `isTs && problem.judged`).
- **Starter code** — generate per-language starters from the manifest
  (`entry` + `argTypes` + `returnType` → a signature stub). This replaces the
  TS-AST `lib/starter.ts` for non-TS languages; TS can keep AST-derived starters.

---

## 6. Build order (for whoever implements this)

1. **Protocol + parser first.** Define `LLJUDGE`, write `lib/harnessparse.ts` + tests.
2. **TypeScript harness as the reference.** Build `harnesses/typescript/` and a TS
   serde/comparator set. Author `judging/problems/<id>.json` for a handful of
   problems by hand (one plain, one linked-list, one unordered, one sequence).
3. **Regression-gate against the existing TS suite.** Run both the current
   `bun test` path and the new harness path on those problems; verdicts must match.
   This proves the case data + comparators are faithful before scaling.
4. **Extractor.** Write a one-time script that parses each `vendor/.../index.test.ts`
   and emits a draft `judging/problems/<id>.json`. The ~75 plain problems extract
   cleanly; **flag** structured/sequence/comparator problems for human review —
   do not trust auto-extracted `expected` for those.
5. **Add a language (e.g. Python).** Port the harness + serde + comparators. No new
   case data needed — it reuses `judging/problems/*.json`.
6. **Per-language reference verification.** Mirror `prisma/verify.ts`: generate a
   known-correct reference solution per problem in the new language, run it through
   the harness, and only mark `judgedLanguages += language` when **all** cases pass.
   (Recall 16/99 *TS* references were already buggy — expect a similar cleanup pass,
   and the auto-translated cases add their own risk. Verification is non-optional.)
7. **UI.** Flip the Submit gate to allow any language in `judgedLanguages`; generate
   per-language starter code.

---

## 7. Open decisions

- **Migrate TS onto the harness, or keep dual paths?** Uniform (one parser, one
  flow) vs. zero-regression-risk (leave the working `bun test` path alone). Lean:
  migrate after step 3 proves parity, so there's a single code path long-term.
- **Where do cases live?** Files under `judging/` (version-controlled, diffable,
  recommended) vs. a DB table. Files are easier to review and regenerate.
- **`validator` comparators** are the only per-problem logic ported per language.
  Keep them tiny and few; prefer a fixed `expected` + an order-free comparator
  wherever the problem actually has a unique answer up to ordering.
- **Coverage honesty.** As with the TS gaps (see the `vendor-coverage-gaps` memory
  and DESIGN.md §15), `log`/surface which problems are judged in which languages so
  the UI never shows a green check it can't back up.
```
