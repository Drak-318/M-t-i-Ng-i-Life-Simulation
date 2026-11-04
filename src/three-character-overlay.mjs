import * as THREE from 'three';
import { loadCharacterAsset } from './three-character-pipeline.mjs';

const MODEL_URLS = {
  minh: './assets/characters/candidates/minh-base-ped-man.glb',
  linh: './assets/characters/candidates/linh-base-casual-woman.glb'
};

export async function attachLifeCharacterOverlay(canvas, options = {}) {
  if (!canvas) throw new TypeError('Character overlay canvas is required.');
  const bridge = window.__lifeVisualBridge;
  if (!bridge?.getSnapshot) throw new Error('Life Simulation visual bridge is not ready.');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5c6875, 2.0));
  const key = new THREE.DirectionalLight(0xffe4c2, 2.4);
  key.position.set(-12, 22, 14);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb9d8ff, 0.9);
  fill.position.set(12, 10, -12);
  scene.add(fill);

  const camera = new THREE.Camera();
  camera.matrixAutoUpdate = false;
  camera.matrixWorld.identity();
  camera.matrixWorldInverse.identity();

  const actors = new Map();
  const errors = [];
  for (const id of ['minh', 'linh']) {
    try {
      const actor = await loadCharacterAsset(MODEL_URLS[id], {
        name: id === 'minh' ? 'Minh — imported GLB' : 'Linh — imported GLB',
        targetHeight: options.targetHeight || 3.05
      });
      actor.actor.rotation.y = options.forwardOffset ?? Math.PI;
      actor.setMotion('idle');
      scene.add(actor.actor);
      actors.set(id, { handle: actor, motion: 'idle' });
    } catch (error) {
      errors.push({ id, message: error.message });
    }
  }
  if (actors.size !== 2) {
    actors.forEach(({ handle }) => handle.dispose());
    renderer.dispose();
    throw new Error('Could not load both imported main characters: ' + JSON.stringify(errors));
  }

  let disposed = false, previous = performance.now();
  function resize() {
    if (disposed) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight, false);
  }
  function frame(now) {
    if (disposed) return;
    requestAnimationFrame(frame);
    const snapshot = bridge.getSnapshot();
    if (!snapshot) return;
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    camera.projectionMatrix.fromArray(snapshot.viewProjection);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    for (const state of snapshot.actors) {
      const entry = actors.get(state.id);
      if (!entry) continue;
      const { handle } = entry;
      handle.actor.position.set(state.x, 0, state.z);
      handle.actor.rotation.y = state.yaw + (options.forwardOffset ?? Math.PI);
      const motion = state.walk > 0.12 ? 'walk' : 'idle';
      if (motion !== entry.motion) {
        if (handle.setMotion(motion)) entry.motion = motion;
      }
      handle.update(delta);
    }
    renderer.render(scene, camera);
  }
  addEventListener('resize', resize);
  requestAnimationFrame(frame);
  return {
    actors,
    errors,
    dispose() {
      disposed = true;
      removeEventListener('resize', resize);
      actors.forEach(({ handle }) => handle.dispose());
      actors.clear();
      renderer.dispose();
    }
  };
}
