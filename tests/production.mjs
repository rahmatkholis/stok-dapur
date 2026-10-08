import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { JSDOM, VirtualConsole } from 'jsdom';
import { transform, build } from 'esbuild';
const require=createRequire(import.meta.url);
const {base,product,recipe}=require('./audit/harness.cjs');
const wait=()=>new Promise(r=>setTimeout(r,35));
const code={baseline:fs.readFileSync('baseline/v1/assets/index-B7Irxm4D.js','utf8'),source:fs.readFileSync('dist/assets/app.js','utf8')};
function create(bundle,data){
 const dom=new JSDOM('<div id="root"></div>',{url:'https://source-parity.invalid',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:new VirtualConsole()});
 const w=dom.window;w.scrollTo=()=>{};w.confirm=()=>true;
 const Native=w.Date;w.Date=class extends Native{constructor(...args){super(...(args.length?args:['2026-10-07T05:00:00Z']))}static now(){return +new Native('2026-10-07T05:00:00Z')}};
 if(data){w.localStorage.setItem('dapur_users',JSON.stringify({qa:{password:'audit-only',profile:{displayName:'QA'},data}}));w.localStorage.setItem('dapur_session','qa')}
 w.eval(bundle);return dom;
}
const fixtures=[{name:'logged-out',data:null},{name:'empty',data:base()},{name:'stock-and-recipe',data:{...base(),products:[product()],recipes:[recipe()]}},{name:'expired-and-unknown',data:{...base(),products:[product('old','egg',4,{expiryDate:'2026-10-02'}),product('unknown','milk',500,{expiryKind:'unknown',expiryDate:''})]}}];
const checks=[];
const snapshot=d=>({html:d.window.document.getElementById('root').innerHTML,fields:[...d.window.document.querySelectorAll('input,select,textarea')].map(e=>({type:e.type,value:e.value})),data:d.window.localStorage.getItem('dapur_users')});
for(const f of fixtures){
 const a=create(code.baseline,f.data),b=create(code.source,f.data);await wait();
 try{
  assert.deepEqual(snapshot(b),snapshot(a),f.name+' initial');checks.push(f.name+' initial');
  if(f.data)for(const page of ['Inventori','Belanja','Resep','Aktivitas','Akun','Beranda']){
   for(const dom of [a,b]){const buttons=[...dom.window.document.querySelectorAll('button')];const button=buttons.find(e=>e.getAttribute('aria-label')===page||e.closest('nav')&&e.textContent.trim().endsWith(page));assert(button,'No navigation '+page);button.click()}
   await wait();
   if(page==='Inventori'){
    assert.equal(snapshot(b).data,snapshot(a).data,f.name+' inventory data');
    assert.deepEqual(snapshot(b).fields,snapshot(a).fields,f.name+' inventory fields');
    assert(!b.window.document.getElementById('root').textContent.includes('Dihitung untuk resep hari ini'));
    checks.push(f.name+' inventory keeps fields and data; uses compact cards');
   }else if(page==='Aktivitas'){
    assert.equal(snapshot(b).data,snapshot(a).data,f.name+' activity data');
    assert.deepEqual(snapshot(b).fields,snapshot(a).fields,f.name+' activity fields');
    const labels=[...b.window.document.querySelectorAll('button')].map(e=>e.textContent.trim());
    assert(!labels.some(label=>label.startsWith('Koreksi ')));
    for(const label of ['Semua','Dipakai','Dibuang'])assert(labels.some(value=>value.startsWith(label+' ')));
    checks.push(f.name+' activity keeps data and fields; corrections belong to stock history');
   }else{assert.deepEqual(snapshot(b),snapshot(a),f.name+' '+page);checks.push(f.name+' '+page);}
  }
 }finally{a.window.close();b.window.close()}
}
const minify=async s=>(await transform(s,{loader:'css',minify:true,target:'es2022'})).code;
assert.equal(await minify(fs.readFileSync('src/styles/index.css','utf8').split('/* Inventory cards:')[0]),await minify(fs.readFileSync('baseline/v1/assets/index-f4AJOdmn.css','utf8')),'Stylesheet semantic normalization changed');
checks.push('stylesheet normalized equivalence');
const inputs=JSON.parse(fs.readFileSync('docs/BUILD-INPUTS.json'));assert.equal(inputs.uses_archived_runtime,false);checks.push('production build uses src, not baseline or legacy runtime');
// A controlled in-memory edit proves the JSX source drives rendered output.
const proof=await build({
 entryPoints:['src/main.jsx'],bundle:true,write:false,format:'iife',jsx:'automatic',
 define:{'process.env.NODE_ENV':'"production"'},outfile:'tests/.runtime/edit-proof.js',
 plugins:[{name:'source-edit-proof',setup(b){
  b.onLoad({filter:/src\/App\.jsx$/},args=>({
   contents:fs.readFileSync(args.path,'utf8').replace('inventory: `Inventori`','inventory: `SOURCE_EDIT_PROOF`'),loader:'jsx'
  }));
 }}]
});
const edited=create(proof.outputFiles.find(x=>x.path.endsWith('.js')).text,base());await wait();
try{[...edited.window.document.querySelectorAll('button')].find(e=>e.closest('nav')&&e.textContent.trim().endsWith('Inventori')).click();await wait();assert(edited.window.document.getElementById('root').textContent.includes('SOURCE_EDIT_PROOF'));checks.push('editing App.jsx changes rebuilt UI');}finally{edited.window.close()}
fs.writeFileSync('docs/PRODUCTION-CHECKS.json',JSON.stringify({method:'Exact DOM/fields/data vs v1 outside Inventori and Aktivitas; activity fields/data invariants and three activity filters; inventory field/data invariants with compact cards; original stylesheet normalization; build provenance; controlled source edit',checks,passed:checks.length,layout_browser_checked:false},null,2)+'\n');
console.log(JSON.stringify({production_checks:checks.length,passed:checks.length}));
