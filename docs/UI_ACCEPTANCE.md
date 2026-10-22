# Local runtime acceptance

Date: 22 October 2026 (SGT). The refreshed interface was checked in the actual application on port 4187. All `ui-01` through `ui-09` captures and `ui-mobile` were replaced with the checked presentation. This record maps the observed local workflow to saved artifacts.

| Scenario | Observed result | Saved evidence |
|---|---|---|
| Initial workspace | Input, review and anchoring steps displayed | `evidence/ui-01-overview.png` |
| Faulty synthetic batch | 3 blocking issues: capacity, duplicate hour, order; no accepted anchor | `evidence/ui-02-flagged.png` |
| OPSD reference | 24 nominal hours, 40.719 kWh total, 7.981 kWh peak; correct historical source label and human-review warning | `evidence/ui-03-historical.png` |
| Explicit review and anchoring | Anchored result and fresh local block #2; v2 payload includes structured OPSD provenance | `evidence/ui-04-anchored.png`, `evidence/opsd-proof.json` |
| Original evidence verification | All displayed integrity/registry/receipt checks pass in originating session | `evidence/ui-05-verified.png` |
| Modified reading | Adding 1 kWh to the 10:00 reading causes failed content check; overall verification fails | `evidence/ui-06-tampered.png`, `evidence/tampered-proof.json` |
| Same hours, changed readings | Adding 0.001 kWh to each of 24 rows produces 24 claimed-slot conflicts plus 1 outlier warning; source becomes User-supplied and registration is blocked | `evidence/ui-07-duplicate.png` |
| Registry/method | Existing entry and method displays inspected | `evidence/ui-08-registry.png`, `evidence/ui-09-method.png` |
| Mobile | Final mobile check: viewport 390 px and content width 390 px; no horizontal overflow | `evidence/ui-mobile.png` |

Fresh anchor digest: `0xe36638217d197878f3fe0a1870730ae3ff320325c4049d9d504430f3e8caa373`. The original proof passed all four displayed verification checks.

The final run of all eleven automated tests and the production build passed, including structured provenance classification and payload binding.

The offline verifier was also run against both JSON examples: original exit 0 / digestMatches true, modified exit 1 / digestMatches false. This exercises the package content-integrity check. Contract/API adversarial checks covered normalized meter identifiers, duplicate and overlapping slots, atomic transaction rollback, reviewer acknowledgement, and tampered content or receipt metadata.

`evidence/ARTIFACTS.json` records SHA-256 fingerprints of saved acceptance artifacts. The captures and receipts identify the originating local session.

## Video verification

The file `media/ProofGrid-demo.mp4` contains H.264 1920×1080 video with AAC audio, 272.417914 seconds (4:32.4), 6,416,344 bytes. It meets the required 180–300 second duration. Full decoding passed. Representative frames at 112 seconds and 250 seconds passed visual inspection. SHA-256: `487ad1c9bdfe521edbcca71bb7a9dfcb2fa0929970de1d552327fb3989c9215c`. The video follows the 553-word, eight-chapter narration recorded in `docs/DEMO_SCRIPT.md`.
