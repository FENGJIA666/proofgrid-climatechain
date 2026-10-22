import test from 'node:test';
import assert from 'node:assert/strict';
import {createChain} from '../server/chain.js';
import {sha256,slotId} from '../server/domain.js';
test('actual EVM accepts first claim, rejects duplicate and overlapping range, allows adjacent interval and rejects unauthorized issuer',async()=>{
 const c=await createChain();
 try {
 const a=slotId('METER-001','2026-10-21T00:00:00Z'),b=slotId('METER-001','2026-10-21T01:00:00Z'),d=slotId('METER-001','2026-10-21T02:00:00Z');
 const digest=sha256({batch:1});const tx=await c.contract.anchor(digest,[a,b],2000);const receipt=await tx.wait();assert.equal(receipt.status,1);assert(await c.contract.evidence(digest));
 await assert.rejects(c.contract.anchor(sha256({batch:2}),[b,d],2000));assert.equal(await c.contract.occupied(d),false,'overlap revert must remain atomic');
 await assert.rejects(c.contract.anchor(digest,[d],1000));
 const next=await c.contract.anchor(sha256({batch:3}),[d],1000);assert.equal((await next.wait()).status,1);
 const outsider=await c.other();await assert.rejects(outsider.anchor(sha256({batch:4}),[slotId('METER-002','2026-10-21T00:00:00Z')],1000));
 }finally{await c.rpc.disconnect();}
});
