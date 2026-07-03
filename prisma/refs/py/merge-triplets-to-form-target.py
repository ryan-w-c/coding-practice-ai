def merge_triplets(triplets, target):
    achieved = [False] * 3
    for t in triplets:
        if all(t[i] <= target[i] for i in range(3)):
            for i in range(3):
                if t[i] == target[i]:
                    achieved[i] = True
    return all(achieved)
