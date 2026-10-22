import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createChain } from './chain.js';
import { analyze, sample, payloadFor, sha256, slotId, classifySource } from './domain.js';
const historicalCsv=await readFile(new URL('../data/opsd-solar-2016-06-01.csv',import.meta.url),'utf8');
const chain=await createChain(), batches=new Map(),anchors=[];
const production=process.env.NODE_ENV==='production';
const vite=production?null:await (await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'});
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
async function body(req){let s='';for await(const chunk of req){s+=chunk;if(s.length>200000)throw new Error('File too large. Limit 200 KB.');}return JSON.parse(s);}
const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/status')return json(res,200,{chainId:1337,address:chain.address,network:'Local EVM · session only',anchors,batches:[...batches.values()]});
 if(url.pathname==='/api/historical'){res.writeHead(200,{'Content-Type':'text/csv'});return res.end(historicalCsv);}
 if(url.pathname==='/api/sample'){res.writeHead(200,{'Content-Type':'text/csv'});return res.end(sample(url.searchParams.get('kind')));}
 if(url.pathname==='/api/analyze'&&req.method==='POST'){
   const b=await body(req); b.meter=String(b.meter||'').trim(); const result=analyze(b.csv,b.meter,Number(b.capacity));
   for(const r of result.rows)if(await chain.contract.occupied(slotId(b.meter,r.timestamp)))result.issues.push({row:null,type:'claimed',severity:'block',message:`${r.timestamp} is already anchored for this meter in this registry.`});
   const batch={id:randomUUID(),meter:b.meter,capacity:Number(b.capacity),source:classifySource(b.csv,historicalCsv),...result,createdAt:new Date().toISOString(),status:result.issues.some(i=>i.severity==='block')?'blocked':'ready'};
   batches.set(batch.id,batch);return json(res,200,batch);
 }
 if(url.pathname==='/api/anchor'&&req.method==='POST'){
   const b=await body(req),batch=batches.get(b.id);if(!batch)throw new Error('Batch not found. Re-import after restarting the server.');
   if(batch.status!=='ready')throw new Error('Only a reviewed, valid, unanchored batch can be anchored.');
   if(b.reviewed!==true)throw new Error('Review confirmation is required.');
   batch.status='anchoring';
   try {
     const payload=payloadFor(batch),digest=sha256(payload),slots=batch.rows.map(r=>slotId(batch.meter,r.timestamp));
     const tx=await chain.contract.anchor(digest,slots,batch.totalWh);const receipt=await tx.wait();
     const proof={payload,anchor:{digest,transactionHash:tx.hash,blockNumber:receipt.blockNumber,contract:chain.address,chainId:1337,network:'local-ephemeral',issuer:await chain.signer.getAddress()}};
     batch.status='anchored';batch.proof=proof;anchors.unshift({id:batch.id,meter:batch.meter,totalWh:batch.totalWh,digest,transactionHash:tx.hash,blockNumber:receipt.blockNumber});return json(res,200,batch);
   }catch(e){batch.status='ready';throw new Error('Anchor rejected: the evidence or a meter-hour may already be registered. Re-run analysis.');}
 }
 if(url.pathname==='/api/verify'&&req.method==='POST'){
   const proof=await body(req); if(!proof.payload||!proof.anchor)throw new Error('Expected a ProofGrid evidence JSON with payload and anchor.');
   const calculated=sha256(proof.payload),digestMatches=calculated===proof.anchor.digest;
   const sameRegistry=proof.anchor.contract===chain.address&&proof.anchor.chainId===1337;
   let onChain=false,receiptValid=false;
   if(sameRegistry&&/^0x[a-f0-9]{64}$/i.test(proof.anchor.digest))onChain=await chain.contract.evidence(proof.anchor.digest);
   if(sameRegistry&&/^0x[a-f0-9]{64}$/i.test(proof.anchor.transactionHash||'')){
     const receipt=await chain.provider.getTransactionReceipt(proof.anchor.transactionHash);
     receiptValid=Boolean(proof.anchor.network==='local-ephemeral'&&receipt?.status===1&&receipt.blockNumber===proof.anchor.blockNumber&&receipt.from?.toLowerCase()===String(proof.anchor.issuer).toLowerCase()&&receipt.to?.toLowerCase()===chain.address.toLowerCase()&&receipt.logs.some(log=>{try {const event=chain.contract.interface.parseLog(log);return event?.name==='Anchored'&&event.args.digest===proof.anchor.digest&&Number(event.args.wattHours)===proof.payload.totalWh&&Number(event.args.intervals)===proof.payload.readings?.length;}catch{return false;}}));
   }
   return json(res,200,{valid:digestMatches&&sameRegistry&&onChain&&receiptValid,digestMatches,sameRegistry,onChain,receiptValid,calculated,verificationScope:'Payload integrity and registration in the current session'});
 }
 if(url.pathname.startsWith('/api/'))return json(res,404,{error:'Endpoint not found'});
 if(vite)return vite.middlewares(req,res,()=>{res.writeHead(404);res.end();});
 const relative=url.pathname==='/'?'index.html':url.pathname.slice(1);const path=resolve('dist',relative);if(!path.startsWith(resolve('dist')+'/'))throw new Error('Invalid path');
 const content=await readFile(path);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream'});res.end(content);
 }catch(e){json(res,400,{error:e.message||'Request failed'});}
});
server.listen(Number(process.env.PORT||4187),'127.0.0.1',()=>console.log('ProofGrid ready at http://127.0.0.1:'+Number(process.env.PORT||4187)));
