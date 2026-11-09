import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {repo,runtime,dependencySource,sources,fingerprint,sha,json} from './env.mjs';
export async function assertPortFree(port){await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(port,()=>s.close(resolve));});}
export async function prepare(runDir){
  for(const port of [3000,5173])await assertPortFree(port);
  const before=fingerprint();
  if(!fs.existsSync(runtime)){
    fs.mkdirSync(runtime,{recursive:true});
    for(const p of sources()){fs.mkdirSync(path.dirname(path.join(runtime,p)),{recursive:true});fs.copyFileSync(path.join(repo,p),path.join(runtime,p));}
    fs.copyFileSync(path.join(repo,'backend/database.sqlite'),path.join(runtime,'backend/database.sqlite'));
    for(const part of ['backend','frontend-web']){const from=path.join(dependencySource,part,'node_modules');if(!fs.existsSync(from))throw Error('Missing existing dependency source: '+from);fs.symlinkSync(from,path.join(runtime,part,'node_modules'),'junction');}
  }
  for(const [p,hash] of Object.entries(before.files))if(sha(path.join(runtime,p))!==hash)throw Error('runtime-source-mismatch: '+p);
  if(sha(path.join(runtime,'backend/database.sqlite'))!==before.repoDatabase)throw Error('runtime-fixture-hash-mismatch; refuse reset/seed');
  const req=createRequire(path.join(runtime,'backend/server.js'));
  const sqlite=req('sqlite3');
  const db=await new Promise((resolve,reject)=>{const d=new sqlite.Database(path.join(runtime,'backend/database.sqlite'),sqlite.OPEN_READONLY,e=>e?reject(e):resolve(d));});
  const query=q=>new Promise((resolve,reject)=>db.all(q,[],(e,r)=>e?reject(e):resolve(r)));
  let products,categories;
  try{products=await query('SELECT id,name,price,description,imageUrl,category_id FROM products ORDER BY id');categories=await query('SELECT id,name FROM categories ORDER BY id');}finally{await new Promise((resolve,reject)=>db.close(e=>e?reject(e):resolve()));}
  const expected=[[1,'iPhone 15 Pro Max',30000000,1],[2,'Samsung Galaxy S24 Ultra',28000000,1],[3,'MacBook Pro M3',45000000,2],[4,'Tai nghe AirPods Pro 2',6000000,3],[5,'Bàn phím cơ Keychron Q1',4000000,3]];
  if(JSON.stringify(products.map(p=>[p.id,p.name,p.price,p.category_id]))!==JSON.stringify(expected))throw Error('fixture-values-mismatch');
  if(products[0].description!=='Điện thoại cao cấp của Apple'||products.some(p=>!p.imageUrl))throw Error('fixture-description-or-image-mismatch');
  if(JSON.stringify(categories.map(c=>[c.id,c.name]))!==JSON.stringify([[1,'Điện thoại'],[2,'Laptop'],[3,'Phụ kiện']]))throw Error('fixture-categories-mismatch');
  const manifest={...before,runtimeDatabase:sha(path.join(runtime,'backend/database.sqlite')),runtimeMode:'OPEN_READONLY; database.js not loaded; GET product/category only',products,categories,absentID:999999};
  json(path.join(runDir,'fixture/manifest.json'),manifest);return manifest;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const dir=process.env.GUI_RUN_DIR;if(!dir)throw Error('Set GUI_RUN_DIR; no implicit run overwrite');console.log(JSON.stringify(await prepare(path.resolve(dir)),null,2));}
