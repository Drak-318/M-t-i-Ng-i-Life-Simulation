(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("world"),clock=$("clock"),locEl=$("loc"),moneyEl=$("money"),energyEl=$("energy"),stressEl=$("stress"),relEl=$("rel"),targetEl=$("target"),labels=$("labels"),modal=$("modal"),meta=$("meta"),story=$("story"),choices=$("choices"),toastEl=$("toast"),panel=$("panel"),panelTitle=$("panelTitle"),panelBody=$("panelBody"),errorEl=$("error"),errorText=$("errorText");
const DAYS=["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"],SAVE="mot-doi-nguoi-web3d-v5";
let state={day:1,min:462,money:15000000,energy:82,stress:18,confidence:52,trust:0,affection:0,understanding:0,closeness:0,respect:0,hurt:0,memories:[],done:[]};
let player={x:-24,z:14,yaw:0,walk:0},destination=null,paused=false,last=performance.now(),anim=0;
const keys=new Set();let dragging=false,movedMouse=false,lastMouse={x:0,y:0},camYaw=.65,camPitch=.48,camDist=10;
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
const npcs=Array.from({length:12},(_,i)=>({...CharacterSystem.createBackgroundCharacter(i),x:-31+(i*11)%62,z:-26+(i*17)%52,yaw:0,goal:["office","cafe","park","shop"][i%4],role:["đi làm","đi cà phê","đi dạo","mua đồ"][i%4],walk:0}));
const linh={...CharacterSystem.createLinh(),x:-20,z:-15,yaw:2.2,speed:.18,phase:4.1,goal:"cafe",role:"công việc riêng",walk:0};
player.appearance={skin:[.78,.58,.46],hair:[.045,.05,.06],top:[.10,.12,.14],bottom:[.07,.08,.09],shoe:[.08,.09,.10],style:"short",height:1};
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
const gl=canvas.getContext("webgl",{antialias:true,alpha:false});if(!gl)throw Error("Trình duyệt không hỗ trợ WebGL.");
const vs=`attribute vec3 aPos;attribute vec3 aNor;uniform mat4 uMVP;uniform mat4 uModel;varying vec3 vNor;void main(){vec4 w=uModel*vec4(aPos,1.);vNor=mat3(uModel)*aNor;gl_Position=uMVP*w}`;
const fs=`precision mediump float;uniform vec3 uColor;uniform vec3 uLight;uniform float uNight;varying vec3 vNor;void main(){float d=max(dot(normalize(vNor),normalize(uLight)),0.);vec3 c=uColor*(.42+.58*d);c*=mix(1.,.55,uNight);gl_FragColor=vec4(c,1.)}`;
function shader(t,s){let x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(x));return x}
const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
const aPos=gl.getAttribLocation(prog,"aPos"),aNor=gl.getAttribLocation(prog,"aNor"),uMVP=gl.getUniformLocation(prog,"uMVP"),uModel=gl.getUniformLocation(prog,"uModel"),uColor=gl.getUniformLocation(prog,"uColor"),uLight=gl.getUniformLocation(prog,"uLight"),uNight=gl.getUniformLocation(prog,"uNight");
const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],mul=(a,b)=>{let o=Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o};
function tr(x,y,z){let m=I();m[12]=x;m[13]=y;m[14]=z;return m}function sc(x,y,z){let m=I();m[0]=x;m[5]=y;m[10]=z;return m}function ry(a){let c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}function rx(a){let c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
function model(x,y,z,sx,sy,sz,yaw=0,pitch=0){return mul(mul(mul(tr(x,y,z),ry(yaw)),rx(pitch)),sc(sx,sy,sz))}function persp(f,asp,n,far){let t=1/Math.tan(f/2),nf=1/(n-far);return[t/asp,0,0,0,0,t,0,0,0,0,(far+n)*nf,-1,0,0,2*far*n*nf,0]}
function lookAt(e,t){let f=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],fl=Math.hypot(...f);f=f.map(v=>v/fl);let up=[0,1,0],s=[f[1]*up[2]-f[2]*up[1],f[2]*up[0]-f[0]*up[2],f[0]*up[1]-f[1]*up[0]],sl=Math.hypot(...s);s=s.map(v=>v/sl);let u=[s[1]*f[2]-s[2]*f[1],s[2]*f[0]-s[0]*f[2],s[0]*f[1]-s[1]*f[0]];return[s[0],u[0],-f[0],0,s[1],u[1],-f[1],0,s[2],u[2],-f[2],0,-(s[0]*e[0]+s[1]*e[1]+s[2]*e[2]),-(u[0]*e[0]+u[1]*e[1]+u[2]*e[2]),f[0]*e[0]+f[1]*e[1]+f[2]*e[2],1]}
function cubeData(){let f=[[[ -1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]],[[-1,-1,1],[-1,1,1],[1,1,1],[1,-1,1]],[[-1,-1,-1],[-1,1,-1],[-1,1,1],[-1,-1,1]],[[1,-1,-1],[1,-1,1],[1,1,1],[1,1,-1]],[[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]],[[-1,-1,-1],[-1,-1,1],[1,-1,1],[1,-1,-1]]],ns=[[0,0,-1],[0,0,1],[-1,0,0],[1,0,0],[0,1,0],[0,-1,0]],v=[],i=[];for(let k=0;k<6;k++){let b=k*4;for(let p of f[k])v.push(...p,...ns[k]);i.push(b,b+1,b+2,b,b+2,b+3)}return{v:new Float32Array(v),i:new Uint16Array(i)}}
const cd=cubeData(),vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,cd.v,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cd.i,gl.STATIC_DRAW);gl.enableVertexAttribArray(aPos);gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(aNor);gl.vertexAttribPointer(aNor,3,gl.FLOAT,false,24,12);gl.enable(gl.DEPTH_TEST);
function draw(x,y,z,sx,sy,sz,c,yaw=0,pitch=0){let m=model(x,y,z,sx,sy,sz,yaw,pitch);gl.uniformMatrix4fv(uModel,false,new Float32Array(m));gl.uniformMatrix4fv(uMVP,false,new Float32Array(mul(VP,m)));gl.uniform3fv(uColor,new Float32Array(c));gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0)}
function local(n,ox,oy,oz){let s=Math.sin(n.yaw),c=Math.cos(n.yaw);return{x:n.x+c*ox+s*oz,y:oy,z:n.z-s*ox+c*oz}}function part(n,ox,oy,oz,sx,sy,sz,c,p=0){let q=local(n,ox,oy,oz);draw(q.x,q.y,q.z,sx,sy,sz,c,n.yaw,p)}
function person(n,type){
 const a=n.appearance||{},L=type==="linh",skin=a.skin||(L?[.92,.78,.68]:[.78,.58,.46]),hair=a.hair||(L?[.82,.86,.92]:[.045,.05,.06]),top=a.top||(L?[.91,.94,.96]:[.10,.12,.14]),bottom=a.bottom||(L?[.10,.14,.22]:[.07,.08,.09]),shoe=a.shoe||[.08,.09,.10],h=a.height||1,step=Math.sin(anim*8+(n.phase||0))*.28*(n.walk||0);
 part(n,0,.98*h,0,.28,.38*h,.20,top);part(n,0,.67*h,0,.31,.13,.19,top);
 part(n,-.15,.35*h,step*.15,.12,.36*h,.12,bottom,step);part(n,.15,.35*h,-step*.15,.12,.36*h,.12,bottom,-step);
 part(n,-.39,.1*h+1.02*h,-step*.12,.09,.34*h,.10,top,-step*.8);part(n,.39,1.02*h+step*.12,step*.12,.09,.34*h,.10,top,step*.8);
 part(n,-.42,.69*h-step*.20,.08,.08,.14,.09,skin);part(n,.42,.69*h+step*.20,.08,.08,.14,.09,skin);
 part(n,0,1.34*h,0,.12,.18,.12,skin);part(n,0,1.69*h,0,.27,.30*h,.25,skin);
 part(n,0,1.96*h,0,.31,.18,.28,hair);part(n,0,2.06*h,-.02,.25,.12,.25,hair);
 const style=a.style||"short";
 if(style==="long"){part(n,-.24,1.72*h,-.01,.11,.48*h,.13,hair,.02);part(n,.24,1.72*h,-.01,.11,.48*h,.13,hair,-.02);part(n,-.20,2.04*h,.12,.08,.14,.09,hair);part(n,.20,2.04*h,.12,.08,.14,.09,hair);}
 else if(style==="tied"){part(n,0,1.75*h,-.27,.13,.30*h,.13,hair);part(n,0,2.10*h,-.02,.18,.08,.18,hair);}
 else{part(n,-.17,2.04*h,.07,.12,.17*h,.12,hair,.05);part(n,.17,2.04*h,.07,.12,.17*h,.12,hair,-.05);}
 part(n,-.09,1.73*h,.235,.025,.035,.025,[.12,.16,.20]);part(n,.09,1.73*h,.235,.025,.035,.025,[.12,.16,.20]);part(n,0,1.64*h,.26,.035,.045,.025,skin);
 part(n,-.13,.08,0,.14,.06,.22,shoe);part(n,.13,.08,0,.14,.06,.22,shoe);
 part(n,0,1.27*h,.205,.13,.055,.025,skin); 
}
function building(p){if(p.kind==="park"){draw(p.x,.04,p.z,p.w/2,.04,p.d/2,p.c);for(let i=-2;i<=2;i++)draw(p.x+i*3,.07,p.z,.12,.02,p.d/2-.5,[.68,.65,.48]);return}draw(p.x,p.h/2,p.z,p.w/2,p.h/2,p.d/2,p.c);draw(p.x,p.h+.16,p.z,p.w/2+.12,.12,p.d/2+.12,[.08,.12,.16]);for(let i=-2;i<=2;i++)for(let j=0;j<2;j++)draw(p.x+i*p.w*.18,p.h*(.55+.18*j),p.z-p.d/2-.04,.45,.34,.06,[.68,.76,.82])}
function tree(x,z){draw(x,.85,z,.16,.85,.16,[.28,.19,.12]);draw(x,1.75,z,.85,.95,.85,[.12,.35,.18]);draw(x,2.35,z,.55,.60,.55,[.16,.42,.20])}
function street(){draw(0,-.03,0,39,.03,31,[.24,.34,.24]);draw(0,.01,0,39,.035,2.9,[.07,.08,.09]);draw(0,.01,0,2.9,.035,31,[.07,.08,.09]);draw(0,.055,3.55,39,.025,.18,[.55,.56,.54]);draw(0,.055,-3.55,39,.025,.18,[.55,.56,.54]);draw(3.55,.055,0,.18,.025,31,[.55,.56,.54]);draw(-3.55,.055,0,.18,.025,31,[.55,.56,.54]);for(let x=-35;x<=35;x+=5)draw(x,.075,0,.9,.018,.035,[.86,.76,.32]);for(let z=-27;z<=27;z+=5)draw(0,.075,z,.035,.018,.9,[.86,.76,.32]);for(let x=-34;x<=34;x+=8){draw(x,.11,7.5,.08,.06,1.6,[.22,.24,.26]);draw(x,.11,-7.5,.08,.06,1.6,[.22,.24,.26])}}
function vehicle(v){draw(v.x,.25,v.z,1.15,.24,.52,v.color);draw(v.x,.55,v.z,.58,.25,.42,[.48,.58,.64]);draw(v.x-.72,.08,v.z-.38,.18,.12,.08,[.05,.05,.05]);draw(v.x+.72,.08,v.z-.38,.18,.12,.08,[.05,.05,.05])}
function parkProps(){for(let x=10;x<=30;x+=5)for(let z=-25;z<=-11;z+=5)tree(x,z);for(let x=12;x<=28;x+=8){draw(x,.18,-15,.9,.12,.25,[.30,.22,.15]);draw(x,.38,-15,.08,.10,.85,[.30,.22,.15])}}
function resize(){let d=Math.min(devicePixelRatio||1,2),w=Math.floor(innerWidth*d),h=Math.floor(innerHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}}
function project(x,y,z){let a=[x,y,z,1],r=[0,0,0,0];for(let c=0;c<4;c++)for(let rr=0;rr<4;rr++)r[c]+=VP[c*4+rr]*a[rr];if(r[3]<=0)return null;return{x:(r[0]/r[3]*.5+.5)*innerWidth,y:(-.5*r[1]/r[3]+.5)*innerHeight}}
function renderLabels(){labels.innerHTML="";for(let p of locations){let q=project(p.x,p.kind==="park"?1:p.h+.7,p.z);if(q&&q.x>-100&&q.x<innerWidth+100&&q.y>-30&&q.y<innerHeight+30){let e=document.createElement("div");e.className="label";e.textContent=p.name;e.style.left=q.x+"px";e.style.top=q.y+"px";labels.appendChild(e)}}}
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
function boot(){hud();requestAnimationFrame(render);requestAnimationFrame(tick)}try{boot()}catch(e){errorEl.style.display="grid";errorText.textContent=e&&e.stack?e.stack:String(e)}})();