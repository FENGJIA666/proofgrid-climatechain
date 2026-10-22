# ProofGrid

**Good energy. Clear evidence.**

**Built and validated the complete solar-evidence workflow:** registered **24 hours of processed historical solar data totaling 40.719 kWh**, rejected **all 24 repeated meter-hours** after their readings changed, and verified the original export with **four evidence checks**.

**IEEE ClimateChain Global Hackathon — Renewable Energy & Energy Trading.**

ProofGrid gives reviewers one traceable sequence from source readings to an explained decision, an executed registration and a portable evidence package.

| Delivered capability | Verified result | Reviewer value |
|---|---|---|
| Explainable quality review | Faulty synthetic input blocked with three identified issues | Pinpoint records to correct before registration |
| Contract-enforced period registration | All 24 repeated meter-hours rejected after readings changed | Check period reuse, alongside file integrity |
| Four-check verification | Original export passes all checks; altered reading is detected | See which content or receipt check determines the result |
| Reproducible historical reference | 24 nominal hours, 40.719 kWh, published OPSD / CoSSMic source | Trace the total to source counters and conversion code |
| Tested delivery | All 11 automated tests and the production build pass | Re-run documented checks and inspect saved evidence |

[Read the project story](docs/DEVPOST_STORY.md) · [See acceptance evidence](docs/UI_ACCEPTANCE.md) · [Inspect the architecture](docs/PRODUCT.md)

## Run locally

Use Node.js 20 or later and npm. The self-contained application starts an in-process Ganache EVM and deploys its Solidity contract automatically.

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

Stop the development server first if it uses the same port. `npm start` serves the built `dist` files with a fresh session-local chain.

## Try the workflow

1. Load the deliberately faulty synthetic example. Review the blocking issues; the whole batch is rejected.
2. Load the processed OPSD historical sample. Inspect its source information, 24 nominal hours, 40.719 kWh total and 7.981 kWh peak. The review uses a configured 10 kW setting.
3. Review any warning and confirm the reviewer acknowledgement. Anchor the batch and inspect its local transaction receipt.
4. Export the evidence JSON. Verify it in the same running session.
5. Change one reading in a copy of the export and verify again: the content check fails.
6. Re-import the same meter-hours, including with changed readings: existing slots prevent a second registration in this contract.

Input CSV header is `timestamp,kwh`. Supply 1–168 continuous UTC hourly records, with timestamps such as `2016-06-01T08:00:00Z` and nonnegative interval kWh to at most three decimals. Each timestamp represents a fixed one-hour interval. Capacity is supplied separately in kW. Acceptance applies to the complete batch after its blocking issues are resolved.

## Tests and evidence verification

```sh
npm test
node scripts/verify-offline.mjs evidence/opsd-proof.json
node scripts/verify-offline.mjs evidence/tampered-proof.json
```

The last command intentionally returns exit code 1 for the tampered fixture. Invalid usage returns 2. Offline verification recomputes the payload digest for a content-integrity comparison. For registration verification, use the app in the originating session: it also queries the deployed contract and checks the transaction event.

The current implementation passed eleven automated tests and a production build. Runtime checks demonstrate: three blocking issues for the faulty sample; historical total/peak and review warning; successful local block-2 anchoring; successful original export verification; failure after changing one value; 24 occupied-slot rejections after changing the historical readings; and a 390-pixel mobile viewport without horizontal overflow. Saved captures and example exports are in `evidence/`; `docs/UI_ACCEPTANCE.md` maps each check to its artifact. These results cover the complete local workflow.

## Architecture

- `src/`: browser interface, input/review actions, evidence display and verification.
- `server/domain.js`: CSV validation, capacity and continuity rules, peak/median review heuristic, payload serialization and hashing.
- `server/index.js`: local HTTP API and session state.
- `server/chain.js`: Solidity compilation, Ganache provider and contract deployment.
- `contracts/EnergyRegistry.sol`: commitment registration and meter-hour slot uniqueness.
- `scripts/verify-offline.mjs`: standalone package content check.

The v2 payload commits to meter label, structured provenance, capacity setting, hourly readings, total, method version and verification/registry/session specifications. The current SHA-256 representation uses the JSON serialization defined by `payloadFor`; preserve the exported payload's field order. The contract rejects already occupied slots atomically. The browser/server checks improve feedback; the contract enforces that registration boundary.

## Data and attribution

The clean and faulty synthetic fixtures demonstrate validation behavior.

The historical reference derives from **Open Power System Data. 2020. Data Package Household Data. Version 2020-04-15**, primary data from CoSSMic, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Dataset and documentation](https://data.open-power-system-data.org/household_data/2020-04-15/).

`data/opsd-raw-selected.csv` preserves the 25 selected published cumulative readings and interpolation markers. `data/opsd-solar-2016-06-01.csv` contains 24 adjacent differences. `data/opsd-provenance.json` records download and derivative hashes, units and transformation details. `data/opsd-datapackage.json` preserves the publisher's metadata.

Reproduce the sample with Python 3 and network access on the first run:

```sh
python3 scripts/prepare-opsd.py
```

The script downloads roughly 15 MB into ignored `.cache/`, checks metadata and selected values, and writes the sample. Its regeneration was checked to produce identical hashes. OPSD resamples cumulative counters using hourly `.last()` with left labels, so nominal intervals have approximately one-minute boundary displacement. Published data can include gap filling. The selected rows preserve the publisher’s interpolation markers, and the public dataset column supplies the example’s meter label. Full transformation details are recorded in `data/opsd-provenance.json`.

## Runtime specification

The demonstration runs a session-local EVM, with uniqueness defined by a canonical meter identifier and UTC hour in one deployed registry. Review uses transparent validation rules and an explicit reviewer acknowledgement. See [technical specifications](docs/PRODUCT.md) for the input contract, data provenance and verification model.

The application combines a source-data review workspace, atomic registration and portable evidence verification. [EPA tracking-system context](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems).

## Development and project materials

Developed with AI assistance for research, implementation, documentation and adversarial review.

The public source repository includes reproducible code, data and supporting materials. See `docs/PRODUCT.md`, `docs/DEVPOST_STORY.md`, `docs/DEMO_SCRIPT.md` and `docs/UI_ACCEPTANCE.md` for scope and delivery details.
