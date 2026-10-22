import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,sample,payloadFor,sha256,slotId} from '../server/domain.js';
const clean=()=>analyze(sample(),'METER-001',5);
test('clean synthetic batch totals 31.62 kWh over 24 hours',()=>{const r=clean();assert.equal(r.rows.length,24);assert.equal(r.totalWh,31620);assert.equal(r.issues.length,0);});
test('flags capacity and duplicate readings',()=>{const r=analyze(sample('flagged'),'METER-001',5);assert(r.issues.some(i=>i.type==='capacity'));assert(r.issues.some(i=>i.type==='duplicate'));});
test('rejects negative, NaN, Infinity, invalid calendar dates, non-hour intervals',()=>{for(const row of ['2026-10-21T00:00:00Z,-1','2026-10-21T00:00:00Z,NaN','2026-10-21T00:00:00Z,Infinity','2026-02-30T00:00:00Z,1','2026-10-21T00:30:00Z,1'])assert(analyze('timestamp,kwh\n'+row,'METER-001',5).issues.some(i=>i.severity==='block'));});
test('rejects gaps and unsorted rows',()=>{const gap='timestamp,kwh\n2026-10-21T00:00:00Z,1\n2026-10-21T02:00:00Z,1';assert(analyze(gap,'METER-001',5).issues.some(i=>i.type==='gap'));const order='timestamp,kwh\n2026-10-21T01:00:00Z,1\n2026-10-21T00:00:00Z,1';assert(analyze(order,'METER-001',5).issues.some(i=>i.type==='order'));});
test('rejects unit confusion, malformed meters, invalid capacity',()=>{assert.throws(()=>analyze('timestamp,watts\n2026-10-21T00:00:00Z,1','METER-001',5));assert.throws(()=>analyze(sample(),' meter ',5));assert.throws(()=>analyze(sample(),'METER-001',Infinity));});
test('changing one reading changes evidence digest',()=>{const b={...clean(),meter:'METER-001',capacity:5,source:'synthetic demonstration'};const p=payloadFor(b),digest=sha256(p);p.readings[5].kwh=1;assert.notEqual(sha256(p),digest);});
test('same meter-hour has stable slot, other hours and meters are distinct',()=>{assert.equal(slotId('A','2026-10-21T00:00:00Z'),slotId('A','2026-10-21T00:00:00Z'));assert.notEqual(slotId('A','2026-10-21T00:00:00Z'),slotId('A','2026-10-21T01:00:00Z'));assert.notEqual(slotId('A','2026-10-21T00:00:00Z'),slotId('B','2026-10-21T00:00:00Z'));});

test('source classification is bound to CSV contents, not claimed labels',async()=>{
 const {classifySource}=await import('../server/domain.js');
 const historical='timestamp,kwh\n2016-06-01T00:00:00Z,0.1\n2016-06-01T01:00:00Z,0.2\n';
 assert.equal(classifySource(historical,historical).category,'historical-reference');
 assert.equal(classifySource(historical.replaceAll('\n','\r\n'),historical).category,'historical-reference');
 const changed=classifySource(historical.replace(',0.2',',0.3'),historical);
 assert.equal(changed.category,'user-supplied');
 assert.notEqual(changed.contentSha256,classifySource(historical,historical).contentSha256);
 assert.equal(classifySource(sample(),historical).category,'synthetic');
 assert.equal(classifySource(sample('flagged'),historical).fixture,'flagged');
});
test('source and structured scope fields are committed in v2 payload',()=>{
 const batch={...clean(),meter:'METER-001',capacity:5,source:{category:'synthetic',label:'Synthetic demonstration'}};
 const p=payloadFor(batch);assert.equal(p.schema,'proofgrid-evidence-v2');
 const digest=sha256(p);
 for(const mutate of [x=>x.source.category='historical-reference',x=>x.verificationScope.checks.push('extra'),x=>x.registryScope.boundary='other registry',x=>x.sessionLifecycle.runtime='other network']){const copy=structuredClone(p);mutate(copy);assert.notEqual(sha256(copy),digest);}
});
