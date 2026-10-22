# ProofGrid — draft submission copy

**DRAFT / NOT SUBMITTED.** Implementation and representative local UI behavior checked on 22 October 2026. Public repository/video access and final submission remain pending.

## Tagline

Review solar-meter evidence, catch overlapping claims, and make accepted records independently checkable.

## Track

Renewable Energy & Energy Trading.

## Inspiration

Renewable-energy accounting depends on trustworthy records. Duplicated reporting periods can inflate a spreadsheet total even when individual files look plausible. Established energy-attribute tracking systems already address unique certificate identification; ProofGrid explores a smaller upstream problem: making the review of hourly source evidence understandable and reproducible.

## What it does

ProofGrid is a local proof of concept for reviewing solar-meter evidence. It checks hourly CSV records for formatting, continuity, duplicate timestamps and a supplied capacity bound. A reviewer can inspect issues and the candidate total. Blocking issues reject the whole batch; no bad rows are silently removed. A simple peak-versus-median heuristic highlights records for human attention. It is a rule, not a trained AI model.

Approved batches can be registered on a local EVM. The smart contract prevents a meter-hour slot from being registered again in the same contract, including when the supplied reading changes. An exported JSON package can be checked for content integrity and against the current local transaction receipt.

## How we built it

The implementation uses JavaScript, Vite, Solidity, ethers, solc and Ganache. The server compiles and deploys the contract into a session-local EVM. Supported input is 1–168 continuous UTC hourly intervals in kWh, with at most three decimal places. The evidence payload includes readings, meter label, capacity assumption, source description and review-method version. SHA-256 binds its serialized contents; the transaction event records the commitment and total watt-hours.

The UI provides synthetic demonstration data. The repository also includes a reproducibly derived 24-hour historical reference from Open Power System Data / CoSSMic: 40.719 kWh on the nominal UTC date 1 June 2016. Its original cumulative counters, source hashes, CC-BY-4.0 attribution and preparation script are included. OPSD's hourly resampling shifts actual counter boundaries approximately one minute relative to nominal labels, and its published data can contain interpolation. The example's 10 kW capacity is a review assumption, not a verified installation rating.

## Climate relevance and users

Small solar operators, community-energy coordinators and reviewers could use this workflow to inspect evidence before passing it to a formal accounting system. The intended benefit is more transparent review, not a claim of measured emissions savings. ProofGrid does not issue renewable-energy certificates, establish carbon-credit eligibility or certify that energy was physically generated.

## What makes it useful

The demonstration connects a concrete data-quality issue to a contract-enforced conflict and an export that can be checked again. It keeps rejected records and explanations visible. This is an auditable prototype that can be reproduced locally without buying tokens, connecting a wallet or trusting a hosted AI response.

## Limitations and next steps

A blockchain commitment does not prove physical truth. Meter labels are user supplied and unregistered; changing a label, using another contract or using another registry can evade this prototype's uniqueness boundary. The local chain disappears when its server session ends. An offline content hash alone proves only internal consistency; the local receipt check adds evidence of registration in that session.

A prospective pilot would compare review results with an operator's actual records and measure review time and error rates. No pilot has been conducted. Trusted meter enrollment, signed observations, durable storage, access control and integration with existing registries are future work.

## What we verified

Nine automated tests and the production build passed. In the actual interface, the faulty synthetic input produced three blocking issues. The historical sample displayed 40.719 kWh and its review warning, then produced a real local transaction after acknowledgement. The exported evidence passed verification; changing a reading failed. Re-importing the same 24 meter-hours with changed values produced 24 occupied-slot rejections. Mobile layout was also checked at 390 pixels without horizontal overflow. These checks establish local prototype behavior, not real-meter or production acceptance.

## AI assistance

AI agents assisted with research, implementation, documentation and adversarial review. Their work is not presented as independent human team membership or as unaided authorship. Claims about verification refer only to checks actually recorded in the project's evidence.

## References

- [US EPA: Double counting](https://www.epa.gov/green-power-markets/double-counting)
- [US EPA: Energy attribute tracking systems](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems)
- [Open Power System Data, Household Data, version 2020-04-15](https://data.open-power-system-data.org/household_data/2020-04-15/)

## Submission assets — pending

- Planned repository: `FENGJIA666/proofgrid-climatechain`; creation and anonymous access check pending.
- Local access instructions are in README; representative runtime acceptance is recorded above.
- Playable 3–5 minute demonstration video and supported public video link.
- Required attachment, under 35 MB, containing source, README and evidence.
- Independent final reviewer agreement and Devpost submission readback remain pending.
