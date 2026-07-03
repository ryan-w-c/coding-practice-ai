export function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const a = "a".charCodeAt(0);
  const need = new Array<number>(26).fill(0);
  const have = new Array<number>(26).fill(0);
  for (const c of s1) need[c.charCodeAt(0) - a]++;
  let matches = 0;
  const n1 = s1.length;
  for (let i = 0; i < s2.length; i++) {
    const inC = s2.charCodeAt(i) - a;
    have[inC]++;
    if (have[inC] === need[inC]) matches++;
    else if (have[inC] === need[inC] + 1) matches--;
    if (i >= n1) {
      const outC = s2.charCodeAt(i - n1) - a;
      have[outC]--;
      if (have[outC] === need[outC]) matches++;
      else if (have[outC] === need[outC] - 1) matches--;
    }
    if (i >= n1 - 1) {
      let ok = true;
      for (let k = 0; k < 26; k++) if (have[k] !== need[k]) { ok = false; break; }
      if (ok) return true;
    }
  }
  return false;
}
