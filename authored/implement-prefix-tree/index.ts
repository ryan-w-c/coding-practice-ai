/**
 * Implement Trie (Prefix Tree) - Medium
 *
 * https://leetcode.com/problems/implement-trie-prefix-tree/
 */

type TrieNode = { children: Map<string, TrieNode>; end: boolean };

export class Trie {
  private root: TrieNode = { children: new Map(), end: false };

  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, { children: new Map(), end: false });
      node = node.children.get(c)!;
    }
    node.end = true;
  }

  private walk(s: string): TrieNode | null {
    let node = this.root;
    for (const c of s) {
      const next = node.children.get(c);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  search(word: string): boolean {
    return this.walk(word)?.end ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }
}
