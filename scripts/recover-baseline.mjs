// Reproducible migration of the audited runtime into editable ES modules and JSX.
// legacy/ preserves the user's original TSX; this script recovers later changes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import { transform } from 'esbuild';
const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;
const root = process.cwd();
const code = fs.readFileSync('baseline/v1/assets/index-B7Irxm4D.js', 'utf8');
if (crypto.createHash('sha256').update(code).digest('hex') !== '9ec9f620be25f7fcbaaf80bedf37589c8e7dff36ed45edd036f1cff62ef28d07') throw Error('Unexpected baseline');
const original = parse(code).program.body;
const groups = [
  [3,104,'src/lib/store.js'], [106,106,'src/pages/AuthPage.jsx'],
  [107,107,'src/components/PhysicalStockConfirmModal.jsx'],
  [108,110,'src/components/StockAdjustmentModal.jsx'],
  [111,116,'src/pages/HomePage.jsx'], [117,117,'src/components/ItemPicker.jsx'],
  [118,118,'src/components/ExpiryFields.jsx'], [119,126,'src/lib/drafts.jsx'],
  [127,130,'src/components/BatchLedger.jsx'], [131,134,'src/components/ProductModal.jsx'],
  [135,143,'src/components/InventoryProducts.jsx'], [144,146,'src/pages/CategoryDetailPage.jsx'],
  [147,151,'src/pages/InventoryPage.jsx'], [152,154,'src/components/ReceivePurchaseModal.jsx'],
  [155,157,'src/components/ShoppingActivityModal.jsx'], [158,169,'src/pages/ShoppingPage.jsx'],
  [170,173,'src/pages/MasterDataPage.jsx'], [174,185,'src/pages/AccountPage.jsx'],
  [186,201,'src/pages/ActivityPage.jsx'], [202,210,'src/pages/RecipesPage.jsx'],
  [211,212,'src/components/BottomNav.jsx'], [213,215,'src/App.jsx'],
];
const mapping = {
  y:'CATEGORIES', b:'UNITS', x:'EXPIRY_LABELS', S:'getExpiryStatus', C:'formatDate',
  w:'describeExpiry', T:'normalizeName', D:'getUnitFamily', O:'getUnitFactor',
  k:'roundQuantity', A:'convertBaseUnit', N:'getAllowedUnits', P:'convertItemUnit',
  F:'todayDate', I:'getRecipeAvailability', ee:'seedProducts', R:'USERS_KEY', z:'SESSION_KEY',
  B:'getDB', V:'saveDB', H:'register', U:'getProfile', W:'updateProfile', te:'updatePassword',
  ne:'login', re:'logout', ie:'getSession', ae:'getUserData', oe:'saveUserData',
  se:'readLegacyLog', ce:'normalizeData', de:'saveItemMaster', fe:'setItemMasterActive',
  ye:'addMasterListValue', be:'renameMasterListValue', xe:'removeMasterListValue',
  Se:'transact', G:'fail', K:'roundStockQuantity', Ce:'isValidPositiveQuantity',
  we:'isValidCalendarDate', Te:'hasValidExpiry', De:'validateReceivedDate',
  Oe:'isActiveLedgerEvent', ke:'getStockCorrectionConflicts', Ae:'previewStockCorrectionConflicts',
  je:'validatePhysicalStockConfirmations', Me:'applyPhysicalStockConfirmations',
  Ne:'validateStockActivity', Pe:'writeBatchQuantity', Fe:'registerBatchMasterValues',
  Ie:'normalizeStockQuantity', Le:'addProduct', Re:'updateProduct', He:'readBatchLedger',
  Ue:'deleteIncorrectBatch', Ge:'adjustPhysicalStock', Je:'cancelStockAdjustment',
  et:'updateActivityEntry', tt:'deleteActivityEntry', nt:'addActivityEntry',
  it:'disposeSelectedBatches', at:'saveRecipe', ot:'deleteRecipe', st:'cookRecipe',
  ct:'calculateShoppingCoverage', lt:'previewRecipeShopping', ut:'planRecipeShopping',
  ft:'createShoppingActivity', pt:'renameShoppingActivity', mt:'deleteShoppingActivity',
  ht:'completeShoppingActivity', gt:'addShoppingItem', _t:'updateShoppingPlan',
  vt:'receiveShoppingPurchase', xt:'correctPurchaseQuantity', St:'cancelShoppingPurchase',
  Tt:'deleteShoppingItem',
  Dt:'AuthPage', Ot:'PhysicalStockConfirmModal', Nt:'StockAdjustmentModal',
  Lt:'HomePage', Rt:'StatCard', zt:'ExpiryProductCard', Bt:'HomeEmptyState',
  Vt:'ItemPicker', Ht:'ExpiryFields', Xt:'DraftRestoreNotice', en:'BatchLedger',
  nn:'ProductModal', rn:'ProductField', mn:'InventoryBatchCard', gn:'InventoryProducts',
  yn:'CategoryDetailPage', bn:'BatchMetadataModal', Tn:'InventoryPage',
  En:'InventoryCategoryCard', Dn:'InventoryStat', On:'DraftChoiceModal',
  jn:'ReceivePurchaseModal', Fn:'ShoppingActivityModal', Un:'ShoppingPage',
  Wn:'ShoppingItemCard', Gn:'PurchaseQuantityModal', Kn:'ShoppingTitleModal', Jn:'ShoppingItemModal',
  Zn:'MasterDataPage', $n:'ItemMasterPage', ar:'AccountPage', or:'AccountMenuItem',
  sr:'EditProfilePage', cr:'ChangePasswordPage', lr:'AccountPageShell', ur:'AccountField',
  dr:'AccountFeedback', fr:'AccountSubmitButton', pr:'ArchivedProductNotice',
  xr:'ActivityPage', Sr:'ActivityList', Cr:'ActivityCard', wr:'AdjustmentDetailPage',
  Tr:'ActivityDetailPage', Er:'DeleteActivityConfirmModal', Dr:'ActivityProductPicker',
  Or:'ActivityEntryForm', kr:'ActivityItemModal', Fr:'CookRecipePage', Vr:'RecipesPage',
  Hr:'RecipePageHeader', Wr:'BottomNav', Jr:'loadData', Yr:'App',
  Gr:'appFontStyle', Kr:'PAGE_TITLES', qr:'ADD_BUTTON',
};
const owners = new Map();
const nodes = [];
const constants = { ...original[2], declarations: original[2].declarations.filter(d=>['y','b','x'].includes(d.id.name)) };
nodes.push(constants); owners.set(constants,'src/lib/store.js');
for (const [start,end,file] of groups) for (let i=start;i<=end;i++) { nodes.push(original[i]); owners.set(original[i],file); }
const ast = parse('import * as _ from "react"; import * as q from "react/jsx-runtime";', {sourceType:'module'});
ast.program.body.push(...nodes);
let scope;
traverse(ast,{Program(p){scope=p.scope; for(const [old,name] of Object.entries(mapping)) if(scope.getBinding(old)) scope.rename(old,name); scope.rename('_','React'); scope.rename('q','jsxRuntime');}});
traverse(ast,{
  FunctionDeclaration(p){
    if(p.parentPath.isProgram()&&p.node.params[0]?.type==='ObjectPattern') {
      for(const prop of p.node.params[0].properties){
        const value=prop.value?.type==='AssignmentPattern'?prop.value.left:prop.value;
        if(value?.type==='Identifier'&&prop.key?.type==='Identifier'&&value.name!==prop.key.name&&!p.scope.hasOwnBinding(prop.key.name))p.scope.rename(value.name,prop.key.name);
      }
    }
    if(p.parentPath.isProgram()&&p.node.id?.name==='App'){
      const names={e:'username',t:'setUsername',n:'page',r:'setPage',i:'addTrigger',a:'setAddTrigger',o:'activityEntryId',s:'setActivityEntryId',c:'shoppingActivityId',l:'setShoppingActivityId',u:'masterItemIntent',d:'setMasterItemIntent',f:'openMasterItem',p:'inventoryStatusIntent',m:'setInventoryStatusIntent',h:'inventoryProductIntent',g:'setInventoryProductIntent',v:'navigateTo',b:'openActivityEntry',x:'openShoppingActivity',S:'openInventoryStatus',C:'openInventoryProduct',w:'data',T:'setData',E:'refresh',D:'handleAuth',O:'handleLogout',k:'addButton'};
      for(const [old,name] of Object.entries(names))if(p.scope.hasOwnBinding(old))p.scope.rename(old,name);
    }
    const params={getUserData:['username'],saveUserData:['username','data'],normalizeData:['username','data'],register:['username','password','email'],login:['username','password'],updatePassword:['username','current','next'],getProfile:['username'],updateProfile:['username','displayName'],transact:['username','change'],seedProducts:['username'],addProduct:['username','product'],updateProduct:['username','updated'],getExpiryStatus:['expiryDate'],formatDate:['dateString'],getRecipeAvailability:['recipe','products','servings','masters','checkedUnknownIds']};
    const names=params[p.node.id?.name];
    if(p.parentPath.isProgram()&&names)for(let i=0;i<names.length;i++){const n=p.node.params[i],id=n?.type==='AssignmentPattern'?n.left:n;if(id?.type==='Identifier'&&!p.scope.hasOwnBinding(names[i]))p.scope.rename(id.name,names[i]);}
  },
  UnaryExpression(p){if(p.node.operator==='!'&&p.node.argument.type==='NumericLiteral'&&[0,1].includes(p.node.argument.value))p.replaceWith({type:'BooleanLiteral',value:p.node.argument.value===0});}
});
// Decode JSX-runtime calls without changing props, children, handlers or keys.
const jsxName = n => n.type==='Identifier' ? {type:'JSXIdentifier',name:n.name}
  : n.type==='StringLiteral' ? {type:'JSXIdentifier',name:n.value}
  : n.type==='TemplateLiteral' && !n.expressions.length ? {type:'JSXIdentifier',name:n.quasis[0].value.cooked}
  : n.type==='MemberExpression' && !n.computed ? {type:'JSXMemberExpression',object:jsxName(n.object),property:jsxName(n.property)} : null;
traverse(ast,{CallExpression:{exit(p){
  let c=p.node.callee; if(c.type==='SequenceExpression') c=c.expressions.at(-1);
  if(c.type!=='MemberExpression'||c.object.name!=='jsxRuntime'||!['jsx','jsxs'].includes(c.property.name)) return;
  const [type,props,key]=p.node.arguments,name=jsxName(type);
  if(!name||props?.type!=='ObjectExpression') throw Error('Unsupported JSX node');
  const attrs=[]; let children=[];
  for(const prop of props.properties){
    if(prop.type==='SpreadElement'){attrs.push({type:'JSXSpreadAttribute',argument:prop.argument});continue;}
    const label=prop.key.name??prop.key.value;
    if(label==='children'){children=[{type:'JSXExpressionContainer',expression:prop.value}];continue;}
    attrs.push({type:'JSXAttribute',name:{type:'JSXIdentifier',name:label},value:{type:'JSXExpressionContainer',expression:prop.value}});
  }
  if(key) attrs.push({type:'JSXAttribute',name:{type:'JSXIdentifier',name:'key'},value:{type:'JSXExpressionContainer',expression:key}});
  p.replaceWith({type:'JSXElement',openingElement:{type:'JSXOpeningElement',name,attributes:attrs,selfClosing:!children.length},closingElement:children.length?{type:'JSXClosingElement',name}:null,children});
}}});
traverse(ast,{Program(p){p.scope.crawl();scope=p.scope;}});
const bindings = Object.entries(scope.bindings).filter(([name])=>!['React','jsxRuntime'].includes(name));
const topNode = p => {while(p.parentPath&&!p.parentPath.isProgram())p=p.parentPath;return p.node;};
const bindingFiles = new Map(bindings.map(([name,b])=>[name,owners.get(topNode(b.path))]));
for(const file of new Set(owners.values())){
  const body=nodes.filter(n=>owners.get(n)===file);
  const imports=new Map();
  for(const [name,b] of Object.entries(scope.bindings)) for(const ref of b.referencePaths){
    if(owners.get(topNode(ref))!==file)continue;
    const from=name==='React'?'react':name==='jsxRuntime'?'react/jsx-runtime':bindingFiles.get(name);
    if(!from||from===file)continue;
    if(!imports.has(from))imports.set(from,new Set());imports.get(from).add(name);
  }
  let header='// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.\n';
  for(const [from,names] of imports){
    if(from==='react'||from==='react/jsx-runtime') header+=`import * as ${[...names][0]} from ${JSON.stringify(from)};\n`;
    else {let rel=path.relative(path.dirname(file),from).replaceAll('\\','/');if(!rel.startsWith('.'))rel='./'+rel;header+=`import { ${[...names].sort().join(', ')} } from ${JSON.stringify(rel)};\n`;}
  }
  const exports=bindings.filter(([name])=>bindingFiles.get(name)===file).map(([name])=>name);
  const output=header+generate({type:'Program',body,sourceType:'module'},{comments:false}).code+'\nexport { '+exports.join(', ')+' };\n';
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,output);
}
// Baseline names are available exclusively to the test entry point.
let api='';
for(const file of new Set(bindingFiles.values())){
  const names=bindings.filter(([n])=>bindingFiles.get(n)===file).map(([n])=>n);
  api+=`import { ${names.join(', ')} } from ${JSON.stringify('../'+file)};\n`;
}
api+='window.__auditAPI = {\n'+bindings.map(([name])=>`${JSON.stringify(Object.entries(mapping).find(([,n])=>n===name)?.[0]??name)}: ${name}`).join(',\n')+'\n};\nimport "../src/main.jsx";\n';
fs.writeFileSync('tests/audit-entry.jsx',api);
fs.writeFileSync('docs/SOURCE-SYMBOLS.json',JSON.stringify(Object.fromEntries(bindings.map(([name])=>[Object.entries(mapping).find(([,n])=>n===name)?.[0]??name,{name,file:bindingFiles.get(name)}])),null,2)+'\n');
const css=fs.readFileSync('baseline/v1/assets/index-f4AJOdmn.css','utf8');
fs.writeFileSync('src/styles/index.css',(await transform(css,{loader:'css',minify:false})).code);
console.log(JSON.stringify({modules:new Set(owners.values()).size,namedSymbols:Object.keys(mapping).length,reactRuntime:'npm packages, not copied vendor bundle'}));
