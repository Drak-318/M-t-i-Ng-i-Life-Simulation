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

const hemi = new THREE.HemisphereLight(0xddeeff, 0x52604d, 1.8); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(35, 60, 20); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const interactables = []; const npcs = [];

const state = { gameMinute: 7*60+42, day: 1, money:15000000, energy:82, stress:18, confidence:52, socialEnergy:55, currentLocation:'Nhà', memories:[], relationship:{affection:0,trust:0,understanding:0,closeness:0,respect:0,hurt:0,irritation:0,compatibility:0,willingness:0} };
const keys = new Set(); let yaw=0, pitch=.48, dragging=false, lastPointer={x:0,y:0};
const dialogue = { open:false, step:0 };

function mat(color,roughness=.85){return new THREE.MeshStandardMaterial({color,roughness});}
function box(name,x,y,z,sx,sy,sz,color,solid=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(color));mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;world.add(mesh);if(solid)interactables.push({name,object:mesh,radius:Math.max(sx,sz)*.72});return mesh;}
function label(text,x,y,z){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='rgba(10,15,20,.72)';ctx.roundRect(10,24,492,72,18);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 30px system-ui';ctx.textAlign='center';ctx.fillText(text,256,70);const tex=new THREE.CanvasTexture(canvas);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));sprite.scale.set(8,2,1);sprite.position.set(x,y,z);world.add(sprite);return sprite;}

const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),mat(0x60725c));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;world.add(ground);
const roadMat=mat(0x2d3238);
for(const x of [-42,0,42]){const r=new THREE.Mesh(new THREE.PlaneGeometry(14,170),roadMat);r.rotation.x=-Math.PI/2;r.position.set(x,.015,0);r.receiveShadow=true;world.add(r);}
for(const z of [-42,0,42]){const r=new THREE.Mesh(new THREE.PlaneGeometry(170,14),roadMat);r.rotation.x=-Math.PI/2;r.position.set(0,.016,z);r.receiveShadow=true;world.add(r);}
for(const z of [-42,0,42])for(const x of [-35,-21,-7,7,21,35])box('lane',x,.035,z,.65,.02,5.5,0xd6c98b,false);

const locations=[
{name:'Nhà',x:-21,z:-21,color:0x8798a8,size:[20,9,18],text:'Nhà Nguyễn Minh'},
{name:'Văn phòng',x:21,z:-21,color:0x7c8f9f,size:[22,16,18],text:'Văn phòng'},
{name:'Quán cà phê',x:-21,z:21,color:0x9b735d,size:[16,7,14],text:'Quán cà phê'},
{name:'Công viên',x:21,z:21,color:0x6c8d63,size:[20,1,18],text:'Công viên'},
{name:'Cửa hàng',x:0,z:21,color:0xb69c66,size:[14,7,12],text:'Cửa hàng tiện lợi'},
{name:'Nhà hàng',x:0,z:-21,color:0x8d6260,size:[14,7,12],text:'Nhà hàng'}];
for(const l of locations){box(l.name,l.x,l.name==='Công viên'?.5:l.size[1]/2,l.z,l.size[0],l.size[1],l.size[2],l.color);label(l.text,l.x,l.size[1]+3,l.z);}
for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=21+Math.cos(a)*7,z=21+Math.sin(a)*6;box('tree',x,1.4,z,.5,2.8,.5,0x684b35,false);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.8,12,8),mat(0x4d744d));crown.position.set(x,3.5,z);crown.castShadow=true;world.add(crown);}

const player=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1,5,10),mat(0x2f3740));body.position.y=1.05;body.castShadow=true;player.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),mat(0xd4a17f));head.position.y=2.05;head.castShadow=true;player.add(head);player.position.set(-21,0,-25);world.add(player);

// Linh is the first important adult NPC. She has her own position and can be met at the cafe on Sunday morning.
const linh=new THREE.Group();const linhBody=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.82,5,10),mat(0x8fa8c2));linhBody.position.y=.9;linhBody.castShadow=true;linh.add(linhBody);const linhHead=new THREE.Mesh(new THREE.SphereGeometry(.36,16,12),mat(0xe0b08e));linhHead.position.y=1.85;linhHead.castShadow=true;linh.add(linhHead);linh.position.set(-17,0,16);world.add(linh);
label('Linh',-17,3.2,16);

const npcColors=[0x596b78,0x9b7565,0x777d9a,0x8d8b70,0x6c7e65,0x8a6f8a];
for(let i=0;i<14;i++){const n=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.35,.7,4,8),mat(npcColors[i%npcColors.length]));b.position.y=.8;b.castShadow=true;n.add(b);n.position.set(-65+Math.random()*130,0,-65+Math.random()*130);world.add(n);npcs.push({object:n,angle:Math.random()*Math.PI*2,speed:.7+Math.random()*.45,phase:Math.random()*10});}

function nearestLocation(){let best={name:'Đường phố',d:Infinity};for(const l of locations){const d=player.position.distanceTo(new THREE.Vector3(l.x,0,l.z));if(d<best.d)best={name:l.name,d};}return best.d<12?best:{name:'Đường phố',d:best.d};}
function nearestInteractable(){let best=null,d=Infinity;for(const it of interactables){const dd=player.position.distanceTo(it.object.position);if(dd<it.radius+2&&dd<d){best=it;d=dd;}}return best;}
function nearLinh(){return player.position.distanceTo(linh.position)<4.8;}
function formatMoney(v){return new Intl.NumberFormat('vi-VN').format(v)+' ₫';}
function formatTime(){const h=Math.floor(state.gameMinute/60)%24,m=state.gameMinute%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
function updateHud(){clockEl.textContent=`Chủ nhật · ${formatTime()}`;moneyEl.textContent=formatMoney(state.money);state.currentLocation=nearestLocation().name;locationEl.textContent=state.currentLocation;}
function toast(text){interactionEl.textContent=text;interactionEl.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{if(!dialogue.open)interactionEl.classList.add('hidden');},2200);}

function saveGame(){localStorage.setItem('mot-doi-nguoi-save',JSON.stringify(state));toast('Đã lưu cuộc đời hiện tại trên trình duyệt.');}
function loadGame(){const raw=localStorage.getItem('mot-doi-nguoi-save');if(!raw){toast('Chưa có bản lưu.');return;}Object.assign(state,JSON.parse(raw));updateHud();toast('Đã tải lại cuộc đời.');}

function openDialogue(){if(!nearLinh()||dialogue.open)return;dialogue.open=true;dialogue.step=0;renderDialogue();}
function renderDialogue(){
  let modal=document.querySelector('#dialogue');
  if(!modal){modal=document.createElement('div');modal.id='dialogue';document.body.appendChild(modal);}
  const title=dialogue.step===0?'Linh':'Linh';
  const text=dialogue.step===0?'“Mình tưởng cuối tuần cậu hay ở nhà?” Linh nhìn Minh rồi cười nhẹ. “Hôm nay lại ra ngoài à?”':dialogue.step===1?'Linh im lặng vài giây. Cô không có vẻ khó chịu, chỉ như đang cân nhắc câu trả lời của Minh.':'Cuộc trò chuyện kết thúc. Không có điều gì lớn xảy ra. Nhưng Linh sẽ nhớ cách Minh nói chuyện hôm nay.';
  modal.innerHTML=`<div class="dialogue-card"><div class="speaker">${title}</div><div class="dialogue-text">${text}</div><div class="choices"></div></div>`;
  const choices=modal.querySelector('.choices');
  if(dialogue.step===0){choices.innerHTML='<button data-choice="honest">“Ừ, hôm nay tự nhiên muốn đi một vòng.”</button><button data-choice="ask">“Còn cậu? Sao lại ở đây?”</button><button data-choice="leave">“Tớ chỉ ghé qua thôi.”</button>';
    choices.querySelectorAll('button').forEach(b=>b.onclick=()=>choose(b.dataset.choice));
  }else if(dialogue.step===1){choices.innerHTML='<button data-choice="listen">“Ừ. Kể tớ nghe đi.”</button><button data-choice="space">“Nếu cậu không muốn nói thì cũng không sao.”</button>';
    choices.querySelectorAll('button').forEach(b=>b.onclick=()=>finishChoice(b.dataset.choice));
  }else{choices.innerHTML='<button data-choice="close">Được rồi.</button>';choices.querySelector('button').onclick=closeDialogue;}
}
function choose(choice){
  if(choice==='honest'){state.relationship.affection+=3;state.relationship.understanding+=2;state.energy=Math.max(0,state.energy-1);state.memories.push({id:'linh_first_honest',source:'Linh',gameMinute:state.gameMinute,tags:['honest'],emotionalWeight:2,triggerable:true});}
  if(choice==='ask'){state.relationship.affection+=2;state.relationship.trust+=2;state.relationship.closeness+=1;state.memories.push({id:'linh_asked_back',source:'Linh',gameMinute:state.gameMinute,tags:['curious'],emotionalWeight:2,triggerable:true});}
  if(choice==='leave'){state.relationship.affection-=1;state.relationship.closeness-=1;state.memories.push({id:'linh_short_reply',source:'Linh',gameMinute:state.gameMinute,tags:['distance'],emotionalWeight:1,triggerable:true});}
  dialogue.step=1;renderDialogue();updateHud();
}
function finishChoice(choice){if(choice==='listen'){state.relationship.trust+=3;state.relationship.understanding+=3;state.relationship.closeness+=2;state.memories.push({id:'linh_was_listened_to',source:'Linh',gameMinute:state.gameMinute,tags:['listening'],emotionalWeight:3,triggerable:true});}else{state.relationship.respect+=2;state.relationship.closeness+=1;state.relationship.willingness+=1;state.memories.push({id:'linh_given_space',source:'Linh',gameMinute:state.gameMinute,tags:['space'],emotionalWeight:2,triggerable:true});}dialogue.step=2;renderDialogue();updateHud();}
function closeDialogue(){dialogue.open=false;document.querySelector('#dialogue')?.remove();toast('Bạn không biết cuộc nói chuyện này sẽ có ý nghĩa gì về sau.');}

addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='p'){saveGame();return;}if(k==='l'){loadGame();return;}if(dialogue.open)return;keys.add(k);if(k==='e'){if(nearLinh())openDialogue();else{const it=nearestInteractable();if(it){state.memories.push({id:`memory_${Date.now()}`,source:it.name,gameMinute:state.gameMinute,emotionalWeight:1,tags:['visit'],triggerable:true});state.energy=Math.max(0,state.energy-1);toast(`Bạn ghé ${it.name}.`);}}}});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
renderer.domElement.addEventListener('pointerdown',e=>{if(dialogue.open)return;dragging=true;lastPointer={x:e.clientX,y:e.clientY};});
addEventListener('pointerup',()=>dragging=false);addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch-dy*.004,.2,1.05);lastPointer={x:e.clientX,y:e.clientY};});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

const tmp=new THREE.Vector3();let last=performance.now(),accumulator=0;
function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;accumulator+=dt;if(accumulator>=1){const minutes=Math.floor(accumulator);state.gameMinute+=minutes;accumulator-=minutes;updateHud();}
  if(!dialogue.open){const forward=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),move=new THREE.Vector3();if(keys.has('w'))move.add(forward);if(keys.has('s'))move.sub(forward);if(keys.has('d'))move.add(right);if(keys.has('a'))move.sub(right);if(move.lengthSq()>0){move.normalize().multiplyScalar(7*dt);player.position.add(move);player.position.x=THREE.MathUtils.clamp(player.position.x,-78,78);player.position.z=THREE.MathUtils.clamp(player.position.z,-78,78);}}
  for(const n of npcs){n.phase+=dt;n.object.position.x+=Math.cos(n.angle+n.phase*.12)*n.speed*dt;n.object.position.z+=Math.sin(n.angle+n.phase*.12)*n.speed*dt;if(Math.abs(n.object.position.x)>82||Math.abs(n.object.position.z)>82)n.angle+=Math.PI;}
  const camDist=7.5,camHeight=3.2;tmp.set(player.position.x-Math.sin(yaw)*camDist*Math.cos(pitch),player.position.y+camHeight+Math.sin(pitch)*2,player.position.z-Math.cos(yaw)*camDist*Math.cos(pitch));camera.position.lerp(tmp,.12);camera.lookAt(player.position.x,player.position.y+1.2,player.position.z);
  if(!dialogue.open){const it=nearestInteractable();if(nearLinh())interactionEl.textContent='E · Nói chuyện với Linh';else interactionEl.textContent=it?`E · ${it.name}`:'';if(it||nearLinh())interactionEl.classList.remove('hidden');else interactionEl.classList.add('hidden');}
  renderer.render(scene,camera);requestAnimationFrame(animate);}
updateHud();requestAnimationFrame(()=>{loadingEl.classList.add('done');animate(performance.now());});
