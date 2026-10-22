## Delivered: solar evidence that checks out

**Built a complete solar-evidence workflow that registered 24 hours of processed historical solar data totaling 40.719 kWh and rejected all 24 repeated meter-hours—even after the readings changed.**

The delivered package includes **four evidence checks, 11 passing automated tests and reproducible source data**.

ProofGrid connects an incoming solar report to an explained review, an executed smart-contract transaction and a portable evidence package. For small solar operators and community-energy reviewers, that puts the reported total, the supporting records and the registration result in one inspectable workflow.

**Track: Renewable Energy & Energy Trading.**

## Solved the reporting-period problem behind the file

Two plausible spreadsheets from the same solar installation can cover the same hours. Changing a reading changes the file hash; it does not create a new generation period.

We engineered ProofGrid to check both the evidence and the period it represents. The Solidity registry reserves each meter-hour slot and rejects a second registration for the same meter identifier and hour in that registry. Atomic execution protects the entire batch: an overlapping transaction reverts without leaving partial reservations.

Resubmitting all 24 hours with changed readings produced 24 occupied-slot conflicts. An automated contract test also submitted an overlapping transaction, confirmed its rollback and checked that no partial registration remained. Reviewers get a concrete answer to whether the reporting period is already registered.

## Built an actionable review workspace

We combined the energy profile, candidate total, source information, raw readings and quality checks in one interface. The validation identifies malformed values, missing hours, duplicate records and readings above the supplied capacity bound. An interpretable peak-comparison rule directs attention to unusual profiles.

The deliberately faulty synthetic example triggered three explained blocking issues. The complete batch stopped before registration, giving the reviewer specific records to correct. A separate processed historical sample completed review and registration after explicit acknowledgement.

## Bound the reviewed records to an inspectable transaction

We implemented a structured evidence payload that binds the readings, total energy, meter label, source provenance, capacity setting and method specifications. SHA-256 commits to that payload; the smart contract records the commitment and the occupied hours. The resulting receipt connects the reviewed batch to a transaction and block.

The historical batch generated an actual local EVM transaction and a successful receipt. The export preserves the evidence and registration details together, so another reviewer has a repeatable checking path from reported values to recorded execution.

## Delivered four-check evidence verification

We connected content hashing, registry identity, registered evidence and the transaction receipt in one verification flow. The interface displays the result of each check, and a command-line tool reproduces the content-integrity check outside the browser.

The original export passed all four checks. Changing a reading caused the content check to fail. Adversarial checks also rejected a substituted transaction receipt and altered receipt metadata. Reviewers see exactly which check accepted or rejected the package.

## Made the data and results reproducible

The historical reference comes from Open Power System Data and CoSSMic: **24 nominal hourly intervals, 40.719 kWh total and a 7.981 kWh peak**. We included the published cumulative readings, transformation script, file hashes and CC-BY-4.0 attribution. The interface identifies this processed historical source and its configured 10 kW review setting; synthetic fixtures separately exercise validation faults.

All **11 automated tests** and the production build passed. The complete review → registration → export → verification flow was checked in the running application. At a **390-pixel mobile viewport**, content stayed within the viewport width. Saved runtime evidence, source data and executable commands make these outcomes inspectable and reproducible.

## Engineering and reviewer value

The application combines JavaScript/Vite, Solidity, ethers, solc and an in-process Ganache EVM. Its self-contained setup automatically deploys the local contract and accepts **1–168 continuous UTC hourly records** from an existing CSV export. Registration and receipt verification operate against the deployed registry in the running session.

We delivered an open-source package with documented install/run commands, reproducible data preparation and portable JSON evidence. A reviewer starts from familiar CSV files, works in hourly batches and passes the exported package to the next reviewer with the same documented verification procedure. These concrete interfaces make the completed workflow straightforward to evaluate and integrate into a reporting process.

ProofGrid's contribution is the completed connection between source-data review, contract-enforced period registration and portable verification. Existing energy-attribute systems provide the certificate infrastructure; ProofGrid delivers the evidence-review workflow upstream of that infrastructure.

For a solar cooperative reviewer, the result is a clear sequence: inspect the source, resolve the flagged records, register the reviewed hours and hand over evidence with a checking path. Every stage exposes its input, decision and result—bringing traceability directly into renewable-energy reporting.

## References

- [US EPA: Double counting](https://www.epa.gov/green-power-markets/double-counting)
- [US EPA: Energy attribute tracking systems](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems)
- [Open Power System Data, Household Data, version 2020-04-15](https://data.open-power-system-data.org/household_data/2020-04-15/)
