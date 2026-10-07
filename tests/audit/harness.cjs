let jsdom;try{jsdom=require('jsdom')}catch{jsdom=require('../qa-runtime/node_modules/jsdom')}const {JSDOM,VirtualConsole}=jsdom;
const fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync(process.env.STOK_AUDIT_BUNDLE||require('node:path').resolve(__dirname,'../../baseline/v1/assets/index-B7Irxm4D.js'),'utf8');
const wait=(ms=35)=>new Promise(r=>setTimeout(r,ms));
const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
const base=()=>({demoSeeded:true,products:[],shoppingItems:[],shoppingActivities:[],activityLog:[],productArchive:{},recipes:[],categories:['Pokok','Segar'],locations:['Kulkas','Rak'],itemMasters:[{id:'egg',name:'Telur',category:'Segar',unit:'buah',active:true},{id:'rice',name:'Beras',category:'Pokok',unit:'gram',active:true},{id:'milk',name:'Susu',category:'Segar',unit:'ml',active:true,packageUnit:'botol',packageSize:250,packageSizeUnit:'ml'}]});
const product=(id='p1',itemId='egg',quantity=10,extra={})=>({id,itemId,name:itemId==='egg'?'Telur':itemId==='rice'?'Beras':'Susu',category:itemId==='rice'?'Pokok':'Segar',quantity,unit:itemId==='egg'?'buah':itemId==='rice'?'gram':'ml',expiryDate:'2026-10-14',expiryKind:'package',receivedDate:'2026-10-01',createdAt:'2026-10-01T00:00:00.000Z',stockSource:'manual',initialQuantity:quantity,...extra});
const recipe=(id='r1',itemId='egg',quantity=2,extra={})=>({id,name:'Menu '+id,servings:1,ingredients:[{id:'ing_'+id,itemId,name:itemId==='egg'?'Telur':itemId==='rice'?'Beras':'Susu',category:itemId==='rice'?'Pokok':'Segar',unit:itemId==='egg'?'buah':itemId==='rice'?'gram':'ml',quantity}],createdAt:'2026-10-01T00:00:00Z',updatedAt:'2026-10-01T00:00:00Z',...extra});
const activity=(id='a1',quantity=2,extra={})=>({id,action:'used',date:'2026-10-07',title:'Sarapan',createdAt:'2026-10-07T05:00:00.000Z',items:[{productId:'p1',productName:'Telur',category:'Segar',quantity,unit:'buah'}],...extra});
function harness(opts={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
 const dom=new JSDOM('<!doctype html><html lang="id"><body><div id="root"></div></body></html>',{url:'https://ux-audit.invalid/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc,storageQuota:opts.storageQuota||5000000});
 const w=dom.window,d=w.document;w.scrollTo=()=>{};w.confirm=()=>true;
 const NativeDate=w.Date,now=opts.now||'2026-10-07T05:00:00Z';w.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[now]))}static now(){return +new NativeDate(now)}};
 if(!opts.loggedOut){w.localStorage.setItem('dapur_users',JSON.stringify({qa:{password:'audit-only',profile:{displayName:'QA'},data:opts.data||base()}}));w.localStorage.setItem('dapur_session','qa');}
 if(opts.usersRaw!==undefined)w.localStorage.setItem('dapur_users',opts.usersRaw);
 if(opts.before)opts.before(w);
 w.eval(code);
 const all=s=>[...d.querySelectorAll(s)];
 const btn=(name)=>{const b=all('button').find(e=>text(e).replace(/\s/g,'')===name.replace(/\s/g,'')||e.getAttribute('aria-label')===name);assert(b,'No button '+name+'; available '+all('button').map(text).join('|'));return b;};
 const click=async name=>{btn(name).click();await wait()};
 const set=async(el,value)=>{assert(el,'Missing input '+value);const p=el.tagName==='SELECT'?w.HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,String(value));el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));await wait();};
 const field=name=>d.querySelector('[aria-label="'+name+'"]')||(()=>{const l=all('label').find(e=>text(e)===name||text(e).startsWith(name));return l&&(l.control||l.querySelector('input,select,textarea')||l.parentElement.querySelector('input,select,textarea'))})();
 const call=(fn,...args)=>{const clone=v=>Array.isArray(v)?v.map(clone):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clone(x)])):v;w.__auditArgs=args.map(clone);try{return w.__auditAPI ? w.__auditAPI[fn](...w.__auditArgs) : w.eval(fn+'(...__auditArgs)')}finally{delete w.__auditArgs}};
 const data=()=>JSON.parse(w.localStorage.getItem('dapur_users')).qa.data;
 const raw=()=>w.localStorage.getItem('dapur_users');
 const replace=x=>{const a=JSON.parse(raw());a.qa.data=x;w.localStorage.setItem('dapur_users',JSON.stringify(a));};
 const dump=()=>({text:text(d.getElementById('root')),buttons:all('button').map(e=>({text:text(e),aria:e.getAttribute('aria-label'),disabled:e.disabled})),fields:all('input,select,textarea').map(e=>({type:e.type,placeholder:e.placeholder,aria:e.getAttribute('aria-label'),value:e.value,labels:[...(e.labels||[])].map(text)}))});
 return {dom,w,d,errors,all,btn,click,set,field,call,data,raw,replace,dump,close:()=>w.close()};
}
module.exports={harness,base,product,recipe,activity,wait,text,assert,fs};
