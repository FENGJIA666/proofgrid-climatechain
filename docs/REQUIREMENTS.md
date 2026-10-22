# IEEE ClimateChain submission requirements

Checked: 22 October 2026, Asia/Singapore. This document distinguishes official requirements, observed history, and items still needing direct verification.

## Sources and timing

- [Official overview](https://ieee-climatechain-hack.devpost.com/)
- [Official rules](https://ieee-climatechain-hack.devpost.com/rules)
- [Official schedule](https://ieee-climatechain-hack.devpost.com/details/dates)
- [Official updates](https://ieee-climatechain-hack.devpost.com/updates)
- [Submission-form discussion](https://ieee-climatechain-hack.devpost.com/forum_topics/45102-session-1-recording-and-clarification-on-submission-window)

Submission closes **25 October 2026, 22:00 SGT (14:00 UTC)**. The published submission window starts 5 October, 12:00 SGT. Judging runs 26 October, 14:00 SGT to 8 November, 22:00 SGT; winners are scheduled for 20 November, 14:00 SGT.

The “每日邮件处理” chat reports a successful registration on 22 October and readback in the user's hackathon list. This is historical registration evidence, not evidence of a submitted project. The manager subsequently observed “You're registered” and created a ProofGrid draft (2/5 sections). Final submission remains unverified.

## Scope and required materials

The event is online and allows individuals. Student eligibility is common to the overview and rules. Teams may contain 2–5 people; a person may join only one team. Age, country, organizer/judge-family exclusions still apply.

Selected track: **Renewable Energy & Energy Trading**. ProofGrid proposes evidence review and traceability for small solar-meter intervals; it does not trade energy or issue recognized renewable-energy certificates.

Required package:

1. A project description explaining the selected track, problem, solution, users, scaling and adoption.
2. A **3–5 minute video** showing the project operating.
3. A **public repository** containing source and documentation.
4. A working prototype, mockup or proof of concept.
5. An actual Devpost submission before the close.

Judges assess climate relevance, originality, functioning technology, practical adoption/scaling, and clarity of the demonstration. No numerical weighting is published in the inspected pages.

## Known differences and open checks

- The overview limits entrants to students; the rules also list other categories. A student entrant is within both descriptions; do not imply all professionals are definitely eligible.
- Older discussion posts quote a contradictory start-time sentence. That sentence is absent from the currently inspected rules; the current schedule and opening update agree on the October 5–25 window.
- The manager directly inspected the authenticated form: a file attachment up to 35 MB is required; Story, Built with, and Video demo link are required. Try it out links and gallery fields exist. No dedicated track selector was shown. State the track in the story and prepare a source/documentation/evidence ZIP.
- Public wording encourages blockchain and AI/data approaches but does not clearly establish a mandatory AI model. Do not label deterministic rules as AI. If an ML component is added, document its training data and demonstrated limitations.
- No publication, hosting, video upload, or final Devpost submission has yet been observed by this workstream.

## Acceptance matrix

| Area | Required evidence before claiming complete | Current status |
|---|---|---|
| Track fit | Description ties interval traceability to renewable-energy accounting | Documented |
| Input quality | Invalid units, times, readings and malformed files are handled visibly | Source/tests checked; UI faulty sample shows 3 blocking issues |
| Duplicate accounting | Exact duplicate and overlapping meter intervals cannot both count | Fixed UTC-hour scope; UI changed values for same 24 slots rejected |
| Evidence integrity | Export can be independently rehashed; modified content is rejected | Original passes; changed reading fails in actual UI; offline script supplied |
| Chain execution | Actual local EVM deployment and transaction receipt, with network identified | Actual local block 2 receipt observed |
| Scope honesty | Synthetic fixtures and local-chain limitations visible in UI and docs | Observed in UI and documented |
| Climate claims | No claim of measured emissions reductions or certified renewable origin | Explicit limitations in materials |
| Demo | Representative workflow checked in runtime; 180–300 second playable video | UI accepted; local MP4 217.806893 s, H.264/AAC; full decode + 8 frames accepted; public link pending |
| Reproducibility | Clean documented install/run/test path and independent export verification | README supplied; 9 tests/build reported pass; clean checkout install pending |
| Submission | Public repository/video access checked; form readback proves submission | Not submitted |


## Local acceptance evidence, 22 October 2026

The manager observed: faulty synthetic sample with three blocking issues; OPSD sample total 40.719 kWh and peak 7.981 kWh with a peak-review warning; explicit reviewer confirmation followed by local EVM block-2 receipt; unchanged export verification passing; a one-kWh alteration failing; and re-import with 0.001-kWh modifications rejected for 24 occupied meter-hours. A 390-pixel viewport had scrollWidth 390. These results establish local behavior only, not physical measurement provenance or production acceptance.

Intended repository: `FENGJIA666/proofgrid-climatechain`, not yet created at this update. Local video file has been rendered; ffprobe reports 217.806893 seconds. Independent full decode and eight chapter-frame checks passed. Public access remains pending. See `docs/UI_ACCEPTANCE.md`.
