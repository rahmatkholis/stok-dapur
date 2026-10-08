import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
fs.rmSync('dist',{recursive:true,force:true});
fs.mkdirSync('dist/assets',{recursive:true});
fs.cpSync('public','dist',{recursive:true});
const result=await build({entryPoints:['src/main.jsx'],outfile:'dist/assets/app.js',bundle:true,format:'iife',jsx:'automatic',minify:true,sourcemap:true,metafile:true,define:{'process.env.NODE_ENV':'"production"'},target:'es2022',charset:'utf8'});
fs.writeFileSync('docs/BUILD-INPUTS.json',JSON.stringify({source_inputs:Object.keys(result.metafile.inputs).filter(x=>!x.startsWith('node_modules/')),uses_archived_runtime:Object.keys(result.metafile.inputs).some(x=>x.startsWith('baseline/')||x.startsWith('legacy/'))},null,2)+'\n');
// Each deployment references its matching assets rather than an older browser cache.
let html = fs.readFileSync('index.html', 'utf8');
for (const asset of ['app.js', 'app.css']) {
  const version = createHash('sha256').update(fs.readFileSync(`dist/assets/${asset}`)).digest('hex').slice(0, 16);
  html = html.replaceAll(`/assets/${asset}`, `/assets/${asset}?v=${version}`);
}
fs.writeFileSync('dist/index.html', html);
console.log('Built current application from src/ into dist/');
