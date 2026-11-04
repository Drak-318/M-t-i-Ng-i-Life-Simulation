(()=>{"use strict";
function building(p){
 if(p.kind==="park"){
  draw(p.x,.025,p.z,p.w/2,.025,p.d/2,[.25,.43,.27]);
  draw(p.x,.055,p.z,.9,.018,p.d/2,[.72,.65,.48]);draw(p.x,.055,p.z, p.w/2,.018,.75,[.72,.65,.48]);
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)draw(p.x+x*4,.07,p.z+z*3,1.25,.025,.10,[.82,.75,.60]);
  return;
 }
 const wall=p.c,front=p.z-p.d/2-.05;
 draw(p.x,p.h/2,p.z,p.w/2,p.h/2,p.d/2,wall);
 draw(p.x,p.h+.13,p.z,p.w/2+.22,.13,p.d/2+.22,[.12,.16,.19]);
 draw(p.x,p.h+.30,p.z,p.w*.25,.09,p.d*.22,p.kind==="home"?[.38,.48,.56]:p.kind==="cafe"?[.62,.32,.22]:[.22,.34,.43]);
 // ground-floor shopfront, door and framed windows
 for(let i=-1;i<=1;i++){
  const wx=p.x+i*p.w*.27;
  draw(wx,p.h*.59,front,.56,.47,.055,[.25,.39,.48]);
  draw(wx,p.h*.59,front-.065,.46,.37,.018,[.56,.72,.78]);
  draw(wx,p.h*.59,front-.09,.035,.39,.025,[.88,.85,.72]);
 }
 draw(p.x+p.w*.34,p.h*.34,front-.08,.48,.72,.07,[.20,.24,.27]);
 draw(p.x+p.w*.34,p.h*.34,front-.13,.34,.58,.02,[.38,.53,.59]);
 // upper windows, balconies and sill lines
 if(p.h>3.3)for(let floor=1;floor<=2;floor++)for(let i=-1;i<=1;i++){
  const wx=p.x+i*p.w*.27,wy=p.h*(.48+floor*.22);
  draw(wx,wy,front,.62,.39,.06,[.16,.25,.31]);
  draw(wx,wy,front-.07,.50,.29,.02,[.48,.67,.74]);
  draw(wx,wy-.20,front-.12,.58,.035,.08,[.72,.74,.70]);
 }
 draw(p.x,p.h+.52,front-.15,p.w*.34,.20,.06,p.kind==="cafe"?[.72,.32,.20]:[.14,.23,.30]);
}
function tree(x,z){
 draw(x,.58,z,.13,.58,.13,[.30,.20,.13]);
 ellipsoid(x,.1+1.25,z,.68,.78,.68,[.17,.40,.22]);
 ellipsoid(x-.38,1.35,z+.08,.48,.53,.48,[.20,.47,.24]);
 ellipsoid(x+.38,1.42,z-.05,.46,.55,.46,[.16,.39,.20]);
 ellipsoid(x,1.86,z,.42,.48,.42,[.25,.52,.27]);
}
function street(){
 draw(0,-.08,0,39,.08,31,[.27,.38,.28]);
 // sidewalks, curbs and asphalt crossroads
 draw(0,.005,0,39,.04,4.8,[.11,.12,.13]);draw(0,.005,0,4.8,.04,31,[.11,.12,.13]);
 draw(0,.045,3.0,39,.045,.62,[.53,.53,.50]);draw(0,.045,-3.0,39,.045,.62,[.53,.53,.50]);
 draw(3.0,.045,0,.62,.045,31,[.53,.53,.50]);draw(-3.0,.045,0,.62,.045,31,[.53,.53,.50]);
 draw(0,.08,0,39,.02,3.6,[.075,.082,.09]);draw(0,.08,0,3.6,.02,31,[.075,.082,.09]);
 for(let x=-36;x<=36;x+=4){draw(x,.11,0,1.15,.018,.045,[.88,.76,.39]);}
 for(let z=-28;z<=28;z+=4){draw(0,.11,z,.045,.018,1.15,[.88,.76,.39]);}
 // pedestrian crossings on all four approaches
 for(let i=-3;i<=3;i++){draw(i*.48,.12,4.2,.20,.025,.72,[.88,.88,.82]);draw(i*.48,.12,-4.2,.20,.025,.72,[.88,.88,.82]);draw(4.2,.12,i*.48,.72,.025,.20,[.88,.88,.82]);draw(-4.2,.12,i*.48,.72,.025,.20,[.88,.88,.82]);}
 // sidewalk paving joints and street lamps
 for(let x=-32;x<=32;x+=8){draw(x,.105,3.35,.025,.018,.24,[.37,.38,.36]);draw(x,.105,-3.35,.025,.018,.24,[.37,.38,.36]);}
 for(let x=-30;x<=30;x+=15){draw(x,.10,5.1,.055,1.9,.055,[.18,.20,.21]);draw(x,.10,5.1,.42,.045,.20,[.18,.20,.21]);ellipsoid(x,2.05,5.1,.24,.08,.15,[.95,.82,.56]);}
}
function vehicle(v){
 draw(v.x,.28,v.z,1.20,.25,.56,v.color);
 draw(v.x-.12,.58,v.z,.70,.25,.48,[.46,.57,.63]);
 draw(v.x-.12,.60,v.z+.49,.42,.18,.025,[.70,.82,.85]);
 draw(v.x-.12,.60,v.z-.49,.42,.18,.025,[.70,.82,.85]);
 for(const x of [-.78,.62])for(const z of [-.38,.38])ellipsoid(v.x+x,.12,v.z+z,.19,.16,.10,[.055,.06,.065]);
 draw(v.x+1.02,.30,v.z,.06,.10,.32,[.78,.18,.12]);
}
function parkProps(){
 for(let x=10;x<=30;x+=5)for(let z=-25;z<=-11;z+=5)tree(x,z);
 // curved paths, benches, flower beds and lamp posts
 for(let z=-24;z<=-12;z+=4)draw(20,.085,z,.32,.025,1.7,[.78,.72,.59]);
 for(let x=12;x<=28;x+=8){
  draw(x,.22,-15,.95,.12,.28,[.42,.27,.16]);draw(x,.43,-15,.09,.10,.82,[.34,.22,.13]);
  draw(x,.78,-15,.07,.32,.07,[.24,.25,.24]);
 }
 for(let x=12;x<=28;x+=8)for(let z=-24;z<=-12;z+=6){ellipsoid(x,.22,z,.20,.22,.20,[.88,.48,.42]);ellipsoid(x+.4,.2,z+.2,.18,.20,.18,[.95,.72,.36]);}
}

const $=id=>document.getElementById(id),canvas=$("world"),clock=$("clock"),locEl=$("loc"),moneyEl=$("money"),energyEl=$("energy"),stressEl=$("stress"),relEl=$("rel"),targetEl=$("target"),labels=$("labels"),modal=$("modal"),meta=$("meta"),story=$("story"),choices=$("choices"),toastEl=$("toast"),panel=$("panel"),panelTitle=$("panelTitle"),panelBody=$("panelBody"),errorEl=$("error"),errorText=$("errorText");
function showFatalError(reason){
 if(!errorEl||!errorText){console.error("Life Simulation startup error:",reason);return}
 errorEl.style.display="grid";
 errorText.textContent=reason&&reason.stack?reason.stack:String(reason||"Lỗi không xác định");
}
window.addEventListener("error",event=>showFatalError(event.error||event.message||"JavaScript runtime error"));
window.addEventListener("unhandledrejection",event=>showFatalError(event.reason||"Unhandled promise rejection"));

const DAYS=["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"],SAVE="mot-doi-nguoi-web3d-v5";
let state={day:1,min:462,money:15000000,energy:82,stress:18,confidence:52,trust:0,affection:0,understanding:0,closeness:0,respect:0,hurt:0,memories:[],done:[]};
let player={x:-24,z:14,yaw:0,walk:0},destination=null,paused=false,last=performance.now(),anim=0;
const keys=new Set();let dragging=false,movedMouse=false,lastMouse={x:0,y:0},camYaw=.65,camPitch=.48,camDist=7.2;
const locations=[
{id:"home",name:"Nhà Minh",x:-24,z:20,w:11,d:9,h:3.8,c:[.38,.50,.58],kind:"home",info:"Căn hộ của Minh."},
{id:"office",name:"Văn phòng",x:24,z:19,w:14,d:9,h:4.5,c:[.30,.40,.48],kind:"office",info:"Nơi Minh làm việc."},
{id:"cafe",name:"Quán cà phê",x:-20,z:-18,w:9,d:7,h:3.2,c:[.50,.36,.28],kind:"cafe",info:"Một quán nhỏ để gặp người khác hoặc ngồi một mình."},
{id:"park",name:"Công viên",x:20,z:-18,w:18,d:14,h:.08,c:[.20,.40,.22],kind:"park",info:"Không gian xanh với lối đi, ghế và người qua lại."},
{id:"shop",name:"Cửa hàng",x:2,z:-17,w:8,d:6,h:3.1,c:[.55,.46,.27],kind:"shop",info:"Mua đồ dùng hằng ngày."},
{id:"restaurant",name:"Nhà hàng",x:3,z:18,w:8,d:6,h:3.4,c:[.48,.30,.30],kind:"restaurant",info:"Ăn uống và những cuộc gặp không được lên lịch."}
];
const CharacterSystem=window.CharacterSystem;
if(!CharacterSystem)throw new Error("CharacterSystem chưa được tải.");
const npcs=Array.from({length:12},(_,i)=>({...CharacterSystem.createBackgroundCharacter(i),x:-31+(i*11)%62,z:-26+(i*17)%52,yaw:0,visualScale:1.12,goal:["office","cafe","park","shop"][i%4],role:["đi làm","đi cà phê","đi dạo","mua đồ"][i%4],walk:0}));
const linh={...CharacterSystem.createLinh(),x:-24,z:13.8,yaw:2.2,speed:.18,phase:4.1,visualScale:1.28,goal:"cafe",role:"công việc riêng",walk:0};
player.visualScale=1.28;player.appearance={skin:[.78,.58,.46],hair:[.045,.05,.06],top:[.10,.12,.14],bottom:[.07,.08,.09],shoe:[.08,.09,.10],style:"short",height:1};
const vehicles=Array.from({length:8},(_,i)=>({x:-36+i*10,z:i%2?-2.0:2.0,dir:i%2?1:-1,speed:1.8+(i%3)*.5,color:[[.18,.22,.27],[.55,.17,.16],[.78,.72,.55],[.18,.38,.30]][i%4]}));
const scenes=[
[1,"home","Sáng Chủ nhật. Điện thoại nằm trên bàn. Minh không có kế hoạch rõ ràng.",[["Ở nhà nghỉ ngơi",{energy:6,stress:-3,m:"rested"}],["Đi ra ngoài",{energy:-3,m:"went_out"}]]],
[1,"cafe","Quán cà phê không đông. Có những buổi sáng chẳng có chuyện gì đặc biệt.",[["Ngồi một mình",{energy:2,stress:-1,m:"quiet_cafe"}],["Mở lời với người ngồi gần",{energy:-2,confidence:2,m:"small_talk"}]]],
[2,"office","Một việc gấp xuất hiện đúng lúc Minh vừa định đóng máy.",[["Ở lại xử lý",{energy:-8,stress:5,m:"worked_late"}],["Để sáng mai",{stress:-2,m:"set_boundary"}]]],
[2,"home","Một tin nhắn của Linh xuất hiện. Chỉ là một câu hỏi rất bình thường.",[["Trả lời ngay",{energy:-1,trust:2,affection:2,m:"replied"}],["Để mai",{trust:-1,m:"delayed"}]]],
[3,"office","Đồng nghiệp rủ Minh đi ăn trưa. Cậu đã định ăn một mình.",[["Đi cùng",{energy:-4,confidence:1,m:"lunch"}],["Từ chối",{energy:2,m:"alone"}]]],
[3,"park","Công viên yên hơn thường lệ. Minh có thời gian nghĩ về tuần này.",[["Đi bộ",{energy:-2,stress:-5,m:"walk"}],["Về nhà",{energy:2,m:"home_early"}]]],
[4,"cafe","Linh có vẻ mệt nhưng vẫn cố tỏ ra bình thường.",[["Hỏi thăm",{trust:2,understanding:3,affection:1,m:"noticed"}],["Không hỏi",{hurt:2,affection:-1,m:"missed_signal"}]]],
[4,"park","Một buổi chiều rảnh bất ngờ. Minh có thể dùng nó cho chính mình.",[["Ngồi nghe nhạc",{stress:-4,energy:2,m:"music"}],["Nhắn cho Linh",{affection:1,trust:1,m:"checked_in"}]]],
[5,"shop","Một khoản chi nhỏ cũng là một lựa chọn.",[["Mua thứ mình thích",{money:-80000,stress:-2,m:"small_treat"}],["Không mua",{confidence:1,m:"saved"}]]],
[5,"restaurant","Một lời mời ăn tối đến bất ngờ.",[["Đi ăn",{money:-180000,energy:-3,affection:2,closeness:2,m:"dinner"}],["Từ chối",{energy:2,trust:-1,m:"declined"}]]],
[6,"office","Cuối tuần đã gần tới nhưng một phần việc vẫn chưa xong.",[["Làm thêm",{energy:-5,stress:4,m:"overtime"}],["Đóng máy đúng giờ",{stress:-3,confidence:1,m:"protected_time"}]]],
[6,"cafe","Linh hỏi: “Dạo này cậu ổn không?”",[["Nói thật một chút",{trust:4,understanding:4,closeness:2,confidence:2,m:"opened_up"}],["Nói “ổn mà”",{trust:-1,m:"kept_feelings"}]]],
[7,"home","Sáng thứ Bảy. Minh có thể dành cả ngày cho việc riêng.",[["Ngủ thêm",{energy:8,stress:-3,m:"slept"}],["Dọn phòng",{energy:-2,confidence:1,m:"cleaned"}]]],
[7,"park","Mỗi người trong công viên đều có một cuộc sống riêng. Minh cũng vậy.",[["Ngồi quan sát",{energy:2,stress:-3,understanding:1,m:"observed"}],["Đi bộ thật lâu",{energy:-5,stress:-6,m:"long_walk"}]]],
[7,"cafe","Linh nhắn rằng hôm nay cô ấy rảnh. Không có kế hoạch đặc biệt nào.",[["Hẹn gặp",{energy:-3,affection:2,closeness:3,trust:2,m:"made_time"}],["Để dịp khác",{energy:2,trust:-2,m:"postponed"}]]],
[7,"restaurant","Bữa tối kết thúc. Có những mối quan hệ không cần một câu trả lời ngay lập tức.",[["Muốn tiếp tục tìm hiểu",{trust:3,affection:3,closeness:2,m:"said_continue"}],["Giữ như hiện tại",{m:"status_quo"}]]]
];
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)),money=v=>new Intl.NumberFormat("vi-VN").format(Math.round(v))+" ₫";
function timeText(){let m=((state.min%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")}
function relation(){return Math.round((state.trust+state.affection+state.understanding+state.closeness+state.respect)/5)}
function nearLocation(){let b=null,d=999;for(const p of locations){let q=Math.hypot(player.x-p.x,player.z-p.z);if(q<d){d=q;b=p}}return d<7?b:null}
function nearPerson(){let b=null,d=999;for(const n of [linh,...npcs]){let q=Math.hypot(player.x-n.x,player.z-n.z);if(q<d){d=q;b=n}}return d<3.4?b:null}
function hud(){clock.textContent=`${DAYS[state.day-1]} · ${timeText()}`;locEl.textContent=nearLocation()?.name||"Đường phố";moneyEl.textContent=money(state.money);energyEl.textContent=`Năng lượng ${Math.round(state.energy)}`;stressEl.textContent=`Stress ${Math.round(state.stress)}`;relEl.textContent=`Quan hệ ${relation()}`}
function toast(t){toastEl.textContent=t;toastEl.classList.add("on");clearTimeout(toast.timer);toast.timer=setTimeout(()=>toastEl.classList.remove("on"),1700)}
function remember(m){state.memories.push({id:m,day:state.day,min:state.min})}
function apply(e){for(const k of ["energy","stress","confidence","trust","affection","understanding","closeness","respect","hurt","irritation","willingness_to_continue"])if(Number.isFinite(e[k]))state[k]=clamp((state[k]||0)+e[k]);if(Number.isFinite(e.money))state.money=Math.max(0,state.money+e.money)}
function advance(minutes){state.min+=minutes;while(state.min>=1440){state.min-=1440;state.day++;state.done=[];if(state.day>7){state.day=1;state.energy=clamp(state.energy+18);state.stress=clamp(state.stress-12);toast("Một tuần trôi qua · Quan hệ "+relation()+"/100")}}for(const c of [linh,...npcs])CharacterSystem.tick(c,minutes,state.day,state.min/60);hud()}
function sk(s){return `${state.day}|${s[1]}|${s[2]}`}
function openScene(s,actor=null){paused=true;meta.textContent=s[1]+" · "+DAYS[state.day-1]+" · "+timeText();story.textContent=s[2];choices.innerHTML="";for(const ch of s[3]){let b=document.createElement("button");b.className="choice";b.textContent=ch[0];b.onclick=()=>{if(!actor||actor===linh)apply(ch[1]);if(actor)CharacterSystem.applyRelationship(actor,ch[1],state.day,state.min);if(ch[1].m)remember((actor?actor.id+":":"")+ch[1].m);state.done.push(sk(s));advance(12);modal.style.display="none";paused=false;destination=null;toast("Lựa chọn đã được ghi nhớ.")};choices.appendChild(b)}modal.style.display="grid"}
function sceneHere(){let p=nearLocation();return p?scenes.find(s=>s[0]===state.day&&s[1]===p.id&&!state.done.includes(sk(s))):null}
function interact(){if(paused)return;let n=nearPerson();if(n){const scene=CharacterSystem.interaction(n,state);return openScene([scene.sceneId,scene.title,scene.text,scene.choices],n)}let s=sceneHere();if(s)return openScene(s);let p=nearLocation();if(p)return openScene(["loc",p.name,p.info,[["Quan sát xung quanh",{understanding:1,m:"observe_"+p.id}],["Rời đi",{m:"leave_"+p.id}]]]);toast("Không có gì đủ gần để tương tác.")}
function save(){localStorage.setItem(SAVE,JSON.stringify({state,player,linh:{x:linh.x,z:linh.z,yaw:linh.yaw},npcs:npcs.map(n=>({x:n.x,z:n.z,yaw:n.yaw,goal:n.goal})),characterProfiles:CharacterSystem.serialize([linh,...npcs])}));toast("Đã lưu cuộc sống của Minh.")}
function load(){let raw=localStorage.getItem(SAVE);if(!raw)return toast("Chưa có bản lưu.");try{let d=JSON.parse(raw);Object.assign(state,d.state);Object.assign(player,d.player);if(d.linh)Object.assign(linh,d.linh);if(Array.isArray(d.npcs))d.npcs.forEach((x,i)=>Object.assign(npcs[i],x));CharacterSystem.restore([linh,...npcs],d.characterProfiles);hud();toast("Đã tải bản lưu.")}catch(e){toast("Bản lưu không hợp lệ.")}}
function reset(){localStorage.removeItem(SAVE);location.reload()}
function startFallback(reason){
 console.error("WebGL unavailable; starting 2D compatibility renderer:",reason);
 const fallback=document.createElement("canvas");fallback.id="world-fallback";
 fallback.style.cssText="position:fixed;inset:0;width:100%;height:100%;display:block;z-index:1;cursor:crosshair";
 canvas.style.display="none";document.body.insertBefore(fallback,canvas.nextSibling);
 const ctx=fallback.getContext("2d");
 if(!ctx){showFatalError(new Error("Cả WebGL và Canvas 2D đều không khả dụng: "+String(reason)));return}
 const notice=document.createElement("div");notice.textContent="CHẾ ĐỘ TƯƠNG THÍCH · ĐỒ HỌA 2D";notice.style.cssText="position:fixed;top:12px;left:12px;z-index:3;padding:7px 10px;border-radius:8px;background:#101820dd;color:#fff;font:11px system-ui;pointer-events:none";document.body.appendChild(notice);
 let zoom=1,cx=0,cz=0,drag=false,moved=false,lastX=0,lastY=0;
 function resize(){const d=Math.min(devicePixelRatio||1,2),w=Math.floor(innerWidth*d),h=Math.floor(innerHeight*d);if(fallback.width!==w||fallback.height!==h){fallback.width=w;fallback.height=h}ctx.setTransform(d,0,0,d,0,0)}
 function point(x,z,s){return{x:innerWidth/2+(x-cx)*s,y:innerHeight/2+(z-cz)*s}}
 function rect(x,z,w,h,s,color){const p=point(x-w/2,z-h/2,s);ctx.fillStyle=color;ctx.fillRect(p.x,p.y,w*s,h*s)}
 function circle(x,z,r,s,color){const p=point(x,z,s);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,r*s),0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
 function label(x,z,t,s,color="#f5f5f5"){const p=point(x,z,s);ctx.font="12px system-ui";ctx.textAlign="center";ctx.fillStyle="#071018cc";ctx.fillRect(p.x-ctx.measureText(t).width/2-5,p.y-19,ctx.measureText(t).width+10,18);ctx.fillStyle=color;ctx.fillText(t,p.x,p.y-6)}
 function renderFallback(){
  resize();const s=Math.min(innerWidth/88,innerHeight/68)*zoom;
  ctx.fillStyle="#8a9a83";ctx.fillRect(0,0,innerWidth,innerHeight);
  rect(0,0,82,6,s,"#343a40");rect(0,0,6,66,s,"#343a40");
  rect(0,0,82,.18,s,"#d7c98c");rect(0,0,.18,66,s,"#d7c98c");
  rect(0,7,82,1,s,"#69716a");rect(0,-7,82,1,s,"#69716a");
  for(const p of locations){
   rect(p.x,p.z,p.w+0.8,p.d+0.8,s,"#59635d");
   rect(p.x,p.z,p.w,p.d,s,p.kind==="park"?"#5d9560":p.kind==="home"?"#9babb5":p.kind==="office"?"#728997":p.kind==="cafe"?"#b68b69":p.kind==="shop"?"#b9a36c":"#a87575");
   label(p.x,p.z,p.name,s);
  }
  for(let i=0;i<24;i++){const x=-34+(i*17)%68,z=-29+(i*23)%58;circle(x,z,.34,s,"#75553a");circle(x,z,.8,s,"#397849")}
  for(const v of vehicles){rect(v.x,v.z,2.2,.95,s,v.color?"#8d9eae":"#657887")}
  for(const n of npcs){circle(n.x,n.z,.48,s,"#e6b86c");circle(n.x,n.z-.08,.22,s,"#49382e")}
  circle(linh.x,linh.z,.52,s,"#e58ca9");circle(linh.x,linh.z-.08,.23,s,"#49382e");label(linh.x,linh.z,"Linh",s,"#ffdce8");
  circle(player.x,player.z,.58,s,"#65c9f0");circle(player.x,player.z-.1,.24,s,"#183d55");label(player.x,player.z,"Minh",s,"#d8f4ff");
  ctx.fillStyle="#071018aa";ctx.fillRect(12,innerHeight-42,Math.min(600,innerWidth-24),30);
  ctx.fillStyle="#fff";ctx.font="12px system-ui";ctx.textAlign="left";ctx.fillText("WASD di chuyển · A/D xoay · Q/E đi ngang · Click di chuyển · E tương tác · N +1 giờ",22,innerHeight-22);
  requestAnimationFrame(renderFallback);
 }
 fallback.addEventListener("pointerdown",e=>{drag=true;moved=false;lastX=e.clientX;lastY=e.clientY;fallback.setPointerCapture(e.pointerId)});
 fallback.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;const s=Math.min(innerWidth/88,innerHeight/68)*zoom;cx-=dx/s;cz-=dy/s;lastX=e.clientX;lastY=e.clientY});
 fallback.addEventListener("pointerup",()=>drag=false);
 fallback.addEventListener("click",e=>{if(moved){moved=false;return}const s=Math.min(innerWidth/88,innerHeight/68)*zoom;targetTo(cx+(e.clientX-innerWidth/2)/s,cz+(e.clientY-innerHeight/2)/s)});
 fallback.addEventListener("wheel",e=>{zoom=clamp(zoom+(e.deltaY<0?.1:-.1),.65,1.8);e.preventDefault()},{passive:false});
 addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(["w","a","s","d","q","e","shift","n","p","l","r"," "].includes(k))e.preventDefault();keys.add(k);if(k==="e")interact();if(k==="n")advance(60);if(k==="p")save();if(k==="l")load();if(k==="r"&&!paused)reset()});
 addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
 $("hour").onclick=()=>{if(!paused)advance(60)};$("save").onclick=save;$("load").onclick=load;
 let fallbackLast=performance.now();
 function fallbackTick(now){const dt=Math.min(.05,(now-fallbackLast)/1000);fallbackLast=now;move(dt);updateNPC(dt);updateVehicles(dt);hud();updateTarget();requestAnimationFrame(fallbackTick)}
 hud();requestAnimationFrame(fallbackTick);requestAnimationFrame(renderFallback);
}
let gl=null,prog=null;
function shader(t,s){
 const x=gl.createShader(t);
 if(!x)throw new Error("WebGL createShader returned null; contextLost="+gl.isContextLost()+"; glError=0x"+gl.getError().toString(16));
 gl.shaderSource(x,s);gl.compileShader(x);
 if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(x)||"(shader compiler returned an empty log)";throw new Error("Shader "+(t===gl.VERTEX_SHADER?"VERTEX":"FRAGMENT")+" compile failed: "+log+"; source="+s)}
 return x;
}
try{
 gl=canvas.getContext("webgl",{antialias:true,alpha:false})||canvas.getContext("experimental-webgl");
 if(!gl)throw new Error("Trình duyệt không cấp phát được WebGL context.");
 const vs=`attribute vec3 aPos;attribute vec3 aNor;uniform mat4 uMVP;uniform mat4 uModel;varying vec3 vNor;void main(){vec4 w=uModel*vec4(aPos,1.0);vNor=normalize(mat3(uModel)*aNor);gl_Position=uMVP*w;}`;
 const fs=`precision mediump float;uniform vec3 uColor;uniform vec3 uLight;uniform float uNight;varying vec3 vNor;void main(){float d=max(dot(normalize(vNor),normalize(uLight)),0.0);vec3 c=uColor*(0.62+0.38*d);c*=mix(1.0,0.68,uNight);gl_FragColor=vec4(c,1.0);}`;
 prog=gl.createProgram();if(!prog)throw new Error("WebGL createProgram returned null; glError=0x"+gl.getError().toString(16));
 gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error("Program link failed: "+(gl.getProgramInfoLog(prog)||"empty log"));
 gl.useProgram(prog);
}catch(err){startFallback(err);return;}
const aPos=gl.getAttribLocation(prog,"aPos"),aNor=gl.getAttribLocation(prog,"aNor"),uMVP=gl.getUniformLocation(prog,"uMVP"),uModel=gl.getUniformLocation(prog,"uModel"),uColor=gl.getUniformLocation(prog,"uColor"),uLight=gl.getUniformLocation(prog,"uLight"),uNight=gl.getUniformLocation(prog,"uNight");
const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],mul=(a,b)=>{let o=Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
function tr(x,y,z){let m=I();m[12]=x;m[13]=y;m[14]=z;return m}function sc(x,y,z){let m=I();m[0]=x;m[5]=y;m[10]=z;return m}function ry(a){let c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}function rx(a){let c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
function model(x,y,z,sx,sy,sz,yaw=0,pitch=0){return mul(mul(mul(tr(x,y,z),ry(yaw)),rx(pitch)),sc(sx,sy,sz))}function persp(f,asp,n,far){let t=1/Math.tan(f/2),nf=1/(n-far);return[t/asp,0,0,0,0,t,0,0,0,0,(far+n)*nf,-1,0,0,2*far*n*nf,0]}
function lookAt(e,t){let f=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],fl=Math.hypot(...f);f=f.map(v=>v/fl);let up=[0,1,0],s=[f[1]*up[2]-f[2]*up[1],f[2]*up[0]-f[0]*up[2],f[0]*up[1]-f[1]*up[0]],sl=Math.hypot(...s);s=s.map(v=>v/sl);let u=[s[1]*f[2]-s[2]*f[1],s[2]*f[0]-s[0]*f[2],s[0]*f[1]-s[1]*f[0]];return[s[0],u[0],-f[0],0,s[1],u[1],-f[1],0,s[2],u[2],-f[2],0,-(s[0]*e[0]+s[1]*e[1]+s[2]*e[2]),-(u[0]*e[0]+u[1]*e[1]+u[2]*e[2]),f[0]*e[0]+f[1]*e[1]+f[2]*e[2],1]}
function cubeData(){let f=[[[ -1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]],[[-1,-1,1],[-1,1,1],[1,1,1],[1,-1,1]],[[-1,-1,-1],[-1,1,-1],[-1,1,1],[-1,-1,1]],[[1,-1,-1],[1,-1,1],[1,1,1],[1,1,-1]],[[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]],[[-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1]]],ns=[[0,0,-1],[0,0,1],[-1,0,0],[1,0,0],[0,1,0],[0,-1,0]],v=[],i=[];for(let k=0;k<6;k++){let b=k*4;for(let p of f[k])v.push(...p,...ns[k]);i.push(b,b+1,b+2,b,b+2,b+3)}return{v:new Float32Array(v),i:new Uint16Array(i)}}
const cd=cubeData(),vb=gl.createBuffer(),ib=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,cd.v,gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cd.i,gl.STATIC_DRAW);
function sphereData(lat=12,lon=16){const v=[],idx=[];for(let y=0;y<=lat;y++){const a=y*Math.PI/lat,sy=Math.cos(a),r=Math.sin(a);for(let x=0;x<=lon;x++){const b=x*2*Math.PI/lon,nx=r*Math.cos(b),nz=r*Math.sin(b);v.push(nx,sy,nz,nx,sy,nz)}}for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;idx.push(a,b,a+1,b,b+1,a+1)}return{v:new Float32Array(v),i:new Uint16Array(idx)}}
const sd=sphereData(),svb=gl.createBuffer(),sib=gl.createBuffer();
gl.enableVertexAttribArray(aPos);gl.enableVertexAttribArray(aNor);gl.enable(gl.DEPTH_TEST);
function bindMesh(vbuf,ibuf){gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibuf);gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(aNor,3,gl.FLOAT,false,24,12)}
bindMesh(vb,ib);gl.bufferData(gl.ARRAY_BUFFER,cd.v,gl.STATIC_DRAW);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cd.i,gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER,svb);gl.bufferData(gl.ARRAY_BUFFER,sd.v,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,sib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,sd.i,gl.STATIC_DRAW);
bindMesh(vb,ib);
function uniforms(m,c){gl.uniformMatrix4fv(uModel,false,new Float32Array(m));gl.uniformMatrix4fv(uMVP,false,new Float32Array(mul(VP,m)));gl.uniform3fv(uColor,new Float32Array(c))}
function draw(x,y,z,sx,sy,sz,c,yaw=0,pitch=0){bindMesh(vb,ib);const m=model(x,y,z,sx,sy,sz,yaw,pitch);uniforms(m,c);gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0)}
function ellipsoid(x,y,z,sx,sy,sz,c,yaw=0,pitch=0){bindMesh(svb,sib);const m=model(x,y,z,sx,sy,sz,yaw,pitch);uniforms(m,c);gl.drawElements(gl.TRIANGLES,sd.i.length,gl.UNSIGNED_SHORT,0)}
function local(n,ox,oy,oz){let s=Math.sin(n.yaw),c=Math.cos(n.yaw),k=n.visualScale||1;return{x:n.x+(c*ox+s*oz)*k,y:oy*k,z:n.z+(-s*ox+c*oz)*k}}function part(n,ox,oy,oz,sx,sy,sz,c,p=0){let q=local(n,ox,oy,oz);draw(q.x,q.y,q.z,sx,sy,sz,c,n.yaw,p)}
function person(n,type){
 const a=n.appearance||{},isLinh=type==="linh",isMinh=type==="player";
 const skin=a.skin||(isLinh?[.91,.73,.63]:[.78,.57,.44]),hair=a.hair||(isLinh?[.80,.84,.88]:[.035,.045,.06]);
 const shirt=a.top||(isLinh?[.66,.78,.88]:[.12,.16,.22]),pants=a.bottom||(isLinh?[.16,.23,.34]:[.09,.11,.14]),shoe=a.shoe||[.08,.09,.10],h=a.height||1;
 const phase=n.phase||0,cycle=anim*7.4+phase,walk=n.walk||0;
 const stride=Math.sin(cycle)*.30*walk,armSwing=Math.sin(cycle+Math.PI)*.25*walk,bob=Math.abs(Math.sin(cycle))*.035*walk+Math.sin(anim*2.2+phase)*.012;
 const visualScale=n.visualScale||1;const P=(x,y,z,sx,sy,sz,c,yaw=0,pitch=0)=>{const q=local(n,x,y+bob,z);ellipsoid(q.x,q.y,q.z,sx*visualScale,sy*visualScale,sz*visualScale,c,n.yaw+yaw,pitch)};
 const limbPart=(a0,b0,r,c)=>{const A=local(n,a0[0],a0[1]+bob,a0[2]),B=local(n,b0[0],b0[1]+bob,b0[2]),dx=B.x-A.x,dy=B.y-A.y,dz=B.z-A.z,len=Math.hypot(dx,dy,dz),yaw=Math.atan2(dx,dz),pitch=Math.atan2(Math.hypot(dx,dz),dy);ellipsoid((A.x+B.x)/2,(A.y+B.y)/2,(A.z+B.z)/2,r*visualScale,len*.57*visualScale,r*visualScale,c,yaw,pitch)};
 P(0,.83*h,0,.255,.20*h,.17,pants);
 P(0,1.12*h,0,.30,.36*h,.19,shirt);
 P(0,1.34*h,-.005,.255,.13*h,.18,shirt);
 P(0,1.48*h,0,.095,.15*h,.095,skin);
 P(0,1.76*h,.005,.205,.255*h,.19,skin);
 P(-.205,1.76*h,0,.042,.068,.045,skin);P(.205,1.76*h,0,.042,.068,.045,skin);
 P(0,1.965*h,-.025,.218,.125*h,.205,hair);P(0,1.80*h,-.155,.205,.235*h,.075,hair);
 if(isLinh||a.style==="long"){
  P(-.185,1.63*h,-.065,.065,.37*h,.085,hair,-.06);P(.185,1.63*h,-.065,.065,.37*h,.085,hair,.06);
  P(-.12,1.96*h,.105,.095,.115,.075,hair,-.28);P(.015,1.99*h,.13,.10,.12,.075,hair,.04);P(.14,1.96*h,.105,.09,.11,.07,hair,.28);
 }else{
  P(-.15,1.98*h,.08,.105,.075,.10,hair,-.25);P(-.025,2.015*h,.10,.12,.065,.10,hair,.04);P(.105,1.985*h,.08,.10,.075,.09,hair,.25);P(.19,1.91*h,-.015,.06,.12,.09,hair,.2);
 }
 for(const side of [-1,1]){
  P(side*.078,1.79*h,.179,.047,.033,.018,[.94,.92,.86]);P(side*.078,1.79*h,.196,.018,.022,.009,[.24,.31,.34]);
  P(side*.078,1.79*h,.204,.009,.013,.006,[.035,.045,.05]);P(side*.078,1.835*h,.187,.052,.012,.012,hair,side*-.08);
 }
 P(0,1.715*h,.198,.027,.045,.025,skin);P(0,1.645*h,.185,.047,.012,.012,isLinh?[.57,.25,.31]:[.40,.20,.18]);
 if(isLinh){P(-.125,1.70*h,.169,.035,.018,.012,[.82,.55,.55]);P(.125,1.70*h,.169,.035,.018,.012,[.82,.55,.55]);}
 if(isMinh){
  P(-.095,1.38*h,.16,.075,.105,.035,[.24,.29,.34],-.18);P(.095,1.38*h,.16,.075,.105,.035,[.24,.29,.34],.18);
  P(-.125,1.12*h,.185,.018,.25*h,.012,[.34,.39,.43]);P(.125,1.12*h,.185,.018,.25*h,.012,[.34,.39,.43]);
  for(const y of [1.22,1.08,.94])P(.015,y*h,.195,.012,.012,.009,[.78,.76,.67]);
  P(-.17,1.12*h,.17,.07,.075,.018,[.18,.23,.28]);
 }else if(isLinh){
  P(-.10,1.40*h,.12,.10,.075,.035,[.88,.91,.93],-.24);P(.10,1.40*h,.12,.10,.075,.035,[.88,.91,.93],.24);
  P(0,.91*h,.177,.13,.055,.018,[.54,.67,.79]);P(-.19,1.12*h,.11,.018,.20*h,.012,[.82,.87,.91]);P(.19,1.12*h,.11,.018,.20*h,.012,[.82,.87,.91]);
 }else{P(-.10,1.39*h,.15,.075,.075,.025,[.84,.82,.76]);P(.10,1.39*h,.15,.075,.025,[.84,.82,.76]);}
 for(const side of [-1,1]){
  const swing=armSwing*side,shoulder=[side*.285,1.34*h,0],elbow=[side*(.36+Math.abs(swing)*.08),1.02*h,swing*.36],wrist=[side*(.39+Math.abs(swing)*.12),.78*h,swing*.72],hand=[wrist[0],.69*h,wrist[2]+.025];
  limbPart(shoulder,elbow,.095,shirt);P(...elbow,.096,.095,.096,shirt);limbPart(elbow,wrist,.071,shirt);P(...wrist,.067,.07,.067,skin);limbPart(wrist,hand,.055,skin);
  P(hand[0],hand[1]+.055,hand[2],.075,.035,.075,isMinh?[.30,.34,.38]:isLinh?[.88,.90,.91]:shirt);
 }
 for(const side of [-1,1]){
  const phaseStep=stride*side,hip=[side*.125,.78*h,0],knee=[side*.135,.43*h,Math.max(0,phaseStep)*.52],ankle=[side*.14,.105*h,phaseStep],foot=[side*.14,.075*h,phaseStep+.085];
  limbPart(hip,knee,.115,pants);P(...knee,.115,.12,.115,pants);limbPart(knee,ankle,.082,pants);P(...ankle,.082,.085,.082,shoe);
  P(foot[0],foot[1]-.015,foot[2],.115,.065,.205,shoe);P(foot[0],foot[1]-.065,foot[2]+.012,.12,.018,.205,[.72,.72,.68]);
 }
 if(isMinh)P(.205,1.34*h,-.01,.035,.065,.035,[.16,.19,.22]);
 if(isLinh)P(.205,1.68*h,-.015,.035,.055,.035,[.72,.78,.84]);
}
function resize(){let d=Math.min(devicePixelRatio||1,2),w=Math.floor(innerWidth*d),h=Math.floor(innerHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}}
function project(x,y,z){let a=[x,y,z,1],r=[0,0,0,0];for(let c=0;c<4;c++)for(let rr=0;rr<4;rr++)r[c]+=VP[c*4+rr]*a[rr];if(r[3]<=0)return null;return{x:(r[0]/r[3]*.5+.5)*innerWidth,y:(-.5*r[1]/r[3]+.5)*innerHeight}}
function renderLabels(){
 labels.innerHTML="";
 const add=(x,y,z,name,kind)=>{const q=project(x,y,z);if(!q||q.x<-80||q.x>innerWidth+80||q.y<-30||q.y>innerHeight+30)return;const e=document.createElement("div");e.className="label";e.textContent=name;e.style.left=q.x+"px";e.style.top=q.y+"px";e.style.borderColor=kind==="main"?"#8ed7ff":"#ffffff20";e.style.background=kind==="main"?"#092337eF":"#071018d9";e.style.fontWeight=kind==="main"?"800":"500";labels.appendChild(e)};
 for(const p of locations)add(p.x,p.kind==="park"?1:p.h+.7,p.z,p.name,"place");
 add(player.x,2.42*(player.visualScale||1),player.z,"Minh · Bạn","main");
 add(linh.x,2.42*(linh.visualScale||1),linh.z,"Linh","main");
 for(const n of npcs)add(n.x,2.35*(n.visualScale||1),n.z,n.name,"npc");
}
let VP=I();
function render(){resize();anim=performance.now()/1000;gl.viewport(0,0,canvas.width,canvas.height);let h=state.min/1440,night=h<.25||h>.78?1:0;gl.clearColor(.48-.15*night,.64-.17*night,.82-.20*night,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);let cp=Math.cos(camPitch),sp=Math.sin(camPitch),cy=Math.cos(camYaw),sy=Math.sin(camYaw),cam=[player.x+sy*camDist*cp,2.8+camDist*sp,player.z+cy*camDist*cp];VP=mul(persp(1.05,canvas.width/canvas.height,.1,160),lookAt(cam,[player.x,.8,player.z]));gl.uniform3fv(uLight,new Float32Array([-.45,1,.35]));gl.uniform1f(uNight,night);street();locations.forEach(building);parkProps();for(let v of vehicles)vehicle(v);npcs.forEach(n=>person(n,"npc"));person(linh,"linh");person(player,"player");renderLabels();requestAnimationFrame(render)}
function targetTo(x,z){destination={x,z};player.yaw=Math.atan2(x-player.x,z-player.z)}
function blocked(x,z){for(let p of locations){if(p.kind==="park")continue;let hw=p.w/2+.5,hd=p.d/2+.5;if(x>p.x-hw&&x<p.x+hw&&z>p.z-hd&&z<p.z+hd)return true}return false}
function move(dt){if(paused){player.walk=0;return}let f=(keys.has("w")?1:0)-(keys.has("s")?1:0),str=(keys.has("q")?1:0)-(keys.has("e")?1:0);if(keys.has("a"))player.yaw+=dt*1.9;if(keys.has("d"))player.yaw-=dt*1.9;let sp=(keys.has("shift")?7:4.2)*dt;if(destination&&!f&&!str){let dx=destination.x-player.x,dz=destination.z-player.z,d=Math.hypot(dx,dz);if(d>.7){player.yaw=Math.atan2(dx,dz);f=1}else destination=null}let nx=player.x+Math.sin(player.yaw)*f*sp+Math.cos(player.yaw)*str*sp,nz=player.z+Math.cos(player.yaw)*f*sp-Math.sin(player.yaw)*str*sp;if(!blocked(nx,nz)){player.x=clamp(nx,-38,38);player.z=clamp(nz,-30,30)}player.walk=Math.min(1,Math.hypot(f,str))}
function updateNPC(dt){
 if(paused){npcs.forEach(n=>n.walk=0);linh.walk=0;return}
 const hour=state.min/60,actors=[linh,...npcs];
 actors.forEach((n,i)=>{
  const target=CharacterSystem.targetFor(n,locations,state.day,hour);if(!target)return;
  const spread=i===0?0:((i%3)-1)*1.25;
  const tx=target.x+spread,tz=target.z+((i%2)?1.1:-1.1),dx=tx-n.x,dz=tz-n.z,d=Math.hypot(dx,dz);
  n.walk=d>1.4?1:0;
  if(d>1.4){const speed=(n.speed||.55)*(n.mood==="tired"?.68:1);n.x+=dx/d*speed*dt;n.z+=dz/d*speed*dt;n.yaw=Math.atan2(dx,dz);}
  n.currentActivity=target.activity;
 });
}
function updateVehicles(dt){for(let v of vehicles){v.x+=v.dir*v.speed*dt;if(v.x>38)v.x=-38;if(v.x<-38)v.x=38}}
function updateTarget(){let n=nearPerson(),p=nearLocation();if(n){targetEl.style.display="block";targetEl.textContent=`${n.name} · E / Click để nói chuyện`}else if(p){targetEl.style.display="block";targetEl.textContent=`${p.name} · E / Click để tương tác`}else targetEl.style.display="none"}
function tick(now){let dt=Math.min(.05,(now-last)/1000);last=now;move(dt);updateNPC(dt);updateVehicles(dt);hud();updateTarget();requestAnimationFrame(tick)}
function clickWorld(e){if(paused)return;let best=null,bd=55;for(let n of [linh,...npcs]){let q=project(n.x,1.25,n.z);if(q){let d=Math.hypot(q.x-e.clientX,q.y-e.clientY);if(d<bd){bd=d;best=n}}}if(best)return targetTo(best.x,best.z),toast(`Đang đi tới ${best.name}.`);for(let p of locations){let q=project(p.x,p.h+.5,p.z);if(q&&Math.hypot(q.x-e.clientX,q.y-e.clientY)<90)return targetTo(p.x,p.z+(p.d/2+2)),toast(`Đang đi tới ${p.name}.`)} }
canvas.addEventListener("mousedown",e=>{dragging=true;movedMouse=false;lastMouse={x:e.clientX,y:e.clientY};canvas.classList.add("drag")});addEventListener("mouseup",()=>{dragging=false;canvas.classList.remove("drag")});addEventListener("mousemove",e=>{if(!dragging||paused)return;let dx=e.clientX-lastMouse.x,dy=e.clientY-lastMouse.y;if(Math.abs(dx)+Math.abs(dy)>2)movedMouse=true;camYaw+=dx*.006;camPitch=clamp(camPitch-dy*.004,.22,.68);lastMouse={x:e.clientX,y:e.clientY}});canvas.addEventListener("click",e=>{if(!movedMouse)clickWorld(e)});canvas.addEventListener("wheel",e=>{camDist=clamp(camDist+e.deltaY*.008,6,15)});
addEventListener("keydown",e=>{let k=e.key.toLowerCase();if(["w","a","s","d","q","e","shift","n","p","l","r"," "].includes(k))e.preventDefault();keys.add(k);if(k==="e")interact();if(k==="n")advance(60);if(k==="p")save();if(k==="l")load();if(k==="r"&&!paused)reset();if(k===" "&&!paused){camYaw=player.yaw+.65;toast("Camera bám theo Minh.")}});addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
$("hour").onclick=()=>{if(!paused)advance(60)};$("save").onclick=save;$("load").onclick=load;setInterval(()=>{let p=nearLocation();panel.style.display=p?"block":"none";if(p){panelTitle.textContent=p.name;panelBody.textContent=p.info}},250);
function boot(){hud();requestAnimationFrame(render);requestAnimationFrame(tick)}try{boot()}catch(e){showFatalError(e)}})();