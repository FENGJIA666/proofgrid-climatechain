# ProofGrid demonstration script

Recorded video verification: the current rendered candidate is 261.824626 seconds (4:21.8), H.264/AAC at 1920×1080, 6,272,551 bytes. Full decoding and representative chapter-frame inspection passed. Public playback and final submission remain separate pending stages.

`media/narration.json` contains eight segments and 541 English words. Rendering uses 142 words per minute; the final encoded video must remain 180–300 seconds. The edit uses actual local acceptance screens and synthetic narration.

## Presentation structure

The demonstration leads with the reviewer problem, visible workflow outcomes and the technical role of each feature. Each chapter connects an action to its result. The workflow uses synthetic validation examples, a processed historical reference, real local EVM transactions and a concrete adoption roadmap.

## 01 — One hour. One record.

Screen: Overview; introduce the repeated meter-hour problem and target reviewer.

Narration:

Clean energy deserves clear evidence. When two plausible solar reports cover the same meter and hour, a spreadsheet can count both. ProofGrid catches that conflict before the records enter renewable energy accounting. Built for small solar operators and community energy reviewers, it connects data quality, duplicate protection, and verifiable evidence in one workflow. This is our entry for the Renewable Energy and Energy Trading track.

## 02 — Review in one workspace

Screen: Actual workspace with CSV, profile, source and review controls.

Narration:

Start with a meter identifier, a supplied capacity bound, and a simple hourly CSV. Every row represents one UTC hour and its energy in kilowatt hours. The workspace brings the energy profile, candidate total, raw readings, and quality findings together. Reviewers can investigate a suspicious value without switching between spreadsheets and technical logs. Synthetic examples make onboarding easy, while a historical solar reference demonstrates the same workflow with published data.

## 03 — Catch problems early

Screen: Actual faulty synthetic sample with capacity and duplicate issues.

Narration:

Watch what happens with a faulty report. One reading exceeds the supplied capacity, and another repeats an hour. ProofGrid identifies the exact problems and blocks the batch. Clear explanations give the reviewer an actionable correction path. The validation also checks formatting, continuity, and nonnegative energy values. An interpretable peak comparison highlights readings for additional attention, keeping automated checks transparent and human review focused.

## 04 — Trace the data source

Screen: Actual OPSD review: 24 hours, 40.719 kWh, source/capacity information.

Narration:

Now load our historical reference from Open Power System Data and CoSSMic. Twenty four nominal hourly values total forty point seven one nine kilowatt hours. The repository includes the selected cumulative counters, transformation script, attribution, and file hashes, making this example reproducible. The screen identifies the processed historical source, approximate hourly boundaries, and ten kilowatt demonstration setting, so reviewers can assess the evidence in context.

## 05 — Make review traceable

Screen: Actual confirmed local EVM transaction and block receipt.

Narration:

After reviewing the profile and any warnings, the reviewer confirms the batch. ProofGrid executes a real transaction on a local Ethereum Virtual Machine. Our Solidity contract records the evidence digest and reserves the meter hour slots atomically. The resulting receipt connects the reviewed dataset to a specific transaction and block. A database can also check local uniqueness. Here, the contract makes both the registration rule and its receipt inspectable, demonstrating a mechanism for a future shared registry.

## 06 — Stop repeat registration

Screen: Actual same-slot re-import rejection after altered readings; source test covers mined revert.

Narration:

Next, we change the supplied readings and try the same twenty four meter hours again. All twenty four occupied slots are detected, and registration is blocked. Changing the file does not create fresh capacity to claim those hours in this registry. The contract also enforces this boundary: our automated test sends an overlapping transaction, confirms that it reverts, and confirms that no partial registration remains.

## 07 — Evidence that checks out

Screen: Actual original verification followed by edited-reading failure.

Narration:

Export the accepted evidence as a portable JSON package. The original passes content and transaction verification. Now alter a reading: the content check fails. ProofGrid combines a recomputed digest with registry identity, on-chain registration, and the successful receipt event. Reviewers get a clear result and can see which check failed. A separate command-line verifier also makes the content-integrity check reproducible outside the interface.

## 08 — Adoption roadmap

Screen: Actual evidence registry with its accepted registration; prospective pilot and registry integration roadmap.

Narration:

ProofGrid turns scattered renewable energy records into an inspectable review trail. Automated tests and the complete local workflow demonstrate the core. The next step is an operator pilot measuring review time and error detection, followed by trusted meter enrollment and durable registry integration. Built around a session-local EVM, the prototype makes the complete evidence-review workflow easy to reproduce. Open code, traceable data, and practical checks provide a concrete foundation for that next step.

## Final acceptance

The recorded candidate passed ffprobe duration/codec/dimension checks, full decoding and independent representative frame inspection. The final chapter uses the accepted registry view with its adoption roadmap. SHA-256: `f2321504ca0b31fb34d054f77502118259c4a173e193861da7d73ab02e46e44a`. Public upload/playback and final Devpost submission remain separate pending stages. The required file attachment is limited to 35 MB.
