REGIONAL_YIELD_AVERAGES = {
    "rice": 6.0,
    "chili": 8.0,
    "corn": 5.5,
    "soybean": 2.0,
}


def validate_avs(commodity, declared_yield_tons, land_area_ha):
    avg = REGIONAL_YIELD_AVERAGES.get(commodity.lower())
    if avg is None:
        return {"passed": True, "message": f"No regional benchmark for '{commodity}', skipping AVS."}

    land = float(land_area_ha)
    if land <= 0:
        return {"passed": False, "flag": "Red Risk Flag", "reason": "Land area must be > 0."}

    expected_max = avg * land * 1.5
    declared = float(declared_yield_tons)

    if declared > expected_max:
        return {
            "passed": False,
            "flag": "Red Risk Flag",
            "reason": (
                f"Declared yield {declared} tons exceeds 1.5x regional average "
                f"({avg} tons/ha × {land} ha × 1.5 = {expected_max} tons). "
                f"Anomaly detected — submission blocked pending officer review."
            ),
            "regional_avg_tons_ha": avg,
            "threshold_tons": expected_max,
            "declared_tons": declared,
        }

    return {"passed": True, "message": "AVS check passed."}
