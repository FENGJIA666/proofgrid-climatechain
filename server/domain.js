import { createHash } from 'node:crypto';
export const sha256 = data => '0x' + createHash('sha256').update(JSON.stringify(data)).digest('hex');
export const slotId = (meter, hour) => sha256([meter, hour]);
export function analyze(csv, meter, capacity) {
  if (!/^[A-Z0-9-]{3,32}$/.test(meter)) throw new Error('Meter ID must be 3–32 uppercase letters, digits or hyphens.');
  if (!Number.isFinite(capacity) || capacity <= 0 || capacity > 1000000) throw new Error('Capacity must be between 0 and 1,000,000 kW.');
  const lines = csv.trim().split(/\r?\n/);
  if (lines.shift()?.trim() !== 'timestamp,kwh') throw new Error('CSV header must be timestamp,kwh. Use the downloadable template.');
  if (!lines.length || lines.length > 168) throw new Error('Upload between 1 and 168 hourly records.');
  const issues = [], rows = [], seen = new Set();
  for (const [index,line] of lines.entries()) {
    const fields = line.split(',');
    const timestamp = fields[0]?.trim(), raw = fields[1]?.trim();
    if (fields.length !== 2 || !/^\d{4}-\d{2}-\d{2}T\d{2}:00:00Z$/.test(timestamp) || Number.isNaN(Date.parse(timestamp)) || new Date(timestamp).toISOString().replace('.000','') !== timestamp) {
      issues.push({row:index+2,type:'format',severity:'block',message:'Use a valid UTC hour: YYYY-MM-DDTHH:00:00Z.'}); continue;
    }
    if (!/^\d+(\.\d{1,3})?$/.test(raw)) { issues.push({row:index+2,type:'value',severity:'block',message:'kWh must be a non-negative number with at most 3 decimals.'}); continue; }
    const kwh = Number(raw);
    if (!Number.isFinite(kwh) || kwh > capacity) issues.push({row:index+2,type:'capacity',severity:'block',message:`${kwh} kWh exceeds the ${capacity} kW one-hour capacity bound.`});
    if (seen.has(timestamp)) issues.push({row:index+2,type:'duplicate',severity:'block',message:'Duplicate meter-hour within this file.'});
    seen.add(timestamp); rows.push({timestamp,kwh});
  }
  for(let i=1;i<rows.length;i++) if(rows[i].timestamp<=rows[i-1].timestamp) issues.push({row:i+2,type:'order',severity:'block',message:'Readings must be strictly increasing in UTC time.'});
  rows.sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
  const unique = [...new Set(rows.map(r=>r.timestamp))];
  for(let i=1;i<unique.length;i++) if(Date.parse(unique[i])-Date.parse(unique[i-1])!==3600000) issues.push({row:null,type:'gap',severity:'block',message:`Missing hourly records between ${unique[i-1]} and ${unique[i]}.`});
  const totalWh = rows.reduce((sum,r)=>sum+Math.round(r.kwh*1000),0);
  if (!totalWh) issues.push({row:null,type:'empty',severity:'block',message:'A zero-energy batch cannot be anchored.'});
  const positives=rows.map(r=>r.kwh).filter(v=>v>0).sort((a,b)=>a-b);
  const median=positives.length?positives[Math.floor(positives.length/2)]:0;
  if(positives.length>=6 && positives.at(-1)>median*4) issues.push({row:null,type:'outlier',severity:'review',message:'Peak exceeds 4× the median positive reading. Inspect the source before approving.'});
  return {rows,issues,totalWh,peak:Math.max(0,...rows.map(r=>r.kwh)),start:rows[0]?.timestamp,end:rows.at(-1)?.timestamp};
}
export function payloadFor(batch) {
  return {schema:'proofgrid-evidence-v1',meter:batch.meter,capacityKw:batch.capacity,intervalMinutes:60,timezone:'UTC',source:batch.source,readings:batch.rows,totalWh:batch.totalWh,method:'hourly-capacity-and-continuity-v1'};
}
export function sample(kind='clean') {
  const values=[0,0,0,0,0,0,0.12,0.8,1.7,2.8,3.9,4.5,4.8,4.4,3.8,2.6,1.5,0.6,0.1,0,0,0,0,0];
  const lines=values.map((v,i)=>`2026-10-21T${String(i).padStart(2,'0')}:00:00Z,${kind==='flagged'&&i===12?8.9:v}`);
  if(kind==='flagged') lines.push(lines[10]);
  return 'timestamp,kwh\n'+lines.join('\n')+'\n';
}
