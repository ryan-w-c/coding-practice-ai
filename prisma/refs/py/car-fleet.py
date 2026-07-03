def car_fleet(target, position, speed):
    cars = sorted(zip(position, speed), reverse=True)
    fleets = 0
    lead_time = -1.0
    for p, s in cars:
        t = (target - p) / s
        if t > lead_time:
            fleets += 1
            lead_time = t
    return fleets
