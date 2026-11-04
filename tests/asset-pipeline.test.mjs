import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('assets/characters/manifest.json', 'utf8'));
const loader = fs.readFileSync('src/three-character-pipeline.mjs', 'utf8');
const lab = fs.readFileSync('art-pipeline-test.html', 'utf8');
const fixture = fs.readFileSync('assets/dev-fixtures/quaternius-superhero-male.glb');

assert.equal(manifest.runtimeFormat, 'glTF 2.0 / GLB');
assert.equal(manifest.gameCharacters.minh.asset, null);
assert.equal(manifest.gameCharacters.linh.asset, null);
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
