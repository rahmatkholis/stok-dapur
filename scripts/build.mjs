import fs from 'node:fs';
import { build } from 'esbuild';
fs.mkdirSync('dist/assets',{recursive:true});
fs.cpSync('public','dist',{recursive:true});
const result=await build({entryPoints:['src/main.jsx'],outfile:'dist/assets/app.js',bundle:true,format:'iife',jsx:'automatic',minify:true,sourcemap:true,metafile:true,define:{'process.env.NODE_ENV':'"production"'},target:'es2022',charset:'utf8'});
fs.writeFileSync('docs/BUILD-INPUTS.json',JSON.stringify({source_inputs:Object.keys(result.metafile.inputs).filter(x=>!x.startsWith('node_modules/')),uses_archived_runtime:Object.keys(result.metafile.inputs).some(x=>x.startsWith('baseline/')||x.startsWith('legacy/'))},null,2)+'\n');
fs.copyFileSync('index.html','dist/index.html');
console.log('Built current application from src/ into dist/');
