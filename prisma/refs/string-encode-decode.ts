export class Codec {
  encode(strs: string[]): string {
    return strs.map((s) => `${s.length}#${s}`).join("");
  }

  decode(s: string): string[] {
    const out: string[] = [];
    let i = 0;
    while (i < s.length) {
      const hash = s.indexOf("#", i);
      const len = Number(s.slice(i, hash));
      out.push(s.slice(hash + 1, hash + 1 + len));
      i = hash + 1 + len;
    }
    return out;
  }
}
