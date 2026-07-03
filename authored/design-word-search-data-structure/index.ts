/**
 * Design Add and Search Words Data Structure - Medium
 *
 * https://leetcode.com/problems/design-add-and-search-words-data-structure/
 */

type WdNode = { children: Map<string, WdNode>; end: boolean };

export class WordDictionary {
  private root: WdNode = { children: new Map(), end: false };

  addWord(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, { children: new Map(), end: false });
      node = node.children.get(c)!;
    }
    node.end = true;
  }

  search(word: string): boolean {
    const dfs = (node: WdNode, i: number): boolean => {
      if (i === word.length) return node.end;
      const c = word[i];
      if (c === ".") {
        for (const child of node.children.values()) if (dfs(child, i + 1)) return true;
        return false;
      }
      const next = node.children.get(c);
      return next ? dfs(next, i + 1) : false;
    };
    return dfs(this.root, 0);
  }
}
