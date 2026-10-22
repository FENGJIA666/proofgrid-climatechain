#!/usr/bin/env python3
"""Reproduce the historical OPSD reference sample (stdlib only).

This is a transformation of published cumulative counters, not a new meter
measurement. OPSD resamples cumulative values with .last(), left-labelled;
nominal interval labels therefore differ from actual boundaries by ~1 minute.
"""
import csv
import hashlib
import json
from pathlib import Path
from decimal import Decimal
from datetime import datetime, timedelta, timezone
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://data.open-power-system-data.org/household_data/2020-04-15/'
COLUMN = 'DE_KN_residential1_pv'
CACHE = ROOT / '.cache' / 'opsd-hourly.csv'
DATA = ROOT / 'data'
CACHE.parent.mkdir(exist_ok=True)
DATA.mkdir(exist_ok=True)
if not CACHE.exists():
    with urlopen(BASE + 'household_data_60min_singleindex.csv', timeout=120) as response:
        CACHE.write_bytes(response.read())
metadata_path = DATA / 'opsd-datapackage.json'
if not metadata_path.exists():
    with urlopen(BASE + 'datapackage.json', timeout=60) as response:
        metadata_path.write_bytes(response.read())
metadata = json.loads(metadata_path.read_text())
assert any(x['id'] == 'CC-BY-4.0' for x in metadata['licenses'])
start = datetime(2016, 6, 1, tzinfo=timezone.utc)
stamps = [(start + timedelta(hours=h)).strftime('%Y-%m-%dT%H:00:00Z') for h in range(-1, 24)]
with CACHE.open(newline='') as handle:
    source = {r['utc_timestamp']: r for r in csv.DictReader(handle) if r['utc_timestamp'] in stamps}
assert len(source) == 25, 'Need preceding counter plus all 24 current-hour counters'
selected = [source[s] for s in stamps]
values = [Decimal(r[COLUMN]) for r in selected]
assert all(v.is_finite() for v in values)
deltas = [values[i] - values[i-1] for i in range(1, 25)]
assert all(v >= 0 and v.as_tuple().exponent >= -3 for v in deltas)
assert sum(deltas) == values[-1] - values[0]
raw_path = DATA / 'opsd-raw-selected.csv'
with raw_path.open('w', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=['utc_timestamp', COLUMN, 'interpolated'])
    writer.writeheader()
    writer.writerows({k: r[k] for k in writer.fieldnames} for r in selected)
output = DATA / 'opsd-solar-2016-06-01.csv'
with output.open('w', newline='') as handle:
    writer = csv.writer(handle)
    writer.writerow(['timestamp', 'kwh'])
    writer.writerows((s, f'{v:.3f}') for s, v in zip(stamps[1:], deltas))
manifest = {
    'sourceUrl': BASE + 'household_data_60min_singleindex.csv',
    'metadataUrl': BASE + 'datapackage.json',
    'version': '2020-04-15', 'license': 'CC-BY-4.0',
    'attribution': 'Open Power System Data. 2020. Data Package Household Data. Version 2020-04-15. Primary source: CoSSMic.',
    'sourceSha256': hashlib.sha256(CACHE.read_bytes()).hexdigest(),
    'metadataSha256': hashlib.sha256(metadata_path.read_bytes()).hexdigest(),
    'selectedSourceSha256': hashlib.sha256(raw_path.read_bytes()).hexdigest(),
    'derivedCsvSha256': hashlib.sha256(output.read_bytes()).hexdigest(),
    'column': COLUMN, 'sourceUnit': 'cumulative kWh', 'outputUnit': 'interval kWh',
    'operation': 'current counter minus previous counter; no rounding beyond original 0.001 kWh precision',
    'resamplingSource': 'https://github.com/isc-konstanz/household_data/blob/2020-04-15/processing.ipynb',
    'intervalCaveat': 'OPSD uses hourly resample.last() with left labels. Derived intervals retain nominal current-hour labels; actual counter boundaries are approximately one minute earlier. Not exact independently measured clock-hour energy.',
    'interpolationCaveat': 'OPSD publishes processed measured data and fills gaps. No selected row flags this PV column; that is not an independent guarantee of unmodified raw measurements.',
    'selectedPvRowsMarkedInterpolated': sum(COLUMN in r['interpolated'] for r in selected),
    'nominalDateUTC': '2016-06-01', 'intervalCount': 24,
    'totalKwh': str(sum(deltas)), 'peakHourlyKwh': str(max(deltas)),
    'suggestedDemoMeterId': 'OPSD-RESIDENTIAL1-PV',
    'suggestedDemoCapacityKw': 10,
    'capacityCaveat': '10 kW is an explicit demo review assumption, not a verified installation rating.',
    'identityCaveat': 'Public dataset column label is not an enrolled or authenticated physical meter identity.'
}
(DATA / 'opsd-provenance.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({k: manifest[k] for k in ['intervalCount', 'totalKwh', 'peakHourlyKwh', 'selectedPvRowsMarkedInterpolated', 'sourceSha256']}, indent=2))
