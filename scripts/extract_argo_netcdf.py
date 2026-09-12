"""Build browser-friendly BGC-Argo profile summaries from NetCDF files.

The raw BGC S-profile files are intentionally not loaded by the React app.
This script keeps the values needed by the dashboard while retaining the
original .nc files as the authoritative source of truth.
"""

from __future__ import annotations

import json
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import h5py
from scipy.io import netcdf_file


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "argo_data" / "bgc_sprof"
OUTPUT = ROOT / "src" / "data" / "argoNetcdfSummaries.json"
ARBITRARY_FILL_LIMIT = 1e4


def platform_id(row: np.ndarray) -> str:
    return b"".join(row).decode("ascii").strip()


def valid(values: np.ndarray) -> np.ndarray:
    values = np.asarray(values, dtype=float)
    return values[np.isfinite(values) & (np.abs(values) < ARBITRARY_FILL_LIMIT)]


def rounded_mean(values: np.ndarray) -> float | None:
    values = valid(values)
    return round(float(np.mean(values)), 3) if values.size else None


def rounded_surface(values: np.ndarray, pressure: np.ndarray) -> float | None:
    values = np.asarray(values, dtype=float)
    pressure = np.asarray(pressure, dtype=float)
    if values.size == 0 or pressure.size == 0:
        return None
    mask = (
        np.isfinite(values)
        & np.isfinite(pressure)
        & (np.abs(values) < ARBITRARY_FILL_LIMIT)
        & (np.abs(pressure) < ARBITRARY_FILL_LIMIT)
    )
    if not np.any(mask):
        return None
    return round(float(values[mask][np.argmin(pressure[mask])]), 3)


def read_variable(variable) -> np.ndarray:
    """Read a variable from either NetCDF-3 (SciPy) or NetCDF-4 (HDF5)."""
    return variable.data.copy() if hasattr(variable, "data") else variable[()]


def variable_values(variables: dict, name: str, index: int) -> np.ndarray:
    """Return a profile's values, or an empty array when a sensor is absent."""
    values = variables.get(name)
    return np.asarray(values[index]) if values is not None else np.array([])


def iso_date(juld: float) -> str | None:
    # JULD is days since 1950, so valid 2026 dates are already ~27,760.
    if not np.isfinite(juld) or abs(juld) >= 1e6:
        return None
    # Argo Julian days are measured from 1950-01-01 UTC.
    return (datetime(1950, 1, 1, tzinfo=timezone.utc) + timedelta(days=float(juld))).isoformat().replace("+00:00", "Z")


def extract_file(path: Path) -> list[dict]:
    try:
        dataset = netcdf_file(path, "r", mmap=False)
    except TypeError:
        dataset = h5py.File(path, "r")

    with dataset:
        variables = dataset.variables if hasattr(dataset, "variables") else dataset
        platforms = read_variable(variables["PLATFORM_NUMBER"])
        dates = read_variable(variables["JULD"])
        latitudes = read_variable(variables["LATITUDE"])
        longitudes = read_variable(variables["LONGITUDE"])
        pressures = read_variable(variables["PRES"])
        temperatures = read_variable(variables["TEMP"])
        salinities = read_variable(variables["PSAL"])
        sensors = {
            name: read_variable(variables[name])
            for name in ("DOXY", "CHLA", "NITRATE")
            if name in variables
        }

    profiles = []
    for index, platform in enumerate(platforms):
        observed_at = iso_date(float(dates[index]))
        if not observed_at:
            continue
        pressure = valid(pressures[index])
        lat, lon = float(latitudes[index]), float(longitudes[index])
        if not (np.isfinite(lat) and np.isfinite(lon) and abs(lat) <= 90 and abs(lon) <= 360):
            continue
        profiles.append({
            "platformId": platform_id(platform),
            "observedAt": observed_at,
            "lat": round(lat, 5),
            "lon": round(lon, 5),
            "levels": int(pressure.size),
            "maxPressure": round(float(np.max(pressure)), 1) if pressure.size else None,
            "surfaceTemperature": rounded_surface(temperatures[index], pressures[index]),
            "surfaceSalinity": rounded_surface(salinities[index], pressures[index]),
            "meanTemperature": rounded_mean(temperatures[index]),
            "meanSalinity": rounded_mean(salinities[index]),
            "surfaceOxygen": rounded_surface(variable_values(sensors, "DOXY", index), pressures[index]),
            "surfaceChlorophyll": rounded_surface(variable_values(sensors, "CHLA", index), pressures[index]),
            "surfaceNitrate": rounded_surface(variable_values(sensors, "NITRATE", index), pressures[index]),
        })
    return profiles


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a browser index from BGC-Argo S-profile files.")
    parser.add_argument("--limit", type=int, help="Process only this many files (useful for a quick local preview).")
    args = parser.parse_args()

    summaries = []
    paths = sorted(SOURCE.glob("*.nc"))
    if args.limit is not None:
        if args.limit <= 0:
            parser.error("--limit must be a positive integer")
        # Spread preview records across the complete collection so the UI is
        # representative of the available floats and time range.
        stride = len(paths) / min(args.limit, len(paths))
        paths = [paths[min(int(index * stride), len(paths) - 1)] for index in range(min(args.limit, len(paths)))]

    for index, path in enumerate(paths, start=1):
        summaries.extend(extract_file(path))
        if index % 1_000 == 0:
            print(f"Processed {index:,} files")

    OUTPUT.write_text(json.dumps(summaries, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(summaries):,} BGC-Argo profile summaries to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
