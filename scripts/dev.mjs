import fs from 'node:fs';
import { context } from 'esbuild';
fs.mkdirSync('dist/assets',{recursive:true});
fs.cpSync('public','dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
const ctx=await context({entryPoints:['src/main.jsx'],outfile:'dist/assets/app.js',bundle:true,format:'iife',jsx:'automatic',sourcemap:true,define:{'process.env.NODE_ENV':'"development"'},target:'es2022',charset:'utf8'});
await ctx.watch();
const server=await ctx.serve({host:'127.0.0.1',port:5173,servedir:'dist'});
console.log(`Stok Dapur: http://localhost:${server.port} — refresh after editing source`);
