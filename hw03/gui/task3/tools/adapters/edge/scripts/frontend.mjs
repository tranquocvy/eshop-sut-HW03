import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.env.SUT_RUNTIME;if(!root||!process.env.GUI_RUN_DIR)throw Error('Runtime/run dirs required');
// Tailwind/PostCSS resolve config theo cwd; dùng đúng cwd frontend như entrypoint chuẩn.
process.chdir(path.join(root,'frontend-web'));
const {createServer}=await import(pathToFileURL(path.join(root,'frontend-web/node_modules/vite/dist/node/index.js')).href);
const server=await createServer({root:path.join(root,'frontend-web'),cacheDir:path.join(process.env.GUI_RUN_DIR,'.vite-cache'),server:{host:'127.0.0.1',port:5173,strictPort:true}});
await server.listen();console.log('FRONTEND_READY: http://127.0.0.1:5173');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await server.close();process.exit(0);});
