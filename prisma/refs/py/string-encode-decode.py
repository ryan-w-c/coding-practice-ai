class Codec:
    def encode(self, strs):
        return "".join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s):
        out, i = [], 0
        while i < len(s):
            j = s.index("#", i)
            length = int(s[i:j])
            out.append(s[j + 1:j + 1 + length])
            i = j + 1 + length
        return out
