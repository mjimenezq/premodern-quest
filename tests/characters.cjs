// Run with: node tests/characters.cjs
// Exercise actual game code in an isolated browser stub; never touch real saves.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const html = fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
let source = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('const CHARS'));
const drawing = new Proxy({ measureText:s=>({width:String(s).length*4}), createRadialGradient:()=>({addColorStop(){}}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(960*640*4)}) },{get:(obj,k)=>obj[k] || (()=>{})});
const elements = new Map();
function element(){return { textContent:'',style:{},dataset:{},value:'',hidden:false,classList:{add(){},remove(){},toggle(){}},append(){},appendChild(node){if(node.id)elements.set(node.id,node);},addEventListener(){},setAttribute(){},focus(){},getContext:()=>drawing,getBoundingClientRect:()=>({left:0,top:0,width:960,height:640}),querySelectorAll:()=>[] };}
const storage=new Map();
const sandbox={console,URLSearchParams,TextEncoder,TextDecoder,Uint8Array,Uint8ClampedArray,Buffer,Math:Object.create(Math),Date,performance:{now:()=>0},navigator:{maxTouchPoints:0},location:{hash:'',search:'',href:'http://localhost/',protocol:'http:'},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},matchMedia:()=>({matches:false}),addEventListener(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{body:element(),createElement:()=>element(),querySelectorAll:()=>[],getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);}},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary')};
sandbox.window=sandbox;
source=source.replace(/\}\)\(\);\s*$/, `globalThis.gameTest={CHARS,CUSTOM_CHAR,normalizeCustom,customCharacter,characterOf,newSave,loadSave,saveGame,slotKey,speed,defense,aquaticBonus,loadRoom,checkConnectivity,drawSelect,drawPerson,drawDuel,drawTour,beginDuel,updateDuel,oppPick,startTour,prepRound,updateItems,step,encodeSave,decodeSave,myState,remoteCharacter,FRIEND_LINES,FRIEND_DECK,FRIENDS_ON_MAP,getDef,SOLID,ROOMS,MOUNTS,shopItems,buyItem,mounted,goTo,friendCast,friendCredits,propSolidSet,K,updateWorld,blocked,npcHit,SLOTS,drawSlots,leagueMapMarks,drawWorldMap,BOAT_ROUTES,QUESTS,questHook,questProg,ensureContract,journalEntries,openQuestJournal,drawQuests,ARMOR,SWORDS,HOUSE,PRIZES,GEAR_SLOTS,dayPhase,DAY_PHASE_TICKS,SPELL_LVLS,spellLvl,petLevel,cardMatchXP,tournamentXP,RESPAWN_MS,killEnemy,hiddenSpot,searchHidden,MON,WORLD,DUNGEONS,startArcade,updateArcade,drawArcade,tennisPoint,requestArcadeExit,cancelArcade,drawWorld,drawHUD,changeRoom,setSelectScroll,selectMaxScroll,revealSelected,selectAt,G,PL,wizardDefaults,setS(value){S=value;},getS(){return S;},setFrame(value){frame=value;}};})();`);
vm.runInNewContext(source,sandbox,{timeout:5000});
const g=sandbox.gameTest;
assert(g,'Test interface initialized');
assert.equal(g.slotKey(1),'pmq_save_1');assert.equal(g.slotKey(2),'pmq_save_2');assert.equal(g.slotKey(3),'pmq_save_3');
// Existing players retain their character, progression and inventory in the original slots.
for(let ci=0;ci<12;ci++) {
 const legacy={...g.newSave(ci),slot:1,lvl:30,xp:77,coins:1234567,st:{fue:31,des:22,agi:18,int:27},hp:40,maxHp:42,room:'tolaria',cards:{bolt:3,stp:2,moxd:1},bosses:{siege:true,dread:true},leagues:{vina:true},quests:{q_gob:{done:true}},keys:{'D:minas:1':true},pet:24,dex:{24:true},imp:'existing-session'};
 storage.set('pmq_save_1',JSON.stringify(legacy));const loaded=g.loadSave(1);
 for(const key of ['ch','lvl','xp','coins','st','hp','maxHp','room','cards','bosses','leagues','quests','keys','pet','dex','imp'])assert.equal(JSON.stringify(loaded[key]),JSON.stringify(legacy[key]),'Legacy save changed '+key);
 g.setS(loaded);g.saveGame();assert.equal(JSON.parse(storage.get('pmq_save_1')).coins,1234567);
}
const oldest=g.newSave(3);oldest.lvl=22;storage.delete('pmq_save_1');storage.set('pmq_save',JSON.stringify(oldest));assert.equal(g.loadSave(1).lvl,22);assert(storage.has('pmq_save_1'));
const original=['matias','davis','gucho','klaus','katy','pepe','ivan','tebax','ratui','ruben','tomo','matig'];
assert.deepEqual(Array.from(g.CHARS.slice(0,12),c=>c.id),original);
assert.deepEqual(Array.from(g.CHARS.slice(12,18),c=>c.id),['rai','coco','javier','rodolfo','cahe','pablot']);
for(let ci=0;ci<18;ci++){
 const save=g.newSave(ci);save.slot=1;g.setS(save);g.saveGame();const restored=g.loadSave(1);
 assert.equal(restored.ch,ci);assert.equal(g.characterOf(restored).id,g.CHARS[ci].id);
 g.loadRoom('pueblo',115,100);g.G.sel=ci;g.drawSelect();
 for(const dir of [0,1,2,3])g.drawPerson(0,0,g.CHARS[ci],dir,0);
 if(ci>=12){assert(g.FRIEND_LINES[ci].length);assert(g.FRIEND_DECK[ci]);}
}
for(const fr of g.FRIENDS_ON_MAP.filter(fr=>fr.ch>=12)) {
 const def=g.getDef(fr.room);assert(!g.SOLID.has(def.map[fr.y][fr.x]),fr.room+' NPC on solid tile '+fr.ch);
 assert.equal(def.npcs.filter(n=>n.x===fr.x && n.y===fr.y).length,1);
}
g.G.sel=g.CUSTOM_CHAR;g.G.selectScroll=0;g.revealSelected();assert(g.G.selectScroll>0);
assert.equal(g.selectAt({x:120,y:90}),g.CUSTOM_CHAR);
g.setSelectScroll(-100);assert.equal(g.G.selectScroll,0);
g.setSelectScroll(99999);assert.equal(g.G.selectScroll,g.selectMaxScroll());
g.G.sel=0;g.revealSelected();assert.equal(g.G.selectScroll,0);assert.equal(g.selectAt({x:39,y:30}),0);
assert.equal(g.selectAt({x:39,y:110}),-1);
const spec=g.wizardDefaults();spec.n='Mi personaje';spec.skills=['marathon','finance'];spec.c.eye='#1122ff';
const custom=g.newSave(g.CUSTOM_CHAR,spec);custom.slot=2;g.setS(custom);g.saveGame();
const restored=g.loadSave(2);assert.equal(restored.customChar.n,'Mi personaje');assert.equal(g.characterOf(restored).c.eye,'#1122ff');assert(g.characterOf(restored).marathon);
const another=g.newSave(g.CUSTOM_CHAR,{...spec,n:'Otro personaje',skills:['builder','superBaby']});
assert.equal(g.characterOf(restored).n,'MI PERSONAJE');assert.equal(g.characterOf(another).n,'OTRO PERSONAJE');assert(another.spells.includes('bolt'));
assert.throws(()=>g.normalizeCustom({...spec,st:{fue:8,des:8,agi:8,int:8}}));
assert.throws(()=>g.normalizeCustom({...spec,st:{fue:1,des:5,agi:6,int:8}}));
assert.throws(()=>g.normalizeCustom({...spec,skills:['marathon','foresight']}));
assert.throws(()=>g.normalizeCustom({...spec,skills:['finance','finance']}));
assert.throws(()=>g.normalizeCustom({...spec,skills:['unknown']}));
assert.throws(()=>g.normalizeCustom({...spec,c:{...spec.c,eye:'invalid'}}));
g.setS(g.newSave(0));g.getS().st.agi=8;const normal=g.speed();
g.setS(g.newSave(15));assert(Math.abs(g.speed()/normal-1.2)<1e-9);
g.setS(g.newSave(14));assert.equal(g.aquaticBonus({type:'merfolk'}),3);assert.equal(g.aquaticBonus({type:'gob'}),0);
g.setS(g.newSave(16));assert.equal(g.defense(),2);
g.loadRoom('pueblo',115,100);g.G.items=[{k:'coin',v:100,x:g.PL.x,y:g.PL.y,z:0,vz:0,t:20}];const coins=g.getS().coins;g.updateItems();assert.equal(g.getS().coins-coins,120);
g.setS(g.newSave(12));assert(g.getS().spells.includes('bolt'));assert.equal(g.defense(),2);
g.loadRoom('pueblo',115,100);g.G.state='world';g.G.dialog=null;g.G.enemies=[];g.getS().hp=2;g.setFrame(299);g.step();assert.equal(g.getS().hp,3);
g.setS(g.newSave(13));g.beginDuel({name:'Javier',look:g.CHARS[14],deck:'langostino',bonus:0,cheats:false},{id:'life'},1000);g.updateDuel();const predicted=g.G.duel.predicted;assert(predicted);g.drawDuel();assert.equal(g.oppPick(g.G.duel),predicted);
g.startTour('life');g.G.tour.opps[0].deck='life';g.G.tour.sel=0;sandbox.Math.random=()=>0.5;g.prepRound();const withForesight=g.G.tour.pwin;
g.setS(g.newSave(0));g.getS().st={fue:3,des:5,agi:4,int:8};g.startTour('life');g.G.tour.opps[0].deck='life';g.G.tour.sel=0;g.prepRound();
assert(Math.abs(withForesight-g.G.tour.pwin-0.08)<1e-9);
// Connectivity includes all appended NPCs, and every dungeon floor.
g.checkConnectivity();const report=elements.get('conn').textContent;assert(report.startsWith('PROBLEMAS: 0'),report);
assert.equal(g.remoteCharacter({ch:g.CUSTOM_CHAR,customChar:spec}).n,'MI PERSONAJE');
assert.equal(g.remoteCharacter({ch:g.CUSTOM_CHAR,customChar:{}}).id,'matias');
assert.equal(g.friendCast().length,18);assert(!g.friendCast().some(c=>c.id==='custom'));assert(g.friendCredits().join(' ').includes('RAI'));assert(g.friendCredits().join(' ').includes('PABLOT'));
assert.equal(g.ROOMS.valpo.doors['10,7'],'cartasCurico');assert.equal(g.ROOMS.mercado.doors['11,7'],'bovedaMox');
assert(!g.ROOMS.mercado.npcs.some(n=>n.id==='caballerizo'||n.id==='marchante'));
for(const [id,npcId] of [['establo','caballerizo'],['bovedaMox','marchante']]) {
 const def=g.getDef(id);assert(def.map.every(row=>row.length===15));assert(def.npcs.some(n=>n.id===npcId));
 const solid=g.propSolidSet(def),q=[[7,7]],seen=new Set(['7,7']);
 while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {const nx=x+dx,ny=y+dy,key=nx+','+ny;if(nx<0||ny<0||nx>=15||ny>=10||seen.has(key)||g.SOLID.has(def.map[ny][nx])||solid.has(nx+ny*15))continue;seen.add(key);q.push([nx,ny]);}}
 assert(seen.has('7,8'),'Exit inaccessible '+id);for(const npc of def.npcs)assert(seen.has(npc.x+','+npc.y),'NPC inaccessible '+id);
}
g.setS(g.newSave(0));g.getS().coins=200000;g.loadRoom('establo',115,116);
const horse=g.shopItems('monturas').find(it=>it.id==='caballo');assert(horse);assert.equal(horse.price,100000);g.G.shop={kind:'monturas',sel:0,scroll:0,items:g.shopItems('monturas')};g.buyItem(horse);
assert.equal(g.getS().coins,100000);assert(g.getS().mounts.includes('caballo'));assert.equal(g.getS().mount,'caballo');assert.equal(g.mounted(),null);assert(g.loadSave(1).mounts.includes('caballo'));
g.loadRoom('valpo',163,134);assert.equal(g.mounted().n,'Caballo chileno');
g.goTo('establo','E');assert.equal(g.G.roomId,'establo');assert.equal(g.getS().mount,'caballo');
g.loadRoom('bovedaMox',115,116);assert.equal(g.shopItems('lujo').length,80);
// Walk with actual player and NPC collision, rather than checking tiles alone.
for (const y of [68,76,84]) {
 g.setS(g.newSave(0));g.loadRoom('mercado',115,y);g.G.enemies=[];g.PL.atk=0;g.K.left=1;
 for(let i=0;i<400&&g.G.roomId==='mercado';i++)g.updateWorld();
 assert.equal(g.G.roomId,'pantanoProf','West exit blocked at y='+y);
 g.K.left=0;
}
assert.equal(g.SLOTS,5);
for(let slot=1;slot<=5;slot++){const save=g.newSave(slot+11);save.slot=slot;save.coins=slot*12345;g.setS(save);g.saveGame();assert.equal(g.loadSave(slot).coins,slot*12345);}
g.G.slotSel=4;g.drawSlots();
assert(!g.ROOMS.valpo.trails['9,1']);assert(g.ROOMS.valpo.npcs.some(n=>n.id==='caballerizo'));assert.equal(g.ROOMS.valpo.props.filter(p=>p.k==='montura'&&p.compact).length,5);
assert.equal(Math.min(...g.shopItems('monturas').map(it=>it.price)),100000);
for(const routes of Object.values(g.BOAT_ROUTES))for(const [dest,fee] of routes)if(dest==='pmontt'||dest==='islote')assert.equal(fee,3000);
g.setS(g.newSave(1));g.loadRoom('pueblo',115,84);
const rai=g.G.npcs.find(n=>n.ch===12),papa=g.G.npcs.find(n=>n.ch===0);assert(rai&&papa);assert(Math.abs(rai.x-papa.x)<=16);
// Pixel-space flood includes NPC bodies and requires dry terrain without Surf.
function reachablePositions(room,x,y){
 g.setS(g.newSave(1));g.loadRoom(room,x,y);g.getS().surf=false;
 const q=[[x,y]],seen=new Set([x+','+y]);
 for(let i=0;i<q.length;i++){const [px,py]=q[i];for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=px+dx,ny=py+dy,key=nx+','+ny;
 if(nx<0||ny<0||nx>230||ny>152||seen.has(key)||g.blocked(nx,ny,10,8)||g.npcHit({x:nx,y:ny,w:10,h:8}))continue;seen.add(key);q.push([nx,ny]);}}
 return q;
}
let positions=reachablePositions('pueblo',115,84);assert(positions.some(([x,y])=>Math.abs(x-35)<3&&Math.abs(y-124)<3),'Safari approach blocked');
positions=reachablePositions('pmontt',115,86);
for(const [tx,ty] of [[4,4],[11,4],[3,8]])assert(positions.some(([x,y])=>Math.abs(x-(tx*16+3))<3&&Math.abs(y-(ty*16+4))<3),'Puerto Montt door blocked '+tx);
assert(g.ROOMS.tienda.npcs.some(n=>n.id==='ligaUrza'));assert(g.ROOMS.cartasSur.npcs.some(n=>n.id==='ligaPmontt'));
g.G.forcePhase='night';g.getS().leagues={};assert(g.leagueMapMarks('pmontt')[0].available);assert(!g.leagueMapMarks('pmontt')[0].won);g.getS().leagues.pmontt=true;assert(g.leagueMapMarks('pmontt')[0].won);
assert(!g.leagueMapMarks('tolaria').find(m=>m.key==='nacional').available);g.drawWorldMap();

// All content remains accessible for any character, including old level-40 saves.
g.setS(g.newSave(0));g.getS().lvl=40;g.getS().coins=1000000000;g.G.forcePhase=null;
assert.notEqual(g.CHARS[7].style,'bald');
assert.equal(Object.keys(g.SWORDS).filter(id=>id.startsWith('avance')).length,10);
for(const [slot] of g.GEAR_SLOTS)assert.equal(Object.keys(g.ARMOR).filter(id=>id.startsWith('avance'+slot)).length,10);
assert.equal(Object.keys(g.HOUSE).filter(id=>id.startsWith('avance')).length,10);assert.equal(Object.keys(g.PRIZES).filter(id=>id.startsWith('avance')).length,10);
assert.equal(Object.keys(g.MOUNTS).filter(id=>id.startsWith('corcel')).length,10);
for(let i=0;i<4;i++){g.getS().worldTicks=i*g.DAY_PHASE_TICKS;assert.equal(g.dayPhase(),['dawn','day','dusk','night'][i]);}
g.getS().spellXp.bolt=999999;assert.equal(g.spellLvl('bolt'),10);assert.equal(g.petLevel(),40);
assert(g.tournamentXP({league:true},4,4)>g.cardMatchXP(true,10)*5);
assert.equal(g.RESPAWN_MS,180000);
g.getS().quests.q_gob={st:'active',base:0};g.getS().kills.gob=8;assert.equal(g.questProg('q_gob'),8);
g.G.state='world';g.openQuestJournal();g.drawQuests();assert(g.journalEntries().includes('q_gob'));g.G.menu=null;
const contract=g.ensureContract();g.getS().quests[contract]={st:'active',base:0};g.getS().killsTotal=g.QUESTS[contract].n;g.questHook('cronista');assert.equal(g.getS().quests[contract].st,'done');assert.notEqual(g.ensureContract(),contract);g.G.dialog=null;
g.getS().leagues={urza:true,vina:true,curico:true,pmontt:true};g.loadRoom('pueblo',115,84);assert(g.getS().finder);
g.loadRoom('bosque',115,84);const enemy=g.G.enemies.find(e=>e.spawnKey);assert(enemy);const key=enemy.spawnKey;g.killEnemy(enemy);g.loadRoom('bosque',115,84);assert(!g.G.enemies.some(e=>e.spawnKey===key));g.getS().killedAt[key]=Date.now()-180001;g.loadRoom('bosque',115,84);assert(g.G.enemies.some(e=>e.spawnKey===key));
g.G.enemies=[];g.G.eshots=[];g.G.aoes=[];const spot=g.hiddenSpot();assert(spot);g.PL.x=spot.x-5;g.PL.y=spot.y-4;g.searchHidden();assert(g.getS().hiddenFound.bosque);assert.equal(g.hiddenSpot(),null);g.G.dialog=null;
// Walk the water links in both directions; swimming is required.
g.getS().surf=false;g.loadRoom('dunas',220,70);assert.equal(g.changeRoom('e'),false);g.getS().surf=true;assert(g.changeRoom('e'));assert.equal(g.G.roomId,'pmontt');assert(g.changeRoom('w'));assert.equal(g.G.roomId,'dunas');assert(g.changeRoom('s'));assert.equal(g.G.roomId,'islote');assert(g.changeRoom('n'));assert.equal(g.G.roomId,'dunas');
g.loadRoom('arcade',115,116);
for(const game of ['dkc2','tenis','pelea','kart','bloques','laberinto','smash']){g.startArcade(game);for(let i=0;i<120;i++)g.updateArcade();g.drawArcade();const t=g.G.arc.t,coins=g.getS().coins;g.requestArcadeExit();g.updateArcade();assert.equal(g.G.arc.t,t);g.drawArcade();g.cancelArcade();assert.equal(g.G.state,'world');assert.equal(g.getS().coins,coins);}
g.startArcade('tenis');for(let i=0;i<12;i++)g.tennisPoint(g.G.arc,0);assert(g.G.arc.done&&g.G.arc.won);g.cancelArcade();
// Map collision audit includes NPC bodies, props and every interactable room.
const failures=[];
const auditRooms=[...new Set([...Object.keys(g.ROOMS),...Object.keys(g.WORLD),...Object.entries(g.DUNGEONS).flatMap(([id,d])=>Array.from({length:d.floors+1},(_,i)=>'D:'+id+':'+(i+1)))])];
for(const room of auditRooms){
 g.setS(g.newSave(0));g.getS().pet=24;g.getS().surf=true;g.loadRoom(room,115,116);const x=Math.round(g.PL.x),y=Math.round(g.PL.y),q=[[x,y]],seen=new Set([x+','+y]);
 for(let i=0;i<q.length;i++){const [px,py]=q[i];for(const [dx,dy]of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=px+dx,ny=py+dy,k=nx+','+ny;if(nx<0||ny<0||nx>230||ny>152||seen.has(k)||g.blocked(nx,ny,10,8)||g.npcHit({x:nx,y:ny,w:10,h:8}))continue;seen.add(k);q.push([nx,ny]);}}
 for(const n of g.G.npcs)if(!q.some(([px,py])=>Math.hypot(px+5-(n.x+5),py+4-(n.y+4))<29))failures.push(room+': NPC '+n.id+' '+n.ch);
 for(const [pos,to]of Object.entries(g.G.def.doors||{})){const [tx,ty]=pos.split(',').map(Number);if(!q.some(([px,py])=>Math.hypot(px+5-(tx*16+8),py+4-(ty*16+8))<25))failures.push(room+': puerta '+to);}
 g.drawWorld();g.drawHUD();
}
assert.equal(failures.length,0,failures.join('\n'));
const snapshots=new Map(storage);g.G.preview=true;g.setS(g.newSave(0));g.getS().realm='pokemon';g.loadRoom('tienda',115,116);g.drawWorld();g.drawHUD();g.saveGame();assert.deepEqual(storage,snapshots);g.G.preview=false;
async function main(){
 const encoded=await g.encodeSave(custom), decoded=await g.decodeSave(encoded);
 assert.equal(decoded.customChar.n,'Mi personaje');assert.equal(g.characterOf(decoded).c.eye,'#1122ff');
console.log('PASS: partidas antiguas y cinco espacios, personajes, misiones y patrullas, equipo avanzado, fases del dia, magia 10, mascotas, experiencia de ligas, Surf, peligros y pausa de tres minutos, buscaobjetos, siete arcades, vista Pokemon sin guardar; acceso a NPC y puertas en '+auditRooms.length+' mapas.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
