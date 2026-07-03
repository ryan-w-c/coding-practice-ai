import string


def ladder_length(begin_word, end_word, word_list):
    words = set(word_list)
    if end_word not in words:
        return 0
    frontier, steps = {begin_word}, 1
    while frontier:
        nxt = set()
        for w in frontier:
            if w == end_word:
                return steps
            for i in range(len(w)):
                for c in string.ascii_lowercase:
                    cand = w[:i] + c + w[i + 1:]
                    if cand in words:
                        words.discard(cand)
                        nxt.add(cand)
        frontier = nxt
        steps += 1
    return 0
