import * as THREE from 'three';

export function createThreeWorld(canvas, options = {}) {
  if (!canvas) throw new TypeError('A canvas element is required.');
  const scene = new THREE.Scene();
  const background = options.background || '#9ab5cb';
  scene.background = new THREE.Color(background);
  scene.fog = new THREE.Fog(background, options.fogNear || 35, options.fogFar || 150);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.set(4, 3, 6);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const ambient = new THREE.HemisphereLight(0xe8f2ff, 0x53604c, 1.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe4c2, 2.6);
  sun.name = 'WorldSun';
  sun.position.set(-18, 28, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xb9d8ff, 0.7);
  fill.position.set(16, 12, -18);
  scene.add(fill);

  const actors = new Set();
  let disposed = false;

  function resize(width = canvas.clientWidth, height = canvas.clientHeight) {
    if (disposed || !width || !height) return;
    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function addActor(actor) {
    if (!actor?.actor?.isObject3D) throw new TypeError('addActor expects a loaded character asset handle.');
    scene.add(actor.actor);
    actors.add(actor);
    return actor.actor;
  }

  function update(deltaSeconds) {
    if (disposed) return;
    actors.forEach((actor) => actor.update(deltaSeconds));
  }

  function render() {
    if (!disposed) renderer.render(scene, camera);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    actors.forEach((actor) => actor.dispose());
    actors.clear();
    scene.traverse((node) => {
      node.geometry?.dispose?.();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material) => material?.dispose?.());
    });
    renderer.dispose();
  }

  resize();
  return { scene, camera, renderer, resize, addActor, update, render, dispose };
}
