import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.glb':'model/gltf-binary' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/favicon.ico'){res.writeHead(204).end();return;}
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end(String(error));return;}res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(data);});
});
await new Promise(resolve=>server.listen(4174,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4174/web.html?threeCharacters=1',{waitUntil:'networkidle',timeout:60000});
  await page.waitForFunction(()=>window.__lifeThreeOverlayReady===true||Boolean(window.__lifeThreeOverlayError),null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__lifeThreeOverlayReady),true,'Three.js overlay must load both production-candidate models');
  const info=await page.evaluate(()=>{
    const bridge=window.__lifeVisualBridge?.getSnapshot?.();
    const overlay=window.__lifeThreeOverlay;
    const motions=[...overlay.actors.entries()].map(([id,entry])=>({id,idle:entry.handle.setMotion('idle'),walk:entry.handle.setMotion('walk'),run:entry.handle.setMotion('run')}));
    const reports=[...overlay.actors.entries()].map(([id,entry])=>({id,triangles:entry.handle.report.triangleCount,materials:entry.handle.report.materialCount,textures:entry.handle.report.textureCount,hasSkeleton:entry.handle.report.hasSkeleton}));
    return {actorIds:[...overlay.actors.keys()],actorCount:overlay.actors.size,bridgeActors:bridge?.actors?.map(x=>x.id),canvas:!!document.getElementById('character-overlay'),motions,reports};
  });
  assert.deepEqual(info.actorIds,['minh','linh']);
  assert.deepEqual(info.bridgeActors,['minh','linh']);
  assert.equal(info.actorCount,2);
  assert.equal(info.canvas,true);
  assert.ok(info.motions.every(x=>x.idle&&x.walk&&x.run),'Both imported characters must expose idle, walk and run clips');
  assert.ok(info.reports.every(x=>x.hasSkeleton&&x.triangles>0),'Both imported characters must report valid mesh/skeleton diagnostics');
  assert.deepEqual(errors,[],'Game overlay should not emit browser errors');
  fs.mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/game-three-character-overlay.png',fullPage:true});
  console.log('Game Three.js character overlay browser test: PASS');
  console.log(JSON.stringify(info));
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
