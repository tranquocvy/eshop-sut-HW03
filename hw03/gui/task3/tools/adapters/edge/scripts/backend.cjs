'use strict';
// Chỉ mở DB hiện có read-only; không thực thi module database.js/initializer.
const fs=require('node:fs');const path=require('node:path');const {createRequire}=require('node:module');
const root=process.env.SUT_RUNTIME;if(!root)throw Error('SUT_RUNTIME required');
const server=path.join(root,'backend/server.js');const req=createRequire(server);const database=req.resolve('./database');
const file=path.join(root,'backend/database.sqlite');if(!fs.existsSync(file))throw Error('Missing fixture; no creation/seed');
const sqlite=req('sqlite3');const db=new sqlite.Database(file,sqlite.OPEN_READONLY,error=>{if(error)throw error;
  require.cache[database]={id:database,filename:database,loaded:true,exports:db};
  console.log('NO_SEED_READY: existing DB read-only; initializer never loaded');req(server);
});
