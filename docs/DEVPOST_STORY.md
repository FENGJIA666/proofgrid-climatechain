## Track

Renewable Energy & Energy Trading.

## Inspiration: make every reported solar hour accountable

A community solar coordinator receives two spreadsheets from the same installation. Both look plausible. Their reporting periods overlap. Before the coordinator shares an energy total with a partner, someone must answer three questions: are the records internally consistent, have these hours already been registered, and can another reviewer reproduce the evidence?

Changing an energy value creates a different file hash, but it does not create a new solar hour. ProofGrid catches that distinction. It turns the coordinator’s questions into one working workflow: **CSV → explained review → real receipt → verifiable export**. It helps small solar operators and community-energy reviewers prepare clearer, traceable evidence for renewable-energy accounting.

## What it does

ProofGrid is a local working prototype that takes an hourly solar CSV from import to a verifiable evidence package.

The review workspace explains malformed readings, gaps, duplicates and values above the supplied capacity bound. A peak-comparison rule highlights unusual profiles for human attention. Blocking issues stop the entire batch, preserving a clear decision trail. After reviewing the evidence, the user explicitly acknowledges it and submits a real smart-contract transaction.

The Solidity registry reserves each meter-hour slot. A second claim for the same meter identifier and an occupied hour is rejected in that registry—even when its energy value changes. Registration is atomic: an overlapping batch cannot reserve only its nonconflicting hours. The user can then export a JSON evidence package and check its contents against the commitment and the transaction receipt in the current local EVM session.

## The technical idea: protect the interval, then bind the evidence

A file hash answers whether a document changed. The accounting problem also asks whether its reporting period has already been used. ProofGrid combines meter-hour uniqueness with a commitment to the complete reviewed payload: readings, total energy, meter label, source description, capacity assumption and review-method version.

A database unique key can enforce uniqueness for one operator. ProofGrid explores making both the registration rule and its execution receipt inspectable as evidence moves between reviewers: the contract source defines the rule, and the local transaction exposes its result.

Its contribution is the integration of explainable source-data checks, contract-enforced interval registration and repeatable export verification in a lightweight workflow. Existing energy-attribute tracking systems provide established certificate infrastructure; ProofGrid targets the evidence preparation step that can feed such systems.

The implementation uses JavaScript and Vite for the workspace, Solidity for the registry, ethers for transactions, solc for compilation and Ganache for the local EVM. Reviewers can run the complete prototype through a self-contained local setup. Operators can start from existing CSV exports containing 1–168 continuous UTC hourly records, making interval conflicts precise and understandable.

## A demonstration with traceable data and observable outcomes

The demo moves from a deliberately faulty synthetic file to a processed historical solar sample from Open Power System Data and CoSSMic. The historical sample contains 24 nominal hourly intervals totaling **40.719 kWh**, with a **7.981 kWh** peak. Its source counters, transformation script, download hashes and CC-BY-4.0 attribution are included. The interface identifies the processed historical source and the demonstration's assumed 10 kW review capacity.

The working prototype demonstrates:

- **Visible quality control:** the faulty example produces three blocking issues.
- **Real contract execution:** reviewer acknowledgement is followed by a successful local EVM transaction and receipt.
- **Duplicate-claim rejection:** changing the supplied readings and resubmitting the same 24 meter-hour slots produces 24 occupied-slot conflicts.
- **Tamper detection:** the original export passes verification; changing a reading makes verification fail. Adversarial checks also reject a substituted transaction receipt.
- **Reproducibility:** eleven automated tests and the production build pass, with saved runtime evidence and an offline content-checking tool.

The demonstration follows this complete workflow. The interface also works at a 390-pixel mobile viewport without horizontal overflow.

## Climate value and a path to adoption

Better renewable-energy accounting starts with evidence that reviewers can inspect and explain. ProofGrid makes duplicate reporting and inconsistent inputs visible at the point of review, and preserves the connection between accepted records and their registration. Its immediate value is a concrete way to examine the evidence behind a reported energy total.

A first adoption step would be a pilot with a solar cooperative reviewer handling monthly CSV reports in one-to-seven-day batches: import the reporting files, compare results with source records, and measure review time, missed conflicts and reviewer disagreements. That would test the workflow's operational value using clear, measurable outcomes.

The next integration milestones are authenticated meter enrollment and signed observations, followed by durable registry storage and then connectors to existing energy-attribute systems. The current prototype establishes the review-and-verification loop; these milestones would connect it to operational infrastructure.

## References

- [US EPA: Double counting](https://www.epa.gov/green-power-markets/double-counting)
- [US EPA: Energy attribute tracking systems](https://www.epa.gov/green-power-markets/energy-attribute-tracking-systems)
- [Open Power System Data, Household Data, version 2020-04-15](https://data.open-power-system-data.org/household_data/2020-04-15/)
