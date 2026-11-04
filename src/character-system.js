(function(root){
"use strict";
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
const PALETTES=[
 {skin:[.78,.57,.44],hair:[.10,.07,.06],top:[.22,.39,.48],bottom:[.12,.16,.20],shoe:[.08,.09,.10],style:"short"},
 {skin:[.91,.72,.60],hair:[.18,.12,.09],top:[.68,.35,.30],bottom:[.16,.19,.27],shoe:[.12,.12,.14],style:"long"},
 {skin:[.68,.48,.36],hair:[.07,.06,.05],top:[.35,.43,.34],bottom:[.18,.18,.17],shoe:[.09,.09,.08],style:"short"},
 {skin:[.88,.68,.55],hair:[.27,.18,.12],top:[.68,.58,.36],bottom:[.20,.23,.29],shoe:[.14,.13,.12],style:"tied"},
 {skin:[.76,.54,.42],hair:[.12,.09,.08],top:[.36,.34,.52],bottom:[.13,.16,.24],shoe:[.10,.10,.12],style:"short"},
 {skin:[.93,.76,.65],hair:[.25,.16,.10],top:[.45,.55,.68],bottom:[.18,.20,.24],shoe:[.12,.12,.13],style:"long"}
];
const LINH={
 id:"linh",name:"Linh",age:24,occupation:"Nhân viên thiết kế nội dung",home:"home",
 personality:{introversion:.55,directness:.45,independence:.75,patience:.70,emotionality:.65},
 needs:{respect:.90,space:.75,attention:.55,stability:.70,safety:.78},
 boundaries:["Không thích bị thúc ép trả lời","Không thích bị kiểm soát lịch trình","Cần được tôn trọng không gian riêng"],
 communication:{text:.75,direct:.65,shortReplies:.35,needsThinking:.75},
 hiddenPreferences:["coi trọng hành động nhỏ","nhớ những lời hứa được giữ","không thích bị hỏi dồn khi mệt"],
 goals:["ổn định công việc","dành thời gian cho gia đình","xây dựng cuộc sống cân bằng"],
 schedule:{
  1:[{from:8,to:17,location:"office",activity:"làm việc"},{from:18,to:21,location:"cafe",activity:"gặp bạn hoặc làm việc cá nhân"}],
  2:[{from:8,to:17,location:"office",activity:"làm việc"},{from:18,to:21,location:"home",activity:"nghỉ ngơi"}],
  3:[{from:8,to:17,location:"office",activity:"làm việc"},{from:18,to:21,location:"cafe",activity:"ngồi quán quen"}],
  4:[{from:8,to:17,location:"office",activity:"làm việc"},{from:18,to:21,location:"home",activity:"dành thời gian riêng"}],
  5:[{from:8,to:17,location:"office",activity:"làm việc"},{from:18,to:22,location:"cafe",activity:"gặp bạn"}],
  6:[{from:9,to:12,location:"shop",activity:"mua đồ cá nhân"},{from:15,to:20,location:"park",activity:"đi dạo"}],
  7:[{from:9,to:12,location:"cafe",activity:"uống cà phê"},{from:15,to:18,location:"park",activity:"đi dạo"}]
 },
 appearance:{...PALETTES[1],style:"long",height:1.0},
 mood:"calm",energy:82,workload:25,familyPressure:15,socialEnergy:58,emotionalAvailability:.65,
 independentGoal:"giữ cân bằng giữa công việc và cuộc sống",relationship:{affection:0,trust:0,understanding:0,closeness:0,respect:0,hurt:0,irritation:0,compatibility:50,willingness_to_continue:50},
 memories:[],currentActivity:"đang bắt đầu ngày mới",lastAction:"",lastDecisionDay:0,position:{x:-20,z:-15}
};
const NAMES=["Huy","Mai","Tuấn","Vy","Nam","An","Phương","Duy","Trang","Khoa","Thảo","Long"];
const JOBS=["Nhân viên kinh doanh","Nhân viên kế toán","Thiết kế đồ họa","Lập trình viên","Nhân viên bán hàng","Giáo viên","Chuyên viên nhân sự","Nhiếp ảnh tự do","Nhân viên văn phòng","Đầu bếp","Nhân viên truyền thông","Kỹ thuật viên"];
const GOALS=["tiết kiệm cho kế hoạch riêng","phát triển công việc","dành thời gian cho gia đình","duy trì sức khỏe","học thêm một kỹ năng","mở rộng các mối quan hệ"];
function scheduleFor(i){
 const work=8+(i%3),end=16+(i%2),office=["office","shop","cafe"][i%3],after=["home","cafe","park","shop"][i%4],out={};
 for(let d=1;d<=7;d++)out[d]=d<=5?[{from:work,to:end,location:office,activity:"đi làm"},{from:17,to:20,location:after,activity:after==="home"?"nghỉ ngơi":"giải quyết việc riêng"}]:[{from:9,to:12,location:after,activity:"việc cá nhân"},{from:15,to:19,location:["park","cafe","shop","home"][i%4],activity:"thời gian cuối tuần"}];
 return out;
}
function createCharacter(data){const p=JSON.parse(JSON.stringify(data));p.relationship=p.relationship||{affection:0,trust:0,understanding:0,closeness:0,respect:0,hurt:0,irritation:0,compatibility:50,willingness_to_continue:50};p.memories=p.memories||[];p.position=p.position||{x:0,z:0};p.emotionalAvailability=p.emotionalAvailability??.65;return p;}
function createBackgroundCharacter(i){
 const palette=PALETTES[i%PALETTES.length];
 return createCharacter({id:"npc"+i,name:NAMES[i],age:22+(i*3)%15,occupation:JOBS[i],home:"home",
 personality:{introversion:.2+((i*17)%65)/100,directness:.25+((i*13)%65)/100,independence:.35+((i*11)%60)/100,patience:.3+((i*19)%60)/100,emotionality:.25+((i*23)%65)/100},
 needs:{respect:.5+((i*7)%45)/100,space:.3+((i*9)%60)/100,attention:.3+((i*5)%60)/100,stability:.4+((i*3)%50)/100,safety:.55},
 boundaries:["Không thích bị nói chuyện thiếu tôn trọng","Không muốn bị làm phiền khi đang bận"],
 communication:{text:.35+((i*7)%60)/100,direct:.4+((i*9)%55)/100,shortReplies:.25+((i*3)%65)/100,needsThinking:.2+((i*11)%65)/100},
 hiddenPreferences:["có nhịp sống riêng","đánh giá cao sự đúng hẹn"],goals:[GOALS[i%GOALS.length],GOALS[(i+2)%GOALS.length]],
 schedule:scheduleFor(i),appearance:{...palette,height:.94+(i%4)*.035},mood:["calm","focused","cheerful","tired"][i%4],
 energy:62+(i*7)%34,workload:15+(i*11)%55,familyPressure:8+(i*13)%35,socialEnergy:45+(i*9)%45,emotionalAvailability:.6,
 independentGoal:GOALS[i%GOALS.length],relationship:{affection:0,trust:0,understanding:0,closeness:0,respect:0,hurt:0,irritation:0,compatibility:50,willingness_to_continue:50},
 memories:[],position:{x:-31+(i*11)%62,z:-26+(i*17)%52},speed:.45+(i%4)*.08,phase:i*1.7});
}
function createLinh(){return createCharacter({...LINH,appearance:{...LINH.appearance}});}
function scheduleEntry(c,day,hour){const entries=(c.schedule&&c.schedule[String(day)])||[];return entries.find(x=>hour>=x.from&&hour<x.to)||{from:0,to:24,location:c.home||"home",activity:"ở nhà và giải quyết việc riêng"};}
function tick(c,minutes,day,hour){
 const entry=scheduleEntry(c,day,hour),work=entry.activity.includes("làm việc")||entry.activity.includes("đi làm");c.currentActivity=entry.activity;
 if(work){c.energy=clamp(c.energy-minutes*.006);c.workload=clamp(c.workload+minutes*.003);}else{c.energy=clamp(c.energy+minutes*.003);c.workload=clamp(c.workload-minutes*.002);}
 c.socialEnergy=clamp(c.socialEnergy+(c.personality.introversion>.6?-.001:.001)*minutes);
 c.emotionalAvailability=clamp((c.energy*.006+c.socialEnergy*.004+(100-c.familyPressure)*.002),0,1);
 if(c.energy<25||c.workload>75)c.mood="tired";else if(c.familyPressure>65)c.mood="worried";else if(c.socialEnergy<22)c.mood="withdrawn";else if(c.relationship&&c.relationship.hurt>35)c.mood="guarded";else if(c.energy>70&&c.socialEnergy>55)c.mood="calm";
 return entry;
}
function targetFor(c,locations,day,hour){
 const entry=scheduleEntry(c,day,hour),p=locations.find(x=>x.id===entry.location)||locations.find(x=>x.id==="home");if(!p)return null;
 const offsets={home:[0,-p.d/2-1.8],office:[-p.w/2-2,-p.d/2-1.8],cafe:[p.w/2+1.8,0],park:[-p.w/2+2,p.d/2-2],shop:[p.w/2+1.5,0],restaurant:[p.w/2+1.5,0]},o=offsets[p.id]||[2,2];
 return{x:p.x+o[0],z:p.z+o[1],activity:entry.activity,location:entry.location};
}
function record(c,id,day,minute,weight=1){c.memories.push({id,day,minute,weight});if(c.memories.length>80)c.memories.splice(0,c.memories.length-80);c.lastAction=id;c.lastDecisionDay=day;}
function hasMemory(c,id){return c.memories.some(m=>m.id===id);}
function interaction(c,state){
 const r=c.relationship||{},isLinh=c.id==="linh",mood=c.mood||"calm",intro=c.name;let line="";
 if(mood==="tired")line=intro+" có vẻ mệt. "+(isLinh?"Cô ấy":"Người này")+" vẫn dừng lại một chút, nhưng không có nhiều năng lượng cho một cuộc trò chuyện dài.";
 else if(mood==="worried")line=intro+" đang có chuyện phải nghĩ. Câu trả lời có thể ngắn hơn thường ngày.";
 else if(mood==="withdrawn")line=intro+" có vẻ muốn giữ một khoảng riêng hôm nay.";
 else if(mood==="guarded")line=intro+" vẫn lịch sự, nhưng có chút dè dặt từ những chuyện trước đó.";
 else if(hasMemory(c,"player_greeted")||hasMemory(c,"player_shared"))line=intro+" nhận ra Minh. Cuộc trò chuyện tiếp tục từ những lần gặp trước, không phải bắt đầu lại từ đầu.";
 else line=intro+" đang "+(c.currentActivity||"dành thời gian riêng")+". Hai người có một khoảng ngắn để trò chuyện.";
 const choices=[];
 if(mood==="tired"||mood==="withdrawn"){choices.push(["Hỏi thăm ngắn gọn",{trust:1,understanding:2,respect:1,m:"player_checked_in"}],["Để người ấy nghỉ ngơi",{respect:2,irritation:-1,m:"player_respected_space"}],["Tiếp tục hỏi chuyện",{affection:-1,irritation:2,m:"player_pushed_conversation"}]);}
 else{choices.push(["Hỏi về ngày hôm nay",{trust:1,understanding:2,m:"player_asked_day"}],["Chia sẻ một chuyện của Minh",{affection:1,closeness:1,trust:1,m:"player_shared"}],["Rủ gặp vào dịp khác",{affection:1,willingness_to_continue:1,m:"player_suggested_meet"}],["Chào rồi để người ấy tiếp tục việc riêng",{respect:1,m:"player_respected_time"}]);}
 if(r.hurt>20)line+=" Có lẽ người ấy vẫn nhớ một vài chuyện chưa được giải quyết.";
 if(isLinh&&state.stress>65)line+=" Linh nhận ra Minh cũng đang chịu áp lực.";
 return{sceneId:"character_"+c.id,title:c.name,text:line,choices};
}
function applyRelationship(c,e,day,minute){if(!c||!c.relationship)return;const keys=["affection","trust","understanding","closeness","respect","hurt","irritation","compatibility","willingness_to_continue"];for(const k of keys)if(Number.isFinite(e[k]))c.relationship[k]=clamp((c.relationship[k]||0)+e[k]);if(e.m)record(c,e.m,day,minute,1);}
function serialize(chars){return chars.map(c=>({id:c.id,energy:c.energy,workload:c.workload,familyPressure:c.familyPressure,socialEnergy:c.socialEnergy,emotionalAvailability:c.emotionalAvailability,mood:c.mood,currentActivity:c.currentActivity,lastAction:c.lastAction,lastDecisionDay:c.lastDecisionDay,independentGoal:c.independentGoal,relationship:c.relationship,memories:c.memories,position:c.position}));}
function restore(chars,data){if(!Array.isArray(data))return;for(const saved of data){const c=chars.find(x=>x.id===saved.id);if(!c)continue;for(const k of ["energy","workload","familyPressure","socialEnergy","emotionalAvailability","mood","currentActivity","lastAction","lastDecisionDay","independentGoal","relationship","memories","position"])if(saved[k]!==undefined)c[k]=saved[k];}}
root.CharacterSystem={createLinh,createBackgroundCharacter,scheduleEntry,tick,targetFor,record,interaction,applyRelationship,serialize,restore,hasMemory};
})(typeof window!=="undefined"?window:globalThis);
