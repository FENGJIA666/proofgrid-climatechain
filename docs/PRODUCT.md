# ProofGrid — product brief

Status: implementation scope checked against source on 22 October 2026; runtime acceptance and final submission are tracked separately.

## Problem and audience

Small solar projects often circulate meter readings in spreadsheets. A reviewer needs to distinguish malformed records, suspicious measurements and duplicated reporting periods before aggregating energy. A document hash alone cannot tell them whether two claims refer to the same meter interval.

ProofGrid is a local proof of concept for solar operators, community-energy coordinators and reviewers. It combines explicit data checks, interval-conflict review and an independently verifiable evidence package. A local EVM contract records evidence commitments and prevents reuse within its documented scope.

## Demonstration workflow

1. Load a clearly labelled synthetic solar-meter dataset or import a supported file.
2. Review unit/time/readings validation and an explanation of each rejected or flagged row.
3. Inspect duplicate meter-hours. The supported intervals are fixed UTC hours, so overlapping coverage resolves to an identical meter-hour slot. Any blocking issue rejects the entire batch; the app does not silently remove rows or approve a partial total.
4. Review the batch total and its issues. A displayed total for a blocked batch is a candidate total, not accepted energy. Separate values supplied by a user from assumptions.
5. Anchor accepted evidence to a local EVM contract and display its actual receipt/network.
6. Export a canonical evidence package and verify its content independently. Alter a value to demonstrate failed integrity verification.

The import schema is `timestamp,kwh`: 1–168 continuous UTC hours, interval energy in nonnegative kWh with at most three decimals. No arbitrary-length intervals or cumulative-counter imports are supported. Payload hashing uses the ordered JSON representation defined by `payloadFor`; an exported JSON payload must preserve its serialized field order for this version. Local verification also checks the current contract and transaction event.

## Minimum useful behavior

- Declare units and whether readings are cumulative counters or interval energy; never infer these silently.
- Handle missing values, nonfinite numbers, invalid timestamps, negative energy, reversed/zero-length intervals and duplicate identifiers.
- Define interval overlap precisely. Prefer half-open intervals so adjacent periods do not conflict.
- Use meter identity consistently. Explain that renamed or unregistered meters can evade purely local identity checks.
- Maintain a visible audit trail for rejected and accepted records; do not silently delete or repair evidence.
- Use reproducible integrity checks with a documented canonical representation.
- Treat contract failures as failures. Do not show successful anchoring until a real transaction receipt exists.

## Claims and limitations

ProofGrid reviews the internal consistency and traceability of supplied evidence. It does not establish that a physical solar installation exists, that a meter is trustworthy, or that energy is renewable. It does not issue certified renewable-energy certificates, establish carbon-credit eligibility or prove avoided emissions.

The local chain is a reproducible engineering demonstration, not a public decentralized trust service. Resetting it resets its state. Its duplicate-prevention boundary is one deployed contract and its chosen identity model; it does not prevent reuse in another registry or deployment.

Synthetic fixtures demonstrate behavior, not field effectiveness. Any anomalies detected by rules must be described as rules. Any learned model must disclose its training/evaluation data, uncertainty and limitations. Human review is needed before consequential use.

## Adoption and scaling proposal

A first pilot would compare supplied intervals against an operator's source records, record reviewer disagreements and measure review time and duplicate-detection performance. No pilot has been conducted. Production adoption would need authenticated meter enrollment, signed observations, protected access, durable storage, independent governance and integration with existing energy registries. These are future requirements, not implemented features.

## Demonstration narrative

Open with a reviewer facing two overlapping claims for one solar meter. Show why accepting both overstates energy. Reject malformed and conflicting intervals, retain an explainable accepted total, anchor its evidence, then alter an exported value and detect the mismatch. End with the distinction between evidence integrity and physical-world truth.


## Existing systems and differentiation

The [US EPA explains double counting](https://www.epa.gov/green-power-markets/double-counting) and describes [energy-attribute tracking systems](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems). Established systems already use unique identifiers. ProofGrid does not claim to invent double-count prevention or replace them. Its intended contribution is a small, reproducible pre-review workflow joining data checks, a scoped registry commitment and an export-verification demonstration.

## Historical reference fixture

`data/opsd-solar-2016-06-01.csv` derives 24 interval values from published CoSSMic cumulative PV counters distributed by Open Power System Data, version 2020-04-15. The total is 40.719 kWh and the maximum is 7.981 kWh. The 10 kW review capacity is an explicit demonstration assumption, not a verified nameplate rating.

OPSD resamples cumulative counters with hourly `.last()` and left-labelled timestamps. Adjacent differences are assigned nominal current-hour labels, while underlying boundaries are approximately one minute earlier. These are processed historical reference intervals, not independently observed exact clock-hour readings. OPSD fills source gaps; the 25 selected source rows do not mark this PV column as interpolated, which is not a guarantee of wholly untouched raw measurement. The source identifier is not an authenticated meter identity.

See `data/opsd-provenance.json`, `data/opsd-raw-selected.csv`, and `scripts/prepare-opsd.py` for source hashes, original selected counters and reproducible transformation. This fixture must remain separate from synthetic/injected-fault demonstrations.
