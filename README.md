# ProofGrid

**Good energy. Clear evidence.**

Turn hourly solar data into a reviewable, tamper-evident record. ProofGrid brings explainable quality checks, smart-contract meter-hour registration and evidence verification into one local working prototype.

**IEEE ClimateChain Global Hackathon — Renewable Energy & Energy Trading.**

A reviewer can catch conflicting reports, inspect a historical solar sample, anchor the reviewed batch on a real local EVM, and verify the exported evidence—all in one workflow.

| Demonstrated capability | Observed result |
|---|---|
| Quality review | Faulty synthetic input blocked with three explained issues |
| Historical reference | 24 nominal hours, 40.719 kWh, traceable OPSD / CoSSMic source |
| Duplicate protection | 24 occupied meter-hours rejected even after readings changed |
| Evidence verification | Original package passes; altered reading fails |
| Reproducibility | Nine automated tests; isolated source install, build and production startup pass |

[Read the project story](docs/DEVPOST_STORY.md) · [See local acceptance evidence](docs/UI_ACCEPTANCE.md) · [Explore the design](docs/PRODUCT.md)

## Run locally

Use Node.js 20 or later and npm. No wallet, paid RPC or token purchase is needed. The application starts an in-process Ganache EVM and deploys its Solidity contract automatically.

Public source: [FENGJIA666/proofgrid-climatechain](https://github.com/FENGJIA666/proofgrid-climatechain). Clone it with:

```sh
git clone https://github.com/FENGJIA666/proofgrid-climatechain.git
cd proofgrid-climatechain
npm ci
npm run dev
```

For an extracted source archive, enter its directory and run the last two commands. Open [http://127.0.0.1:4187](http://127.0.0.1:4187). The server binds to loopback. To use another free port, run `PORT=4188 npm run dev` on macOS/Linux.

Production-mode local serving:

```sh
npm run build
npm start
```

Stop the development server first if it uses the same port. `npm start` serves the built `dist` files; it still creates a session-local chain. These commands are local execution instructions, not a claim of public deployment.

## Try the workflow

1. Load the deliberately faulty synthetic example. Review the blocking issues; the whole batch is rejected.
2. Load the processed OPSD historical sample. Inspect its source caveats, 24 nominal hours, 40.719 kWh total and 7.981 kWh peak. The 10 kW capacity is an explicit demonstration assumption.
3. Review any warning and confirm the reviewer acknowledgement. Anchor the batch and inspect its local transaction receipt.
4. Export the evidence JSON. Verify it in the same running session.
5. Change one reading in a copy of the export and verify again: the content check fails.
6. Re-import the same meter-hours, including with changed readings: existing slots prevent a second registration in this contract.

Input CSV header is `timestamp,kwh`. Supply 1–168 continuous UTC hourly records, with timestamps such as `2016-06-01T08:00:00Z` and nonnegative interval kWh to at most three decimals. These are fixed one-hour intervals, not cumulative counters or arbitrary intervals. Capacity is supplied separately in kW. A candidate total is not accepted evidence when its batch is blocked. No rows are silently dropped to approve a partial batch.

## Tests and evidence verification

```sh
npm test
node scripts/verify-offline.mjs evidence/opsd-proof.json
node scripts/verify-offline.mjs evidence/tampered-proof.json
```

The last command intentionally returns exit code 1 for the tampered fixture. Invalid usage returns 2. Offline verification checks only the payload against the digest inside its package. An attacker can change both; an offline match is not registration proof. The app's verification additionally queries the current local contract and checks its transaction event. Evidence from a previous session cannot establish registration in a newly restarted chain.

The current implementation passed nine automated tests and a production build. Runtime checks demonstrate: three blocking issues for the faulty sample; historical total/peak and review warning; successful local block-2 anchoring; successful original export verification; failure after changing one value; 24 occupied-slot rejections after changing the historical readings; and a 390-pixel mobile viewport without horizontal overflow. Saved captures and example exports are in `evidence/`; `docs/UI_ACCEPTANCE.md` maps each check to its artifact. This is local acceptance, not a production or real-meter pilot.

## Architecture

- `src/`: browser interface, input/review actions, evidence display and verification.
- `server/domain.js`: CSV validation, capacity and continuity rules, peak/median review heuristic, payload serialization and hashing.
- `server/index.js`: local HTTP API and session state.
- `server/chain.js`: Solidity compilation, Ganache provider and contract deployment.
- `contracts/EnergyRegistry.sol`: commitment registration and meter-hour slot uniqueness.
- `scripts/verify-offline.mjs`: standalone package content check.

A payload commits to meter label, source description, capacity assumption, hourly readings, total and method version. The current SHA-256 representation uses the JSON serialization defined by `payloadFor`; preserve the exported payload's field order. The contract rejects already occupied slots atomically. The browser/server checks improve feedback; the contract enforces that registration boundary.

## Data and attribution

The synthetic samples are intentionally created demonstration fixtures. They are not measurements.

The historical reference derives from **Open Power System Data. 2020. Data Package Household Data. Version 2020-04-15**, primary data from CoSSMic, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Dataset and documentation](https://data.open-power-system-data.org/household_data/2020-04-15/).

`data/opsd-raw-selected.csv` preserves the 25 selected published cumulative readings and interpolation markers. `data/opsd-solar-2016-06-01.csv` contains 24 adjacent differences. `data/opsd-provenance.json` records download and derivative hashes, units and limitations. `data/opsd-datapackage.json` preserves the publisher's metadata.

Reproduce the sample with Python 3 and network access on the first run:

```sh
python3 scripts/prepare-opsd.py
```

The script downloads roughly 15 MB into ignored `.cache/`, checks metadata and selected values, and writes the sample. Its regeneration was checked to produce identical hashes. OPSD resamples cumulative counters using hourly `.last()` with left labels, so nominal intervals have approximately one-minute boundary displacement. Published data can include gap filling. None of the selected rows marks this PV column as interpolated; this is not a guarantee of untouched raw measurement. The public column label is not an authenticated meter identity.

## Deployment model and roadmap

The demonstration runs a session-local EVM, with uniqueness defined by a canonical meter identifier and UTC hour in one deployed registry. Review uses transparent validation rules and an explicit reviewer acknowledgement. See [technical specifications](docs/PRODUCT.md) for the input contract, data provenance and verification model.

The adoption roadmap starts with a solar-cooperative pilot measuring review time and missed conflicts, followed by authenticated meter enrollment, signed measurements, durable storage and integration with established energy-attribute registries. [EPA tracking-system context](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems).

## AI assistance and submission status

Developed with AI assistance for research, implementation, documentation and adversarial review.

The Devpost entry remains a draft at this update. The public source repository is available. Final video-link verification, attachment and final submission are pending. See `docs/PRODUCT.md`, `docs/DEVPOST_STORY.md`, `docs/DEMO_SCRIPT.md` and `docs/UI_ACCEPTANCE.md` for scope and delivery details.
