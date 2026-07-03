from functools import reduce


def single_number(nums):
    return reduce(lambda a, b: a ^ b, nums, 0)
