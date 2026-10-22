#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { sha256 } from '../server/domain.js';
try {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: node scripts/verify-offline.mjs path/to/evidence.json');
  const proof = JSON.parse(await readFile(file, 'utf8'));
  if (!proof.payload || !proof.anchor?.digest) throw new Error('Not a ProofGrid evidence package.');
  const calculated = sha256(proof.payload);
  const digestMatches = calculated === proof.anchor.digest;
  console.log(JSON.stringify({digestMatches,calculated,scope:'Offline payload digest comparison. Registration is verified against the originating session registry and receipt.'},null,2));
  process.exitCode = digestMatches ? 0 : 1;
} catch (error) { console.error(error.message); process.exitCode = 2; }
