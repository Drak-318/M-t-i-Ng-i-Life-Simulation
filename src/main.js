import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const game = document.querySelector('#game');
const clockEl = document.querySelector('#clock');
const locationEl = document.querySelector('#location');
const moneyEl = document.querySelector('#money');
const interactionEl = document.querySelector('#interaction');
const loadingEl = document.querySelector('#loading');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9db7c9);
scene.fog = new THREE.Fog(0x9db7c9, 55, 180);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
game.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xddeeff, 0x52604d, 1.8);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.1);
sun.position.set(35, 60, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const world = new THREE.Group();
scene.add(world);
const interactables = [];
const npcs = [];

const state = {
  gameMinute: 7 * 60 + 42,
  day: 1,
  money: 15000000,
  energy: 82,
  stress: 18,
  confidence: 52,
  socialEnergy: 55,
  currentLocation: 'Nhà',
  memories: [],
  relationship: { affection: 0, trust: 0, understanding: 0, closeness: 0, respect: 0, hurt: 0, irritation: 0, compatibility: 0, willingness: 0 }
};

const keys = new Set();
let yaw = 0;
let pitch = 0.48;
let dragging = false;
let lastPointer = { x: 0, y: 0 };

function mat(color, roughness = 0.85) { return new THREE.MeshStandardMaterial({ color, roughness }); }
function box(name, x, y, z, sx, sy, sz, color, solid = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat(color));
  mesh.name = name; mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
  world.add(mesh);
  if (solid) interactables.push({ name, object: mesh, radius: Math.max(sx, sz) * 0.75 });
  return mesh;
}
function label(text, x, y, z) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,512,128); ctx.fillStyle = 'rgba(10,15,20,.75)'; ctx.roundRect(10,24,492,72,18); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 30px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 256, 70);
  const tex = new THREE.CanvasTexture(canvas); const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(8, 2, 1); sprite.position.set(x, y, z); world.add(sprite); return sprite;
}

// Small Vietnamese urban neighborhood: road grid + lots + buildings.
const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), mat(0x60725c));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; world.add(ground);

const roadMat = mat(0x2d3238);
for (const x of [-42, 0, 42]) { const r = new THREE.Mesh(new THREE.PlaneGeometry(14, 170), roadMat); r.rotation.x = -Math.PI/2; r.position.x = x; r.position.y = .015; r.receiveShadow = true; world.add(r); }
for (const z of [-42, 0, 42]) { const r = new THREE.Mesh(new THREE.PlaneGeometry(170, 14), roadMat); r.rotation.x = -Math.PI/2; r.position.z = z; r.position.y = .016; r.receiveShadow = true; world.add(r); }
for (const z of [-42, 0, 42]) for (const x of [-35, -21, -7, 7, 21, 35]) { box('lane', x, .035, z, .65, .02, 5.5, 0xd6c98b, false); }

// Locations
const locations = [
  { name:'Nhà', x:-21, z:-21, color:0x8798a8, size:[20,9,18], text:'Nhà Nguyễn Minh' },
  { name:'Văn phòng', x:21, z:-21, color:0x7c8f9f, size:[22,16,18], text:'Văn phòng' },
  { name:'Quán cà phê', x:-21, z:21, color:0x9b735d, size:[16,7,14], text:'Quán cà phê' },
  { name:'Công viên', x:21, z:21, color:0x6c8d63, size:[20,1,18], text:'Công viên' },
  { name:'Cửa hàng', x:0, z:21, color:0xb69c66, size:[14,7,12], text:'Cửa hàng tiện lợi' },
  { name:'Nhà hàng', x:0, z:-21, color:0x8d6260, size:[14,7,12], text:'Nhà hàng' }
];
for (const l of locations) {
  if (l.name === 'Công viên') { box(l.name,l.x,.5,l.z,l.size[0],1,l.size[2],l.color); } else { box(l.name,l.x,l.size[1]/2,l.z,l.size[0],l.size[1],l.size[2],l.color); }
  label(l.text,l.x,l.size[1]+3,l.z);
}

// Trees in park
for (let i=0;i<16;i++) { const a=(i/16)*Math.PI*2; const x=21+Math.cos(a)*7; const z=21+Math.sin(a)*6; const trunk=box('tree',x,1.4,z,.5,2.8,.5,0x684b35,false); const crown=new THREE.Mesh(new THREE.SphereGeometry(1.8,12,8),mat(0x4d744d)); crown.position.set(x,3.5,z); crown.castShadow=true; world.add(crown); }

// Player: simple stylized third-person avatar.
const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.CapsuleGeometry(.55, 1.0, 5, 10), mat(0x2f3740)); body.position.y=1.05; body.castShadow=true; player.add(body);
const head = new THREE.Mesh(new THREE.SphereGeometry(.42, 16, 12), mat(0xd4a17f)); head.position.y=2.05; head.castShadow=true; player.add(head);
player.position.set(-21,0,-25); world.add(player);

// Background NPCs have simple independent walking routines.
const npcColors=[0x596b78,0x9b7565,0x777d9a,0x8d8b70,0x6c7e65,0x8a6f8a];
for(let i=0;i<12;i++){
  const n=new THREE.Group(); const b=new THREE.Mesh(new THREE.CapsuleGeometry(.35,.7,4,8),mat(npcColors[i%npcColors.length])); b.position.y=.8; b.castShadow=true; n.add(b);
  n.position.set(-65+Math.random()*130,0,-65+Math.random()*130); world.add(n);
  npcs.push({object:n, angle:Math.random()*Math.PI*2, speed:.7+Math.random()*.45, phase:Math.random()*10});
}

function nearestLocation() {
  let best = { name:'Đường phố', d:Infinity };
  for (const l of locations) { const d=player.position.distanceTo(new THREE.Vector3(l.x,0,l.z)); if(d<best.d) best={name:l.name,d}; }
  return best.d<12 ? best : {name:'Đường phố',d:best.d};
}
function nearestInteractable() {
  let best=null, d=Infinity;
  for(const it of interactables){ const dd=player.position.distanceTo(it.object.position); if(dd<it.radius+2 && dd<d){best=it;d=dd;} }
  return best;
}
function formatMoney(v){return new Intl.NumberFormat('vi-VN').format(v)+' ₫';}
function formatTime(){const h=Math.floor(state.gameMinute/60)%24; const m=state.gameMinute%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
function updateHud(){ clockEl.textContent=`Chủ nhật · ${formatTime()}`; moneyEl.textContent=formatMoney(state.money); state.currentLocation=nearestLocation().name; locationEl.textContent=state.currentLocation; }
function interact(){
  const it=nearestInteractable(); if(!it) return;
  state.memories.push({ id:`memory_${Date.now()}`, source:it.name, gameMinute:state.gameMinute, emotionalWeight:1, triggerable:true });
  state.energy=Math.max(0,state.energy-1);
  interactionEl.textContent = it.name==='Quán cà phê' ? 'Bạn ngồi xuống một lúc. Không có gì đặc biệt xảy ra.' : `Bạn đã ghé ${it.name}.`;
  interactionEl.classList.remove('hidden'); setTimeout(()=>interactionEl.classList.add('hidden'),2200);
}

addEventListener('keydown',e=>{keys.add(e.key.toLowerCase()); if(e.key.toLowerCase()==='e') interact();});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY};});
addEventListener('pointerup',()=>dragging=false);
addEventListener('pointermove',e=>{if(!dragging)return; const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y; yaw-=dx*.006; pitch=THREE.MathUtils.clamp(pitch-dy*.004,.2,1.05); lastPointer={x:e.clientX,y:e.clientY};});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

const tmp = new THREE.Vector3();
let last=performance.now(); let accumulator=0;
function animate(now){
  const dt=Math.min((now-last)/1000,.05); last=now; accumulator+=dt;
  if(accumulator>=1){ const minutes=Math.floor(accumulator); state.gameMinute+=minutes; accumulator-=minutes; updateHud(); }
  const forward=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw)); const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)); const move=new THREE.Vector3();
  if(keys.has('w'))move.add(forward); if(keys.has('s'))move.sub(forward); if(keys.has('d'))move.add(right); if(keys.has('a'))move.sub(right);
  if(move.lengthSq()>0){move.normalize().multiplyScalar(7*dt); player.position.add(move); player.position.x=THREE.MathUtils.clamp(player.position.x,-78,78); player.position.z=THREE.MathUtils.clamp(player.position.z,-78,78);}
  for(const n of npcs){n.phase+=dt; n.object.position.x+=Math.cos(n.angle+n.phase*.12)*n.speed*dt; n.object.position.z+=Math.sin(n.angle+n.phase*.12)*n.speed*dt; if(Math.abs(n.object.position.x)>82||Math.abs(n.object.position.z)>82)n.angle+=Math.PI;}
  const camDist=7.5, camHeight=3.2; tmp.set(player.position.x-Math.sin(yaw)*camDist*Math.cos(pitch),player.position.y+camHeight+Math.sin(pitch)*2,player.position.z-Math.cos(yaw)*camDist*Math.cos(pitch)); camera.position.lerp(tmp,.12); camera.lookAt(player.position.x,player.position.y+1.2,player.position.z);
  const it=nearestInteractable(); interactionEl.textContent=it?`E · ${it.name}`:''; if(it)interactionEl.classList.remove('hidden'); else interactionEl.classList.add('hidden');
  renderer.render(scene,camera); requestAnimationFrame(animate);
}
updateHud();
requestAnimationFrame(()=>{loadingEl.classList.add('done'); animate(performance.now());});
