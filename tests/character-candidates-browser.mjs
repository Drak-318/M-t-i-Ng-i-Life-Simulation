import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png'
};
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  if (pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(String(error)); return; }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('http://127.0.0.1:4173/character-candidates-test.html', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForFunction(() => {
    const value = document.querySelector('#status')?.textContent || '';
    return value.includes('Hai GLB đã tải') || value.includes('Có mẫu chưa đạt');
  }, null, { timeout: 45000 });
  const status = await page.locator('#status').textContent();
  const report = await page.locator('#report').textContent();
  assert.match(status, /Hai GLB đã tải/, 'Both candidate characters must load and pass skeleton checks');
  assert.match(report, /"hasSkeleton": true/, 'Both character reports must contain valid skeletons');
  assert.match(report, /"skinnedMeshCount": [1-9]/, 'Candidate characters must contain skinned meshes');
  assert.match(report, /"idleClipStarted": true/, 'Idle animation must be found and started on both candidates');
  assert.deepEqual(errors, [], 'Browser must not report page or console errors');
  fs.mkdirSync('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/character-candidates.png', fullPage: true });
  console.log('Browser candidate character render: PASS');
  console.log(status);
  console.log(report);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
