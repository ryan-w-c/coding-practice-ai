// Derives editor "starter code" from a reference solution file by blanking the
// bodies the solver must fill in, while preserving scaffolding the solver needs:
//   - data-structure helper classes (ListNode / TreeNode / Node / *Node) are KEPT
//   - imports, type aliases, interfaces, and the header doc comment are KEPT
//   - top-level functions, exported arrow/function consts, and methods of the
//     solution class(es) get their bodies replaced with a TODO + throw.
//
// Pure (string in, string out) so it can be unit-tested. Uses the TypeScript
// compiler API for a reliable parse rather than brace-matching.

import ts from "typescript";

const STUB = `{
    // TODO: implement
    throw new Error("Not implemented");
  }`;

function isHelperDataStructure(name: string | undefined): boolean {
  if (!name) return false;
  // ListNode, TreeNode, Node, GraphNode, DoublyLinkedNode, ... anything ending in "Node".
  return name === "Node" || name.endsWith("Node");
}

type Range = { start: number; end: number };

export function deriveStarterCode(source: string, fileName = "index.ts"): string {
  const sf = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ true,
    ts.ScriptKind.TS,
  );

  const ranges: Range[] = [];

  const recordBody = (body: ts.Node | undefined) => {
    if (!body) return;
    // For block bodies we replace the whole `{ ... }` span.
    if (ts.isBlock(body)) {
      ranges.push({ start: body.getStart(sf), end: body.getEnd() });
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isClassDeclaration(node)) {
      const name = node.name?.text;
      if (isHelperDataStructure(name)) {
        return; // keep helper data structures fully intact
      }
      for (const member of node.members) {
        if (ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member)) {
          recordBody(member.body);
        }
        if (
          (ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) &&
          member.body
        ) {
          recordBody(member.body);
        }
      }
      return;
    }

    if (ts.isFunctionDeclaration(node)) {
      recordBody(node.body);
      return;
    }

    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        const init = decl.initializer;
        if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
          recordBody(init.body as ts.Node);
        }
      }
      return;
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sf, visit);

  if (ranges.length === 0) {
    // Nothing recognizable to blank — return source unchanged rather than leak
    // an unhelpful template. (Rare; logged by the seed so it can be reviewed.)
    return source;
  }

  // Replace from the end so earlier offsets stay valid.
  ranges.sort((a, b) => b.start - a.start);
  let out = source;
  for (const r of ranges) {
    out = out.slice(0, r.start) + STUB + out.slice(r.end);
  }
  return out;
}

export type ParsedHeader = {
  title: string | null;
  difficulty: "E" | "M" | "H" | null;
  url: string | null;
};

// Header comment looks like:
//   /**
//    * Two Integer Sum - Easy
//    *
//    * https://neetcode.io/problems/two-integer-sum
//    ...
export function parseHeader(source: string): ParsedHeader {
  const head = source.slice(0, 1200);

  let title: string | null = null;
  let difficulty: ParsedHeader["difficulty"] = null;

  const titleMatch = head.match(/^\s*\*\s*(.+?)\s*-\s*(Easy|Medium|Hard)\s*$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
    difficulty =
      titleMatch[2] === "Easy" ? "E" : titleMatch[2] === "Medium" ? "M" : "H";
  }

  const urlMatch = head.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0].replace(/[).,]+$/, "") : null;

  return { title, difficulty, url };
}

// Pull the prose statement out of the leading /** ... */ header comment,
// dropping the "Title - Difficulty" line and the bare URL (shown separately).
export function extractStatement(source: string): string {
  const m = source.match(/\/\*\*([\s\S]*?)\*\//);
  if (!m) return "";
  const cleaned: string[] = [];
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.replace(/^\s*\*\s?/, "").replace(/\s+$/, "");
    if (/^.+\s-\s(Easy|Medium|Hard)\s*$/.test(line)) continue; // title line
    if (/^https?:\/\/\S+$/.test(line.trim())) continue; // bare URL line
    cleaned.push(line);
  }
  return cleaned.join("\n").replace(/^\n+/, "").replace(/\n+$/, "");
}

// Remove the leading header block comment (the statement) from a starter so it
// isn't duplicated in the editor — the Problem panel shows the statement instead.
export function stripHeaderComment(source: string): string {
  return source.replace(/^﻿?\s*\/\*\*[\s\S]*?\*\/\s*/, "");
}
