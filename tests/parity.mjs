// Differential audit: existing baseline bugs must not be disguised as fixes.
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { build } from 'esbuild';
const run=promisify(execFile),root=process.cwd();
const runtime=path.join(root,'tests/.runtime');
fs.mkdirSync(runtime,{recursive:true});
await build({entryPoints:['tests/audit-entry.jsx'],outfile:path.join(runtime,'source.js'),bundle:true,format:'iife',jsx:'automatic',minify:false,define:{'process.env.NODE_ENV':'"production"'},target:'es2022',charset:'utf8'});
const cases=['domain','ui','edge','supplement'];
const variants={baseline:path.join(root,'baseline/v1/assets/index-B7Irxm4D.js'),source:path.join(runtime,'source.js')};
const jobs=[];
for(const [variant,bundle] of Object.entries(variants)) for(const name of cases){
  const dir=path.join(runtime,variant,name);fs.mkdirSync(dir,{recursive:true});
  for(const file of ['harness.cjs',name+'-tests.cjs'])fs.copyFileSync(path.join(root,'tests/audit',file),path.join(dir,file));
  jobs.push((async()=>{
    const result=await run(process.execPath,[path.join(dir,name+'-tests.cjs')],{cwd:root,env:{...process.env,STOK_AUDIT_BUNDLE:bundle},maxBuffer:4*1024*1024});
    fs.writeFileSync(path.join(dir,'run.log'),result.stdout+result.stderr);
    return {variant,name,results:JSON.parse(fs.readFileSync(path.join(dir,name+'-results.json'),'utf8')).results};
  })());
}
const runs=await Promise.all(jobs),differences=[],checks=[];
for(const name of cases){
  const baseline=runs.find(r=>r.variant==='baseline'&&r.name===name).results;
  const source=runs.find(r=>r.variant==='source'&&r.name===name).results;
  if(baseline.length!==source.length)differences.push({group:name,issue:'Scenario count differs'});
  for(let i=0;i<baseline.length;i++){
    const b=baseline[i],s=source[i],equal=b.name===s?.name&&b.status===s?.status;
    const entry={group:name,id:b.id,name:b.name,baseline_status:b.status,source_status:s?.status,matched:equal};
    checks.push(entry);if(!equal)differences.push({...entry,baseline_evidence:b.evidence,source_evidence:s?.evidence});
  }
}
const report={timezone:process.env.TZ||Intl.DateTimeFormat().resolvedOptions().timeZone,method:'168 existing audit scenarios run independently against original bundle and source-built React; matching outcome is parity, not absence of bugs',total:checks.length,matched:checks.filter(x=>x.matched).length,baseline_pass:checks.filter(x=>x.baseline_status==='PASS').length,baseline_known_fail:checks.filter(x=>x.baseline_status==='FAIL').length,differences,checks};
fs.writeFileSync('docs/PARITY-RESULTS.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,matched:report.matched,baseline_pass:report.baseline_pass,baseline_known_fail:report.baseline_known_fail,differences},null,2));
if(differences.length)process.exitCode=1;
