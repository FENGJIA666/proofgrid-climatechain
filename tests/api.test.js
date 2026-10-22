import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { sample } from '../server/domain.js';
test('API canonical meter protection and proof tampering regression',async()=>{
 const proc=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:'4199'},stdio:'pipe'});
 let logs='';proc.stderr.on('data',d=>logs+=d);proc.stdout.on('data',d=>logs+=d);
 const api=async(path,b)=>{const r=await fetch('http://127.0.0.1:4199/api/'+path,b?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}:{});const d=await r.json();if(!r.ok)throw Error(d.error);return d;};
 try{
 let up=false;for(let i=0;i<100;i++){try{await api('status');up=true;break;}catch{await new Promise(r=>setTimeout(r,100));}}assert(up,logs);
 const b=await api('analyze',{csv:sample(),meter:'  METER-001 ',capacity:5,source:'synthetic'});assert.equal(b.meter,'METER-001');
 const done=await api('anchor',{id:b.id,reviewed:true});assert.equal(done.status,'anchored');assert.equal((await api('verify',done.proof)).valid,true);
 const dup=await api('analyze',{csv:sample(),meter:'METER-001',capacity:5});assert.equal(dup.status,'blocked');assert(dup.issues.some(i=>i.type==='claimed'));
 for(const mutate of [p=>p.payload.readings[3].kwh=1,p=>p.anchor.blockNumber++,p=>p.anchor.issuer='0x0000000000000000000000000000000000000000',p=>p.anchor.network='mainnet']){const copy=structuredClone(done.proof);mutate(copy);assert.equal((await api('verify',copy)).valid,false);}
 }finally{proc.kill('SIGTERM');}
});
