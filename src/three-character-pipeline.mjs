import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function inspectCharacter(gltf) {
  const meshes = [], skinnedMeshes = [], bones = [];
  gltf.scene.traverse((node) => {
    if (node.isMesh || node.isSkinnedMesh) meshes.push(node);
    if (node.isSkinnedMesh) skinnedMeshes.push(node);
    if (node.isBone) bones.push(node);
  });
  const bounds = new THREE.Box3().setFromObject(gltf.scene);
  const size = bounds.getSize(new THREE.Vector3());
  return {
    meshCount: meshes.length,
    skinnedMeshCount: skinnedMeshes.length,
    boneCount: bones.length,
    animationCount: gltf.animations.length,
    animationNames: gltf.animations.map((clip) => clip.name),
    height: Number(size.y.toFixed(3)),
    hasSkeleton: skinnedMeshes.some((mesh) => mesh.skeleton?.bones?.length > 0),
    hasPbrMaterials: meshes.some((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      return materials.some((material) => material && 'roughness' in material);
    })
  };
}

export async function loadCharacterAsset(url, options = {}) {
  if (!url) throw new TypeError('Character asset URL is required.');
  const gltf = await loader.loadAsync(url, (event) => {
    options.onProgress?.(event.loaded, event.total || 0);
  });
  const report = inspectCharacter(gltf);
  if (!report.skinnedMeshCount || !report.hasSkeleton) {
    throw new Error('Character GLB must contain a valid SkinnedMesh and Skeleton. ' +
      JSON.stringify(report));
  }

  const targetHeight = options.targetHeight ?? 1.72;
  if (!(targetHeight > 0)) throw new RangeError('targetHeight must be positive.');
  const actor = new THREE.Group();
  actor.name = options.name || 'CharacterActor';
  actor.add(gltf.scene);
  gltf.scene.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(gltf.scene);
  const size = bounds.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Invalid character dimensions.');
  const scale = targetHeight / size.y;
  actor.scale.setScalar(scale);
  const center = bounds.getCenter(new THREE.Vector3());
  gltf.scene.position.x -= center.x;
  gltf.scene.position.z -= center.z;
  gltf.scene.position.y -= bounds.min.y;
  actor.position.copy(options.position || new THREE.Vector3());
  actor.rotation.y = options.rotationY || 0;

  actor.traverse((node) => {
    if (node.isMesh || node.isSkinnedMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  const mixer = gltf.animations.length ? new THREE.AnimationMixer(actor) : null;
  const actions = new Map();
  if (mixer) gltf.animations.forEach((clip) => actions.set(clip.name.toLowerCase(), mixer.clipAction(clip)));

  return {
    actor, mixer, actions, clips: gltf.animations, report, source: url,
    setMotion(kind, fade = 0.2) {
      if (!mixer) return false;
      const patterns = { idle: /idle|stand|breath/, walk: /walk|walking|locomotion/, run: /run|jog|sprint/ };
      const pattern = patterns[kind] || new RegExp(kind, 'i');
      const clip = gltf.animations.find((item) => pattern.test(item.name));
      if (!clip) return false;
      const next = actions.get(clip.name.toLowerCase());
      next.reset().setEffectiveWeight(1).play();
      actions.forEach((action, name) => {
        if (name !== clip.name.toLowerCase() && action.isRunning()) action.crossFadeTo(next, fade, false);
      });
      return true;
    },
    update(delta) { mixer?.update(Math.min(Math.max(delta, 0), 0.1)); },
    dispose() {
      mixer?.stopAllAction();
      actor.traverse((node) => {
        node.geometry?.dispose?.();
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach((mat) => {
          if (!mat) return;
          Object.values(mat).forEach((value) => { if (value?.isTexture) value.dispose(); });
          mat.dispose?.();
        });
      });
      actor.removeFromParent();
    }
  };
}
