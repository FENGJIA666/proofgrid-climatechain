# Independent opposition review

Reviewer: opposition_manager. Date: 22 October 2026 (Singapore).
Status: **LOCAL SUBMISSION CANDIDATE ACCEPTED. Engineering agreement reached; public delivery and actual submission are separate pending checks.**

## Rules basis

- [Official overview](https://ieee-climatechain-hack.devpost.com/): chosen track; problem, solution, users, scalability/adoption; 3–5 minute functional demo; public source repository/documentation; prototype/PoC.
- [Rules](https://ieee-climatechain-hack.devpost.com/rules): individual participation allowed; five criteria are climate impact, innovation, technical execution, usefulness and presentation.
- [Schedule](https://ieee-climatechain-hack.devpost.com/details/dates): deadline 25 October 2026, 22:00 Singapore time.
- AI wording: overview broadly requests blockchain, AI and data-driven approaches, while judging lists blockchain, contracts, AI, platforms **or** environmental-data integration as examples. No distinct mandatory trained-model or generative-AI component appears in the inspected requirements. Do not claim rule-based validation is AI; eligibility of a blockchain/data-only prototype is a reasonable interpretation, not an organizer's explicit ruling.

## Round 1 — design challenge

Conditionally support Renewable Energy & Energy Trading: pre-review of supplied solar-generation evidence. A fixed UTC one-hour slot model is sufficient to detect overlaps within this supported format. Adjacent hours must remain valid. Explicit interval energy avoids confusing cumulative counter resets with energy readings.

Acceptance conditions: robust invalid-input handling; consistent meter identities; real EVM receipts and rejected overlapping claims; tampering detected; explicit local-registry and physical-truth limitations; honest synthetic/reference-data provenance. Agents are development assistance, not fictitious human team members.

## Round 2 — source inspection

Inspected server/domain.js, server/index.js, server/chain.js and contracts/EnergyRegistry.sol before UI/tests were complete.

### R2-01 — blocking: canonical meter ID bypass

`analyze` receives `String(b.meter || '').trim()`, but registry lookup, persisted batch and subsequent slot hashing use original `b.meter`. A request using `DEMO-01` and one using ` DEMO-01 ` can pass the same validator yet reserve different slots. Canonicalize once and reuse everywhere. Required regression: API requests using both forms cannot anchor the same hour twice.

### R2-02 — blocking for full-proof verification: receipt metadata unchecked

Verification binds digest and totalWh to the event but ignores supplied blockNumber, issuer and network. Altering these fields can still return `valid: true`. Validate metadata against the receipt/transaction and expected network, plus event interval count against payload length; alternatively explicitly exclude unverified metadata from a narrower result. Required regression: changing each claimed receipt field fails verification.

### R2-03 — pending runtime and adversarial evidence

Tests and UI were not present at inspection. Need direct evidence for invalid timestamps/numbers/order/gaps, duplicate slots, adjacent valid slots, trusted-issuer enforcement, tampered payloads, substituted transaction receipts, and honest displayed failure states. No final agreement is implied by source-only review.

## Product-value and claim boundaries

Scope is quality review and duplicate protection in one registry with an assumed canonical meter identity. Changing meter identity, redeploying, another registry or false source readings remain outside guarantees. The EVM is local and ephemeral. No REC issuance, independent certification, measured emissions reduction or real-world pilot has been demonstrated. Historical OPSD processed counters must not be called exact raw clock-hour measurement.

## Final decision

Pending remediation, independent retest, actual UI evidence, public repository, complete 3–5 minute video and observed submission state.

## Round 3 — independent remediation retest

Source checked after engineering reported revision `2096024`. R2-01 and R2-02 are **resolved** in the inspected implementation: one trimmed meter value flows through analysis/storage/slots; verification binds network, block number, sender and event interval count as well as digest/energy.

Independently reran API and EVM suites: 2 targeted tests passed. Ran a separate adversarial process on port 4201 without touching the manager's port 4187 runtime. Passed: seven proof attacks (recomputed payload digest, nonexistent receipt, chain ID, contract, issuer, block number, network); three whitespace variants of an already registered meter; adjacent hour acceptance; refusal without explicit review; substitution of another real successful receipt; offline clean package exits 0 and changed reading exits 1. Temporary process/files were removed.

The offline verifier correctly states that recomputing both data and digest can evade an internal hash check, and directs readers to the original registry transaction. The draft submission correctly distinguishes rules from AI, local EVM from public trust, historical processed data from verified generation, and proposed adoption from a conducted pilot. No remaining blocking defect found within these tested boundaries. Ganache emits a native µWS compatibility warning and uses its JavaScript fallback; tests pass with that fallback.

**Engineering agreement: accepted within the documented prototype boundaries.** Final competition delivery agreement still requires the manager's visual/runtime acceptance, complete 3–5 minute video, anonymously readable source, usable attachment and observed final submission. This is not a claim that those external steps have occurred.


## Round 4 — local delivery candidate review

Independent video check: `media/ProofGrid-demo.mp4` is 217.806893 seconds (3:37.8), 1920×1080 H.264 with AAC audio, 5,228,285 bytes. Full decoding via ffmpeg returned no error. An eight-segment contact sheet was inspected: actual UI evidence states cover input, blocking issues, historical sample, anchor receipt, occupied-slot rejection, verification failure and limitations. It is an edited screenshot walkthrough with synthetic narration, visibly disclosed; it is not described as a continuous interaction recording. It fits the official 3–5 minute duration requirement. Narration text was checked against the implemented and tested boundaries; no claim of certified generation, a public chain, AI inference or measured emissions savings was found. This review did not independently listen through every synthesized word.

README startup port matches the current server default (4187). MIT software licensing explicitly preserves the dataset's CC BY 4.0 license. Saved publisher metadata declares CC BY 4.0. The selected source CSV and derived CSV independently match their recorded SHA-256 hashes. Source attribution, transformation, approximate hour boundaries, capacity assumption and interpolation caveats are supplied.

Minor documentation correction requested: DEMO_SCRIPT.md still says video acceptance is pending and should record the completed duration, decoding and edited-walkthrough review. This stale status is not an engineering defect or evidence of failed video content.

**Decision:** agree that the local prototype, evidence and video constitute a submission-ready content candidate within disclosed limits. Public repository/video access, final attachment contents and Devpost submission state must be verified separately. No claim of actual submission is authorized by this agreement alone.
