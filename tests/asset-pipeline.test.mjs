import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('assets/characters/manifest.json', 'utf8'));
const loader = fs.readFileSync('src/three-character-pipeline.mjs', 'utf8');
const lab = fs.readFileSync('art-pipeline-test.html', 'utf8');
const worldAdapter = fs.readFileSync('src/three-world-adapter.mjs', 'utf8');
const fixture = fs.readFileSync('assets/dev-fixtures/quaternius-superhero-male.glb');

assert.equal(manifest.runtimeFormat, 'glTF 2.0 / GLB');
assert.equal(manifest.gameCharacters.minh.asset, 'assets/characters/generated/Minh.glb');
assert.equal(manifest.gameCharacters.linh.asset, 'assets/characters/generated/Linh.glb');
assert.match(manifest.developmentFixtures[0].purpose, /Never assign this fixture to Minh or Linh/);
assert.match(loader, /GLTFLoader/);
assert.match(loader, /isSkinnedMesh/);
assert.match(loader, /AnimationMixer/);
assert.match(loader, /setMotion\(kind/);
assert.match(lab, /three-character-pipeline\.mjs/);
assert.match(lab, /quaternius-superhero-male\.glb/);
assert.equal(fixture.toString('ascii', 0, 4), 'glTF');
assert.equal(fixture.readUInt32LE(4), 2);
assert.equal(fixture.readUInt32LE(8), fixture.length);
console.log('3D asset pipeline foundation checks: PASS');

assert.ok(fs.existsSync('character-candidates-test.html'), 'Candidate review lab must exist');
const candidateLab = fs.readFileSync('character-candidates-test.html', 'utf8');
assert.ok(candidateLab.includes('minh-base-ped-man.glb'), 'Male candidate must be loaded in review lab');
assert.ok(candidateLab.includes('linh-base-casual-woman.glb'), 'Female candidate must be loaded in review lab');
assert.ok(candidateLab.includes('loadCharacterAsset'), 'Review lab must use production GLB loader');
assert.ok(candidateLab.includes('candidate only'), 'Candidate lab must not imply production approval');

function readGlbJson(path) {
  const data = fs.readFileSync(path);
  assert.equal(data.toString('ascii', 0, 4), 'glTF');
  assert.equal(data.readUInt32LE(4), 2);
  assert.equal(data.readUInt32LE(8), data.length);
  const jsonLength = data.readUInt32LE(12);
  assert.equal(data.readUInt32LE(16), 0x4E4F534A);
  return JSON.parse(data.toString('utf8', 20, 20 + jsonLength).trim());
}
for (const path of [
  'assets/characters/candidates/minh-base-ped-man.glb',
  'assets/characters/candidates/linh-base-casual-woman.glb'
]) {
  const gltf = readGlbJson(path);
  assert.ok(gltf.meshes?.length, path + ' must contain a visible mesh');
  assert.ok(gltf.skins?.some(skin => (skin.joints?.length || 0) >= 20), path + ' must contain a usable humanoid skeleton');
}
console.log('Everyday character candidate GLB/skeleton checks: PASS');

const overlay = fs.readFileSync('src/three-character-overlay.mjs', 'utf8');
const gameHtml = fs.readFileSync('web.html', 'utf8');
const gameRuntime = fs.readFileSync('src/web3d_v5.js', 'utf8');
assert.match(gameHtml, /threeCharacters/);
assert.match(gameHtml, /id="character-overlay"/);
assert.match(gameHtml, /type="importmap"/);
assert.match(overlay, /loadCharacterAsset/);
assert.match(overlay, /setMotion\('idle'\)/);
assert.match(overlay, /state\.walk > 0\.12/);
assert.match(gameRuntime, /window\.__lifeVisualBridge=/);
assert.match(gameRuntime, /__lifeUseImportedCharacters/);
console.log('Staged live-game Three.js character bridge checks: PASS');

assert.match(overlay, /state\.run \? 'run' : 'walk'/);
assert.match(gameRuntime, /run:keys\.has\("shift"\)/);

assert.match(loader, /triangleCount/);
assert.match(loader, /materialCount/);
assert.match(loader, /acceptanceWarnings/);

const productionReview = fs.readFileSync('character-production-review.html', 'utf8');
assert.ok(productionReview.includes('./assets/characters/generated/Minh.glb'));
assert.ok(productionReview.includes('./assets/characters/generated/Linh.glb'));
for (const name of ['Minh', 'Linh']) {
  const params = JSON.parse(fs.readFileSync(`assets/characters/source/${name.toLowerCase()}.params.json`, 'utf8'));
  assert.equal(params.name, name);
  assert.equal(params.detail, 'medium');
  assert.equal(params.rig, 'game');
  assert.ok(params.asian >= 0.8, name + ' should use the project Asian character direction');
  const gltf = readGlbJson(`assets/characters/generated/${name}.glb`);
  assert.ok(gltf.images?.length, name + ' must include photo-based textures');
  assert.ok((gltf.materials?.length || 0) <= 32, name + ' exceeds the material-slot hard limit');
  assert.ok(gltf.animations?.some(clip => /idle/i.test(clip.name)), name + ' idle clip missing');
  assert.ok(gltf.animations?.some(clip => /walk/i.test(clip.name)), name + ' walk clip missing');
  assert.ok(gltf.animations?.some(clip => /run/i.test(clip.name)), name + ' run clip missing');
}
console.log('Generated textured production character checks: PASS');
