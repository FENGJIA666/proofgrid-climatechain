# Local runtime acceptance

Date: 22 October 2026 (SGT). Captures were made by the manager in the actual application at port 4187. The product/documentation reviewer separately inspected the saved faulty-input, anchored and tampered-verification screens. This record does not establish external publication, physical meter validity or a production pilot.

| Scenario | Observed result | Saved evidence |
|---|---|---|
| Initial workspace | Input, review and anchoring steps displayed | `evidence/ui-01-overview.png` |
| Faulty synthetic batch | 3 blocking issues: capacity, duplicate hour, order; no accepted anchor | `evidence/ui-02-flagged.png` |
| OPSD reference | 24 nominal hours, 40.719 kWh total, 7.981 kWh peak; human-review warning | `evidence/ui-03-historical.png` |
| Explicit review and anchoring | Anchored result and actual local block #2; exported payload uses unverified-input label | `evidence/ui-04-anchored.png`, `evidence/opsd-proof.json` |
| Original evidence verification | All displayed integrity/registry/receipt checks pass in originating session | `evidence/ui-05-verified.png` |
| Modified reading | A one-kWh change causes failed content check; overall verification fails | `evidence/ui-06-tampered.png`, `evidence/tampered-proof.json` |
| Same hours, changed readings | 24 claimed meter-hour conflicts after 0.001-kWh changes; re-registration blocked | `evidence/ui-07-duplicate.png` |
| Registry/method | Existing entry and method/limitation displays inspected | `evidence/ui-08-registry.png`, `evidence/ui-09-method.png` |
| Mobile | Manager measured viewport 390 px and scrollWidth 390 px; no horizontal overflow | `evidence/ui-mobile.png` |

The offline verifier was also run against both JSON examples: original exit 0 / digestMatches true, modified exit 1 / digestMatches false. This only checks internal content integrity. Contract/API adversarial checks covered normalized meter identifiers, duplicate and overlapping slots, atomic transaction rollback, reviewer acknowledgement, and tampered content or receipt metadata.

`evidence/ARTIFACTS.json` records SHA-256 fingerprints of saved acceptance artifacts. The captures reflect the observed session; session-local receipts do not persist as independently accessible chain evidence after restart.

## Local video file

The revised value-led file `media/ProofGrid-demo.mp4` contains H.264 1920×1080 video with AAC audio, 262.214512 seconds (4:22.2), 6,333,382 bytes. It meets the required 180–300 second duration. Full decoding completed without errors. All eight chapters passed independent frame inspection. The final chapter displays the actual evidence registry with the adoption roadmap; its replacement frame and final file hash were independently rechecked. The prior version's QuickTime playback observation is not evidence for this replacement. Public playback and accepted Devpost video-link status are separate delivery checks.

## Isolated source reproduction

The manager exported Git revision `fa47ac7` with `git archive` into an independent temporary directory. `npm ci` installed 365 packages successfully, `npm run build` passed, and `PORT=4192 npm start` deployed the local contract. Both `/api/status` and the built HTML homepage returned HTTP 200. The temporary test process was then stopped. This verifies the documented dependency/install/build/start path for that revision without relying on the existing working directory's installed packages.
