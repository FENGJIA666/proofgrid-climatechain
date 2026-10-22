# ProofGrid demonstration script

The demonstration follows the complete workflow from CSV review to registered evidence and export verification. Chapters use actual application screens, labelled synthetic examples, a processed historical solar reference and EVM transaction receipts.

## 01 — One hour. One record.

Screen: Workspace overview and the repeated meter-hour problem.

Narration:

Clean energy deserves clear evidence. When two plausible solar reports cover the same meter and hour, a spreadsheet can count both. ProofGrid catches that conflict before the records enter renewable energy accounting. Built for small solar operators and community energy reviewers, it connects data quality, duplicate protection, and verifiable evidence in one workflow. This is our entry for the Renewable Energy and Energy Trading track.

## 02 — Review in one workspace

Screen: Workspace input, energy profile, candidate total and raw readings.

Narration:

Start with a meter identifier, a supplied capacity bound, and a simple hourly CSV. Every row represents one UTC hour and its energy in kilowatt hours. The workspace brings the energy profile, candidate total, raw readings, and quality findings together. Reviewers can investigate a suspicious value without switching between spreadsheets and technical logs. Synthetic examples make onboarding easy, while a historical solar reference demonstrates the same workflow with published data.

## 03 — Catch problems early

Screen: Faulty synthetic sample with explained blocking issues.

Narration:

Watch what happens with a faulty report. One reading exceeds the supplied capacity, and another repeats an hour. ProofGrid identifies the exact problems and blocks the batch. Clear explanations give the reviewer an actionable correction path. The validation also checks formatting, continuity, and nonnegative energy values. An interpretable peak comparison highlights readings for additional attention, keeping automated checks transparent and human review focused.

## 04 — Trace the data source

Screen: Historical OPSD sample, 40.719 kWh total and configured review setting.

Narration:

Now load our historical reference from Open Power System Data and CoSSMic. Twenty four nominal hourly values total forty point seven one nine kilowatt hours. The repository includes the selected cumulative counters, transformation script, attribution, and file hashes, making this example reproducible. The screen connects these readings to their published source and the configured ten kilowatt review setting.

## 05 — Make review traceable

Screen: Confirmed EVM transaction, evidence digest and block receipt.

Narration:

After reviewing the profile and any warnings, the reviewer confirms the batch. ProofGrid executes a real transaction on a local Ethereum Virtual Machine. Our Solidity contract records the evidence digest and reserves the meter hour slots atomically. The resulting receipt connects the reviewed dataset to a specific transaction and block. Source classification, readings, and verification specifications are committed together. Reviewers can inspect exactly which evidence was registered and use its receipt to check that registration again.

## 06 — Stop repeat registration

Screen: Same-slot re-import rejection after changed readings.

Narration:

Next, we change the supplied readings and try the same twenty four meter hours again. All twenty four occupied slots are detected, and registration is blocked. Changing the file does not create fresh capacity to claim those hours in this registry. The contract also enforces this boundary: our automated test sends an overlapping transaction, confirms that it reverts, and confirms that no partial registration remains.

## 07 — Evidence that checks out

Screen: Original verification followed by detection of an altered reading.

Narration:

Export the accepted evidence as a portable JSON package. The original passes content and transaction verification. Now alter a reading: the content check fails. ProofGrid combines a recomputed digest with registry identity, on-chain registration, and the successful receipt event. Reviewers get a clear result and can see which check failed. A separate command-line verifier also makes the content-integrity check reproducible outside the interface.

## 08 — Delivered and verified

Screen: Evidence registry and delivered verification results.

Narration:

ProofGrid delivers a complete path from a solar CSV to a verifiable evidence package. The working interface brings analysis, review, registration, export, and verification together. The historical example records twenty four hours and forty point seven one nine kilowatt hours. Repeated hours are blocked, and an edited reading is detected. Eleven automated tests pass across validation, contract execution, source classification, and evidence integrity. Four verification checks connect each export to its registered evidence. The code, data preparation, and verification commands are available to reproduce these results. Review. Register. Verify. One hour. One record.

## Recording format

The eight chapters contain 553 words. The rendered video uses H.264/AAC at 1920×1080 and runs 272.417914 seconds (4:32.4). Runtime checks and artifact verification are recorded in [the acceptance record](UI_ACCEPTANCE.md).
