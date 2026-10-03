// Run with: node tests/characters.cjs
// Exercise actual game code in an isolated browser stub; never touch real saves.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const html = fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
let source = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('const CHARS'));
const drawing = new Proxy({ measureText:s=>({width:String(s).length*4}), createRadialGradient:()=>({addColorStop(){}}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(960*640*4)}) },{get:(obj,k)=>obj[k] || (()=>{})});
const elements = new Map();
function element(){return { listeners:new Map(),textContent:'',style:{},dataset:{},value:'',hidden:false,classList:{add(){},remove(){},toggle(){}},append(){},appendChild(node){if(node.id)elements.set(node.id,node);},addEventListener(type,fn){const list=this.listeners.get(type)||[];list.push(fn);this.listeners.set(type,list);},setAttribute(){},focus(){},getContext:()=>drawing,getBoundingClientRect:()=>({left:0,top:0,width:960,height:640}),querySelectorAll:()=>[] };}
const padButtons=['up','down','left','right','a','b','c','v','menu'].map(k=>{const button=element();button.dataset.k=k;return button;});
const storage=new Map();
const sandbox={console,structuredClone,URLSearchParams,TextEncoder,TextDecoder,Uint8Array,Uint8ClampedArray,Buffer,Math:Object.create(Math),Date,performance:{now:()=>0},navigator:{maxTouchPoints:0},location:{hash:'',search:'',href:'http://localhost/',protocol:'http:'},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},matchMedia:()=>({matches:false}),addEventListener(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{body:element(),createElement:()=>element(),querySelectorAll:()=>[],getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);}},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary')};
sandbox.window=sandbox;sandbox.document.listeners=new Map();sandbox.document.addEventListener=element().addEventListener;sandbox.document.querySelectorAll=selector=>selector==='#pad button'?padButtons:[];
source=source.replace(/\}\)\(\);\s*$/, `globalThis.gameTest={medalProgress,festivalTasting,festivalBeer,sealReady,closeUrzaBox,DECKS,GUARDIANS,dropLoot,questCoins,levelCoins,itemLevel,usableDrop,POKEMON_GYMS,gymRun,beginPokemonGymMatch,finishPokemonGymMatch,reputationTitle,updateTrainerSight,drawTrainerMarkers,homeOracle,beginAdventure,TEMPLE_IDENTITIES,MAGIC_COMPANIONS,companionInfo,drawCompanion,updatePet,portalUnlocked,switchRealm,startRealmTravel,updateRealmTravel,drawRealmTravel,realmDefinition,realmText,talkTo,localPlayerDeck,addCard,CHARS,CUSTOM_CHAR,normalizeCustom,customCharacter,characterOf,newSave,loadSave,saveGame,slotKey,speed,defense,aquaticBonus,loadRoom,checkConnectivity,drawSelect,drawPerson,drawDuel,drawTour,POKE,pokemonEnemy,enemyName,pokemonRealm,SONGS,roomMusic,tryInteract,meleeMissChance,meleeOutcome,beginDuel,updateDuel,resolveDuel,duelOptions,cardPower,rivalPower,drawMenu,menuClick,updateTour,oppPick,startTour,prepRound,updateItems,step,encodeSave,decodeSave,myState,remoteCharacter,FRIEND_LINES,FRIEND_DECK,FRIENDS_ON_MAP,getDef,SOLID,ROOMS,MOUNTS,shopItems,buyItem,mounted,goTo,friendCast,friendCredits,propSolidSet,K,updateWorld,blocked,npcHit,SLOTS,drawSlots,leagueMapMarks,drawWorldMap,BOAT_ROUTES,QUESTS,questHook,questProg,ensureContract,journalEntries,openQuestJournal,drawQuests,ARMOR,SWORDS,HOUSE,PRIZES,GEAR_SLOTS,dayPhase,DAY_PHASE_TICKS,SPELL_LVLS,spellLvl,petLevel,cardMatchXP,tournamentXP,RESPAWN_MS,killEnemy,hiddenSpot,searchHidden,MON,WORLD,DUNGEONS,startArcade,updateArcade,drawArcade,tennisPoint,requestArcadeExit,cancelArcade,drawWorld,drawHUD,changeRoom,setSelectScroll,selectMaxScroll,revealSelected,selectAt,G,PL,zoneNeighbors,SURF_LINKS,clientRecv,hostRecv,wizardDefaults,setS(value){S=value;},getS(){return S;},setFrame(value){frame=value;}};})();`);
source=source.replace('gameTest={medalProgress,','gameTest={leagueTalk,pokemonGymTalk,POKEMON_META_DECKS,POKEMON_MATCHUPS,POKEMON_GYM_DECKS,activeDecks,realmCards,pokemonMatchup,magicBestiary,chooseMagicPet,updateSafari,throwBall,MAGIC_SAFARI_POOLS,drawCardBig,drawMetaArt,SAFARI_REGIONS,ashGuidePath,offerAshGuide,updateAshGuide,finishAshGuide,spawnWildPoke,deckLabel,deckChoices,CARDS,SPELLS,REFLECT_SPELLS,REFLECT_GEAR,drawDialog,addXP,levelCap,LEAGUES,finishTour,genDuel,OKTOBER_REGION,festivalStops,stampFestival,regionalFestival,endOctayRace,pokemonDiscovered,portalTalk,pellucoBeer,pellucoDJ,propAction,startOctayRace,updateOctayRace,OCTAY_CHECKPOINTS,medalProgress,');
source=source.replace("function tiny(s, x, y, col='#fff', al='left', raw=false){","function tiny(s, x, y, col='#fff', al='left', raw=false){(globalThis.renderLabels ||= []).push(String(s));");
source=source.replace('gameTest={leagueTalk,','gameTest={newPokemonBattle,pokemonStrike,genPokemonReplay,POKEMON_CARD_STATS,bankTransfer,bankTalk,recoverLife,usePotion,POTIONS,questsOf,questMarker,openPotions,setupDuel,startFree,updateTennis,TENNIS_COURTS,drawMount,drawRider,reflectedMount,spawnEnemy,hurtPlayer,hurtHazard,castSpell,hitWithSpell,gainSpellXp,spellProgress,monsterCardChance,reflectedDropCards,meleeDamage,leagueTalk,');
vm.runInNewContext(source,sandbox,{timeout:5000});
const g=sandbox.gameTest;
function fullDeck(id){for(const cid of g.DECKS.find(d=>d.id===id).cards)g.getS().cards[cid]=1;}
// Browser gesture suppression keeps held controls and simultaneous movement/attack.
function emit(target,type,pointerId=1){let prevented=false;const event={pointerId,cancelable:true,preventDefault(){prevented=true;}};for(const fn of target.listeners.get(type)||[])fn(event);return prevented;}
assert(emit(elements.get('game'),'touchstart'));assert(emit(elements.get('game'),'touchmove'));assert(emit(elements.get('pad'),'selectstart'));assert(emit(elements.get('pad'),'contextmenu'));
for(const type of ['contextmenu','selectstart','dragstart','copy']){
 let prevented=false;const event={cancelable:true,target:{closest:()=>null},preventDefault(){prevented=true;}};
 for(const fn of sandbox.document.listeners.get(type))fn(event);assert(prevented,'Game page must block '+type);
 prevented=false;event.target={closest:()=>({tagName:'INPUT'})};for(const fn of sandbox.document.listeners.get(type))fn(event);assert(!prevented,'Text fields must remain editable');
}
let cleared=0;sandbox.getSelection=()=>({rangeCount:1,anchorNode:{nodeType:1,closest:()=>null},removeAllRanges(){cleared++;}});
sandbox.document.activeElement={closest:()=>null};sandbox.document.listeners.get('selectionchange')[0]();assert.equal(cleared,1);
sandbox.document.activeElement={closest:()=>({tagName:'INPUT'})};sandbox.document.listeners.get('selectionchange')[0]();assert.equal(cleared,1);
emit(padButtons[0],'pointerdown',1);emit(padButtons[4],'pointerdown',2);g.step();assert.equal(g.K.up,1);assert.equal(g.K.a,1);
emit(padButtons[0],'pointerdown',3);emit(padButtons[0],'pointerup',1);g.step();assert.equal(g.K.up,1);
emit(padButtons[0],'pointercancel',3);emit(padButtons[4],'lostpointercapture',2);g.step();assert.equal(g.K.up,0);assert.equal(g.K.a,0);
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
assert.equal(g.CUSTOM_CHAR,18,'El creador conserva el indice de las partidas existentes');
assert.equal(g.CHARS[19].id,'martin');
const martinSave=g.newSave(19);martinSave.slot=3;g.setS(martinSave);g.saveGame();
assert.equal(g.characterOf(g.loadSave(3)).id,'martin');
assert(g.CHARS[19].shirtless && g.CHARS[19].muscular && g.CHARS[19].finance);
assert.equal(Object.values(martinSave.st).reduce((a,b)=>a+b,0),20);
for(const dir of [0,1,2,3])for(const f of [0,1])g.drawPerson(0,0,g.CHARS[19],dir,f);
assert(g.FRIEND_LINES[19].join(' ').includes('Pokémon'));assert(g.FRIEND_DECK[19]);
g.G.sel=19;g.G.selectScroll=0;g.revealSelected();g.drawSelect();
assert.equal(g.selectAt({x:39,y:90}),19,'Martin es seleccionable al deslizar');
g.loadRoom('bar',115,100);assert(!g.G.npcs.some(n=>n.id==='friend'&&n.ch===19),'No duplicar al personaje jugable');
g.setS(g.newSave(0));g.loadRoom('bar',115,100);assert(g.G.npcs.some(n=>n.id==='friend'&&n.ch===19));
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
g.startTour('life');g.G.tour.opps[0].deck='life';g.G.tour.intent='ctrl';g.G.tour.sel=0;sandbox.Math.random=()=>0.5;g.G.tour.sel=1;g.prepRound();g.G.tour.sel=1;g.prepRound();g.G.tour.sel=1;g.prepRound();const withForesight=g.G.tour.score;
g.setS(g.newSave(0));g.getS().st={fue:3,des:5,agi:4,int:8};g.startTour('life');g.G.tour.opps[0].deck='life';g.G.tour.intent='ctrl';g.G.tour.sel=0;g.G.tour.sel=1;g.prepRound();g.G.tour.sel=1;g.prepRound();g.G.tour.sel=1;g.prepRound();
assert.equal(withForesight-g.G.tour.score,.5);
// Connectivity includes all appended NPCs, and every dungeon floor.
g.checkConnectivity();const report=elements.get('conn').textContent;assert(report.startsWith('PROBLEMAS: 0'),report);
// Co-op: when the host kills a monster in the same zone, the guest also gets the experience and its own loot.
{const prevS=g.getS(),prevState=g.G.state,prevRoom=g.G.roomId;g.setS(g.newSave(0));g.G.state='world';g.loadRoom('pradera',100,100);g.G.items=[];const before=[g.getS().lvl,g.getS().xp],kills=g.getS().killsTotal||0;g.clientRecv({t:'kill',room:g.G.roomId,realm:'magic',id:9999,type:'mongrel',x:100,y:100});assert.notDeepEqual([g.getS().lvl,g.getS().xp],before,'el invitado no recibio experiencia');g.getS().worldTicks=0;g.clientRecv({t:'pl',list:[],wt:3*7200+5});assert.equal(g.getS().worldTicks,3*7200+5,'el invitado no adopto la hora del anfitrion');g.G.state='world';g.loadRoom('pradera',100,100);g.hostRecv({},{t:'roomEn',room:g.G.roomId,realm:'magic',killed:[g.G.roomId+':0'],list:[['mongrel',60,60,1,4,null]]});assert.equal(g.G.enemies.length,1,'el anfitrion no adopto los monstruos del invitado');assert.equal(g.G.enemies[0].hp,1);g.setS(prevS);g.G.state=prevState;g.loadRoom(prevRoom,100,100);}
// Every world exit has a way back, and the south can be left on foot without Surf or boat.
for(const id of Object.keys(g.WORLD))for(const [side,to] of Object.entries(g.zoneNeighbors(id)))assert(Object.values(g.zoneNeighbors(to)).includes(id),id+' -> '+to+' ('+side+') no tiene vuelta');
{const seen=new Set(['pmontt']),q=['pmontt'];while(q.length){const id=q.shift();for(const [side,to] of Object.entries(g.zoneNeighbors(id))){if(g.SURF_LINKS[id]?.[side]||seen.has(to))continue;seen.add(to);q.push(to);}}assert(seen.has('pueblo'),'Puerto Montt queda aislado a pie');}
assert.equal(g.remoteCharacter({ch:g.CUSTOM_CHAR,customChar:spec}).n,'MI PERSONAJE');
assert.equal(g.remoteCharacter({ch:g.CUSTOM_CHAR,customChar:{}}).id,'matias');
assert.equal(g.friendCast().length,19);assert(!g.friendCast().some(c=>c.id==='custom'));assert(g.friendCredits().join(' ').includes('RAI'));assert(g.friendCredits().join(' ').includes('PABLOT'));
assert.equal(g.ROOMS.valpo.doors['10,7'],'cartasCurico');assert.equal(g.ROOMS.mercado.doors['11,7'],'bovedaMox');
assert(!g.ROOMS.mercado.npcs.some(n=>n.id==='caballerizo'||n.id==='marchante'));
for(const [id,npcId] of [['establo','caballerizo'],['bovedaMox','marchante']]) {
 const def=g.getDef(id);assert(def.map.every(row=>row.length===15));assert(def.npcs.some(n=>n.id===npcId));
 const solid=g.propSolidSet(def),q=[[7,7]],seen=new Set(['7,7']);
 while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {const nx=x+dx,ny=y+dy,key=nx+','+ny;if(nx<0||ny<0||nx>=15||ny>=10||seen.has(key)||g.SOLID.has(def.map[ny][nx])||solid.has(nx+ny*15))continue;seen.add(key);q.push([nx,ny]);}}
 assert(seen.has('7,8'),'Exit inaccessible '+id);for(const npc of def.npcs)assert(seen.has(npc.x+','+npc.y),'NPC inaccessible '+id);
}
g.setS(g.newSave(0));g.getS().coins=400000;g.loadRoom('establo',115,116);
const horse=g.shopItems('monturas').find(it=>it.id==='caballo');assert(horse);assert.equal(horse.price,300000);g.G.shop={kind:'monturas',sel:0,scroll:0,items:g.shopItems('monturas')};g.buyItem(horse);
assert.equal(g.getS().coins,100000);assert(g.getS().mounts.includes('caballo'));assert.equal(g.getS().mount,'caballo');assert.equal(g.mounted(),g.MOUNTS.caballo);assert(g.loadSave(1).mounts.includes('caballo'));
g.loadRoom('valpo',163,134);assert.equal(g.mounted().n,'Burro de Curico');
g.goTo('establo','E');assert.equal(g.G.roomId,'establo');assert.equal(g.getS().mount,'caballo');
g.loadRoom('bovedaMox',115,116);assert(g.shopItems('lujo').every(it=>(it.req&&it.req.lvl||1)<=g.getS().lvl));
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
assert(!g.ROOMS.valpo.trails['9,1']);assert.equal(g.ROOMS.valpo.doors['4,6'],'establo');assert(g.ROOMS.establo.npcs.some(n=>n.id==='caballerizo'));assert.equal(g.ROOMS.establo.props.filter(p=>p.k==='montura'&&p.compact).length,5);
assert.equal(Math.min(...g.shopItems('monturas').map(it=>it.price)),300000);
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
g.getS().spellXp.bolt=999999;assert.equal(g.spellLvl('bolt'),20);assert.equal(g.petLevel(),40);
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
// Original TCG theme loops all layers together and overrides the previous club DJ.
assert.equal(g.SONGS.tcg.bpm,112);for(const track of g.SONGS.tcg.tracks){assert.equal(track.notes.reduce((n,v)=>n+v[1],0),128);for(const [value,duration]of track.notes){assert(duration>0);if(track.inst!=='drum')for(const f of Array.isArray(value)?value:[value])assert(Number.isFinite(f)&&f>=0);}}
g.G.djMusic='electro';g.loadRoom('cartasCurico',115,116);assert.equal(g.roomMusic(),'tcg');g.loadRoom('bar',115,116);assert.equal(g.roomMusic(),'electro');g.G.djMusic=null;
// Accuracy depends on dexterity; critical and missed contact have distinct outcomes.
assert(g.meleeMissChance({des:5})>g.meleeMissChance({des:50}));sandbox.Math.random=()=>.05;
assert.equal(g.meleeOutcome({des:5}),'miss');assert.equal(g.meleeOutcome({des:80}),'crit');sandbox.Math.random=()=>.95;assert.equal(g.meleeOutcome({des:80}),'hit');
// Dry southern connections and building entrances do not require Surf.
for(const [from,side,to]of [['pmontt','s','puertoVaras'],['puertoVaras','s','frutillar'],['frutillar','n','puertoVaras'],['puertoVaras','n','pmontt']]){g.setS(g.newSave(0));g.loadRoom(from,115,116);g.getS().surf=false;assert(g.changeRoom(side));assert.equal(g.G.roomId,to);}
for(const [room,tx,ty]of [['puertoVaras',4,3],['puertoVaras',11,6],['frutillar',4,3],['frutillar',11,7],['valpo',4,6]]){const q=reachablePositions(room,115,116);assert(q.some(([x,y])=>Math.hypot(x+5-(tx*16+8),y+4-((ty+1)*16+8))<10),'Dry doorway blocked '+room);}
g.setS(g.newSave(0));g.loadRoom('cartasCurico',99,104);g.G.forcePhase='dusk';g.PL.dir=0;g.tryInteract();assert(g.G.dialog);assert(!JSON.stringify(g.G.dialog).includes('¿Conversamos o jugamos'));g.G.dialog=null;g.G.forcePhase=null;
// Real directional transitions: one northern entrance, no southern return loop.
g.setS(g.newSave(0));g.G.menu=null;g.G.dialog=null;g.G.state='world';g.loadRoom('talca',115,132);g.K.down=1;
for(let i=0;i<100&&g.G.roomId==='talca';i++)g.updateWorld();
assert.equal(g.G.roomId,'barrioTalca');assert(g.PL.y<40);
for(let i=0;i<200;i++)g.updateWorld();assert.equal(g.G.roomId,'barrioTalca');assert(g.PL.y>110);g.K.down=0;
g.loadRoom('barrioTalca',115,20);g.K.up=1;for(let i=0;i<100&&g.G.roomId==='barrioTalca';i++)g.updateWorld();g.K.up=0;assert.equal(g.G.roomId,'talca');
// Walk into Viña's temple with every playable character (Tomo is present for others).
for(let ci=0;ci<19;ci++){g.setS(ci===18?g.newSave(18,spec):g.newSave(ci));g.G.dialog=null;g.loadRoom('vina',35,132);g.K.up=1;for(let i=0;i<100&&g.G.roomId==='vina';i++)g.updateWorld();g.K.up=0;assert.equal(g.G.roomId,'cartasVina','Viña entrance blocked for '+ci);}
for(const [id,d]of Object.entries(g.ROOMS))for(const pos of Object.keys(d.doors||{})){const [x,y]=pos.split(',').map(Number);assert(!(d.npcs||[]).some(n=>n.x===x&&(n.y===y||n.y===y+1)),id+' NPC occupies door or approach '+pos);}
g.setS(g.newSave(0));g.G.menu={tab:5,sel:0,deck:null};g.drawMenu();g.menuClick({x:220,y:7});assert.equal(g.G.menu.tab,5);g.G.menu=null;
// Deterministic choices dominate stats even at level 52 with all prizes.
sandbox.Math.random=()=>.5;g.getS().lvl=52;g.getS().st={fue:150,des:150,agi:150,int:150};
function roundScore(choice){g.startTour('life');g.G.tour.opps[0].deck='life';g.G.tour.intent='ctrl';for(let i=0;i<3;i++){g.G.tour.sel=choice;g.prepRound();if(i<2)assert.equal(g.G.tour.phase,'strategy');}assert.equal(g.G.tour.decisions.length,3);g.drawTour();return g.G.tour.score;}
const weak=roundScore(0),strong=roundScore(2),observe=roundScore(3);assert.equal(strong-weak,6);assert.equal(observe-weak,3);
g.beginDuel({name:'Rival',look:g.CHARS[1],deck:'life',bonus:0},{id:'life'},1000);assert.equal(g.G.duel.opp.level,20);assert.equal(g.duelOptions().length,4);
g.G.duel.myT='agro';g.resolveDuel(g.G.duel);assert(g.G.duel.effect);assert(g.cardPower()>g.rivalPower(20),'Level grants a persistent advantage');
g.beginDuel({name:'Rival',look:g.CHARS[1],deck:'life',bonus:0},{id:'life'},1000);g.G.duel.myT='adapt';g.resolveDuel(g.G.duel);assert(g.G.duel.predicted);g.drawDuel();
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
// Pokemon sprites, nearby labels and boss names share the same species identity.
const originalMonNames=Object.fromEntries(Object.entries(g.MON).map(([key,m])=>[key,m.n]));
g.setS(g.newSave(0));g.getS().realm='pokemon';
for(const type of Object.keys(g.MON)){const enemy=g.pokemonEnemy(type);assert.equal(enemy.species,g.POKE[enemy.id].n);assert.equal(g.enemyName(type),enemy.name);assert(enemy.name.startsWith(g.POKE[enemy.id].n+' '));assert(['GIGANTE','FURIOSO','SALVAJE'].includes(enemy.variant));}
assert.equal(g.enemyName('carno'),'PIKACHU FURIOSO');assert.equal(g.enemyName('siege'),'MEWTWO GIGANTE');
g.G.preview=true;g.loadRoom('bosque',115,84);g.drawWorld();g.loadRoom('guarida',115,84);g.drawHUD();g.G.preview=false;
g.setS(g.newSave(0));for(const [type,name]of Object.entries(originalMonNames))assert.equal(g.enemyName(type),name);assert.deepEqual(Object.fromEntries(Object.entries(g.MON).map(([key,m])=>[key,m.n])),originalMonNames);
const snapshots=new Map(storage);g.G.preview=true;g.setS(g.newSave(0));g.getS().realm='pokemon';g.loadRoom('tienda',115,116);g.drawWorld();g.drawHUD();g.saveGame();assert.deepEqual(storage,snapshots);g.G.preview=false;

// Crossing is reversible, including after restoring a serialized save.
g.G.preview=true;g.setS(g.newSave(0));const realmOriginal=g.getS();realmOriginal.ligaWins=1;realmOriginal.cards.bolt=3;realmOriginal.leagues.curico=true;realmOriginal.pet=24;realmOriginal.quests.q_mazo={st:'active',base:0};realmOriginal.lvl=52;
g.loadRoom('santuarioPortal',115,116);assert(g.portalUnlocked());g.drawWorld();g.startRealmTravel();g.G.realmTravel.t=419;g.updateRealmTravel();
assert.equal(g.getS().realm,'pokemon');assert.equal(g.getS().lvl,52);assert.equal(g.getS().pet,24);assert.equal(g.companionInfo().n,'Shivan Dragon');assert.equal(g.getS().cards.bolt,undefined);
g.getS().cards.bolt=1;g.getS().leagues.vina=true;g.drawCompanion(10,10,0,false);g.updatePet();g.setS(JSON.parse(JSON.stringify(g.getS())));g.switchRealm('magic');
assert.equal(g.getS().cards.bolt,3);assert.equal(g.getS().leagues.curico,true);assert.equal(g.getS().leagues.vina,undefined);assert.equal(g.getS().quests.q_mazo.st,'active');assert.equal(g.companionInfo().n,'PIKACHU');
g.switchRealm('pokemon');assert.equal(g.getS().cards.bolt,1);assert.equal(g.getS().leagues.vina,true);
for(const type of Object.keys(g.MAGIC_COMPANIONS)){g.getS().magicPet=type;g.loadRoom('bosque',115,84);g.updatePet();g.drawCompanion(5,5,0,false);}
g.getS().realm='magic';const templeLayouts=new Set(),rosterNames=new Set();
for(const [id,p]of Object.entries(g.TEMPLE_IDENTITIES)){const base=g.getDef(id),reflected=g.realmDefinition(id,base);assert.deepEqual(reflected.map,base.map);assert.deepEqual(reflected.doors,base.doors);assert(!base.npcs.some(n=>['azul','diegoG'].includes(n.id)));templeLayouts.add(JSON.stringify(p.tables));for(const name of p.players){assert(!rosterNames.has(name));rosterNames.add(name);}g.loadRoom(id,115,116);g.drawWorld();for(const r of p.roster)assert(g.localPlayerDeck(r));fullDeck('goblins');g.startTour('goblins',{rounds:4,diff:0,league:'curico'});assert(g.G.tour.opps.every(o=>p.players.includes(o.n)));g.G.state='world';}
assert.equal(templeLayouts.size,6);assert(!Object.values(g.ROOMS).some(d=>(d.props||[]).some(p=>p.k==='tcgNeon')));
g.getS().realm='magic';g.G.cardGet=null;g.G.cardQueue=[];g.addCard('bolt');assert.equal(g.G.cardGet,null);assert(g.G.toasts.some(t=>t.loot));
g.getS().realm='pokemon';assert(!g.realmText('Carnophage y Goblin').includes('Carnophage'));
g.G.realmTravel={t:210,target:'pokemon'};g.drawRealmTravel();g.G.preview=false;


g.G.preview=true;g.setS(g.newSave(0));g.getS().realm='pokemon';g.loadRoom('cartasCurico',115,116);const gym=g.G.def.gym;assert.equal(gym.ids.length,4);assert.equal(gymRunNext(),0);
function gymRunNext(){return g.gymRun().next;}
g.finishPokemonGymMatch({key:gym.key,index:3,npc:gym.ids[3]},true);assert.equal(gymRunNext(),0); // Cannot skip the three trainers.
for(let i=0;i<4;i++){g.finishPokemonGymMatch({key:gym.key,index:i,npc:gym.ids[i]},false);assert.equal(gymRunNext(),i);g.finishPokemonGymMatch({key:gym.key,index:i,npc:gym.ids[i]},true);assert.equal(gymRunNext(),i+1);g.getS().gymRuns=JSON.parse(JSON.stringify(g.getS().gymRuns));}
assert(g.getS().leagues.curico);assert.equal(g.reputationTitle(),'CAMPEON LOCAL');const gymXP=g.getS().xp;g.finishPokemonGymMatch({key:gym.key,index:3,npc:gym.ids[3]},true);assert.equal(g.getS().xp,gymXP);
for(const id of Object.keys(g.POKEMON_GYMS)){g.loadRoom(id,115,116);g.drawWorld();g.drawTrainerMarkers();const def=g.G.def;for(const n of g.G.npcs){assert(!['azul','diegoG'].includes(n.id));}assert.equal(def.gym.ids.length,4);assert.equal(g.getDef(id).map.join(),def.map.join());}
g.loadRoom('hogar',35,52);g.drawWorld();g.homeOracle();assert(g.G.dialog);g.G.dialog=null;assert(g.ROOMS.hogar.props.some(p=>p.k==='homeKitchen'));assert(g.ROOMS.hogar.props.some(p=>p.k==='homeComputer'));g.getS().realm='magic';g.beginAdventure(0);assert.equal(g.G.roomId,'hogar');assert.equal(g.G.waking,120);assert.equal(g.getS().room,'hogar');g.G.preview=false;


assert.equal(g.MOUNTS.caballo.price,300000);for(const raw of [20,40,1000,2400]){assert(g.questCoins({coins:raw},1)<5000);assert(g.questCoins({coins:raw},80)>g.questCoins({coins:raw},1));assert(g.questCoins({coins:raw},80)<20000);}
g.G.preview=true;g.setS(g.newSave(0));g.getS().lvl=1;for(const kind of ['armas','lujo','sur']){for(const it of g.shopItems(kind))assert((it.req&&it.req.lvl||1)<=1);}const lowShop=g.shopItems('armas').length;g.getS().lvl=52;assert(g.shopItems('armas').length>lowShop);g.getS().lvl=1;for(const kind of ['sword','armor']){const late=kind==='sword'?'moxEterno':'avancebody9';const item=g.usableDrop(kind,late);assert(g.itemLevel(kind,item)<=1);}g.G.preview=false;


// The box stays open until real mastery; sealing restores a peaceful world.
g.G.preview=true;g.setS(g.newSave(0));assert(!g.sealReady());g.closeUrzaBox();assert(!g.getS().boxClosed);g.G.dialog=null;for(const d of g.DECKS)for(const card of d.cards)g.getS().cards[card]=1;for(const key of g.GUARDIANS)g.getS().bosses[key]=true;g.getS().leagues={curico:true,vina:true,pmontt:true,urza:true,tempest:true};g.getS().ligaWins=1;assert(g.sealReady());g.closeUrzaBox();assert(g.getS().boxClosed);g.G.dialog=null;g.loadRoom('bosque',115,84);assert.equal(g.G.enemies.length,0);g.switchRealm('pokemon');assert.equal(g.getS().boxClosed,false);g.loadRoom('bosque',115,84);assert(g.G.enemies.length>0);g.switchRealm('magic');assert.equal(g.getS().boxClosed,true);
// Every gym has accessible trainers, doors and usable furnishings.
for(const id of Object.keys(g.POKEMON_GYMS)){g.setS(g.newSave(0));g.getS().realm='pokemon';g.loadRoom(id,115,116);const q=[[g.PL.x,g.PL.y]],seen=new Set();for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [dx,dy]of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=x+dx,ny=y+dy,key=nx+','+ny;if(nx<0||ny<0||nx>230||ny>152||seen.has(key)||g.blocked(nx,ny,10,8)||g.npcHit({x:nx,y:ny,w:10,h:8}))continue;seen.add(key);q.push([nx,ny]);}}for(const n of g.G.npcs)assert(q.some(([x,y])=>Math.hypot(x+5-n.x-5,y+4-n.y-4)<25),'Trainer inaccessible '+id+' '+n.id);}
g.setS(g.newSave(0));g.loadRoom('bosque',115,84);g.G.items=[];const earlyFoe={type:'siege',x:100,y:90,w:32,h:32};g.dropLoot(earlyFoe);for(const it of g.G.items)if(it.k==='sword'||it.k==='gear')assert(g.itemLevel(it.k==='gear'?'armor':'sword',it.id)<=g.getS().lvl);
g.loadRoom('oktoberfest',115,116);g.festivalTasting();assert.equal(g.G.dialog.choices.length,4);g.G.dialog.choices[0].fn();g.G.dialog.choices[1].fn();g.G.dialog.choices[2].fn();assert.equal(g.getS().festivalMedals,1);assert(g.getS().festivalNextAt>Date.now());g.G.dialog=null;g.G.preview=false;

g.setS(g.newSave(0));g.getS().leagues={curico:true};g.getS().realmProgress={pokemon:{leagues:{vina:true,pmontt:true},ligaWins:1}};
assert.equal(g.medalProgress('magic').count,1);assert.equal(g.medalProgress('pokemon').count,2);assert(g.medalProgress('pokemon').national);
g.G.menu={tab:5,deck:null};g.menuClick({x:180,y:26});assert.equal(g.G.menu.medalRealm,'pokemon');g.drawMenu();g.menuClick({x:30,y:26});assert.equal(g.G.menu.medalRealm,'magic');g.drawMenu();g.G.menu=null;
for(const id of Object.keys(g.POKEMON_GYMS)){g.loadRoom(id,115,116);assert(!g.G.def.props.some(p=>['juegosMesa','retroShelf'].includes(p.k)));g.drawHUD();}
g.getS().leagues={vina:true,curico:true,pmontt:true,urza:true,tempest:true};g.getS().bosses={};g.getS().worldTicks=g.DAY_PHASE_TICKS;g.G.forcePhase='day';g.talkTo('ligaOrg');assert(g.G.dialog.pages.flat().join(' ').includes('Necesitas un mazo completo'));assert(g.leagueMapMarks('tolaria').find(l=>l.key==='nacional').available);g.G.forcePhase=null;
// Puerto Octay: dry return route, all local creatures, and a sequential timed lap.
g.setS(g.newSave(0));g.G.preview=true;g.loadRoom('frutillar',115,84);assert(g.changeRoom('e'));assert.equal(g.G.roomId,'puertoOctay');assert(g.changeRoom('w'));assert.equal(g.G.roomId,'frutillar');
g.loadRoom('puertoOctay',19,68);assert.equal(new Set(g.G.enemies.filter(e=>e.type.endsWith('Octay')).map(e=>e.type)).size,3);assert(g.G.npcs.some(n=>n.ch===15));g.drawWorld();
g.talkTo('friend',g.G.npcs.find(n=>n.ch===15));assert(!g.G.dialog.choices);assert(!g.G.octayRace);
g.G.enemies=[];g.G.eshots=[];g.G.aoes=[];g.startOctayRace();g.G.dialog.choices[0].fn();assert(g.G.octayRace);g.G.dialog=null;
g.PL.x=11*16+3;g.PL.y=7*16+4;g.updateOctayRace();assert.equal(g.G.octayRace.next,0);
for(const [x,y]of g.OCTAY_CHECKPOINTS){assert(!g.blocked(x*16+3,y*16+4,10,8));g.PL.x=x*16+3;g.PL.y=y*16+4;g.updateOctayRace();}
assert(!g.G.octayRace);assert(g.getS().octayBest>0);const best=g.getS().octayBest;g.startOctayRace();assert(!g.G.dialog.choices);assert.equal(g.getS().octayBest,best);
g.G.octayRace={next:0,t:2700};g.updateOctayRace();assert(!g.G.octayRace);g.G.octayRace={next:0,t:0};g.G.roomId='frutillar';g.updateOctayRace();assert(!g.G.octayRace);g.G.preview=false;
g.setS(g.newSave(0));g.G.preview=true;g.loadRoom('pmontt',115,84);assert(g.changeRoom('e'));assert.equal(g.G.roomId,'pelluco');assert(g.changeRoom('w'));assert.equal(g.G.roomId,'pmontt');
for(const room of ['uachPelluco','quinchoPelluco']){g.loadRoom(room,115,116);g.drawWorld();assert(g.roomMusic()===(room==='quinchoPelluco'?'mechones':'pelluco'));}
const dry=reachablePositions('pelluco',115,84);for(const [x,y]of [[4,3],[10,3]])assert(dry.some(([a,b])=>Math.hypot(a+5-(x*16+8),b+4-((y+1)*16+8))<10));
g.loadRoom('quinchoPelluco',115,116);g.getS().coins=3000;g.pellucoBeer();g.G.dialog.choices[0].fn();assert.equal(g.getS().coins,500);assert.equal(g.getS().beerTotal,1);g.pellucoDJ();g.G.dialog.choices[1].fn();assert.equal(g.G.djMusic,'pelluco');
for(const act of ['pool','taca']){g.propAction(g.G.def.props.find(p=>p.act===act));g.G.dialog.choices[0].fn();assert.equal(g.G.state,'arcade');assert.equal(g.G.arc.game,act);g.G.state='world';}
assert(g.QUESTS.q_pellucoAfiches.zones.includes('uachPelluco'));g.G.preview=false;
// The second medal collection is a surprise, unlocked by arrival rather than championship.
g.setS(g.newSave(0));g.G.preview=true;g.getS().ligaWins=1;assert(!g.pokemonDiscovered());
g.G.menu={tab:5,deck:null,medalRealm:'pokemon'};sandbox.renderLabels=[];g.drawMenu();assert(!sandbox.renderLabels.some(s=>s.includes('POKEMON')));assert(sandbox.renderLabels.includes('MEDALLAS DE MAGIC'));
g.menuClick({x:180,y:26});assert.equal(g.G.menu.medalRealm,'magic');g.portalTalk();assert(!g.G.dialog.pages.flat().join(' ').includes('Pokemon'));
g.startRealmTravel();assert(!g.pokemonDiscovered());g.G.realmTravel.t=419;g.updateRealmTravel();assert(g.pokemonDiscovered());assert(g.getS().portalDiscovered);
g.G.menu={tab:5,deck:null};sandbox.renderLabels=[];g.drawMenu();assert(sandbox.renderLabels.includes('POKEMON'));
g.switchRealm('magic');assert(g.pokemonDiscovered());g.setS(JSON.parse(JSON.stringify(g.getS())));assert(g.pokemonDiscovered());delete g.getS().portalDiscovered;assert(g.pokemonDiscovered(),'Existing return travellers retain discovery');
g.setS(g.newSave(0));g.getS().realm='pokemon';assert(g.pokemonDiscovered(),'Existing players in the other realm retain discovery');g.G.preview=false;
// Regional passport rewards are unique and separated by realm; stalls remain reachable.
g.setS(g.newSave(0));g.G.preview=true;g.getS().lvl=80;g.getS().xp=0;
for(const id of Object.keys(g.OKTOBER_REGION)){
 const saved=g.getS(),walk=reachablePositions(id,115,84);g.setS(saved);g.loadRoom(id,115,84);
 assert.equal(g.roomMusic(),'oktober');assert(g.G.def.festival);
 const p=g.G.def.props.find(p=>p.act==='regionalFest');assert(p&&!p.solid);
 assert(walk.some(([x,y])=>Math.hypot(x+5-(p.x*16+16),y+4-(p.y*16+8))<27),'Festival inaccessible '+id);
 g.G.forcePhase='night';g.drawWorld();g.drawHUD();g.G.forcePhase=null;
 g.stampFestival();const xp=g.getS().xp;g.stampFestival();assert.equal(g.getS().xp,xp);
}
assert.equal(g.getS().xp,360);assert.equal(Object.keys(g.festivalStops()).length,3);
g.setS(JSON.parse(JSON.stringify(g.getS())));assert.equal(Object.keys(g.festivalStops()).length,3);
g.getS().realm='pokemon';assert.equal(Object.keys(g.festivalStops()).length,0);
g.loadRoom('pmontt',115,84);g.getS().coins=2999;g.regionalFestival();g.G.dialog.choices[0].fn();assert.equal(g.getS().coins,2999);
g.getS().coins=3000;g.getS().hp=1;g.regionalFestival();g.G.dialog.choices[0].fn();assert.equal(g.getS().coins,0);assert.equal(g.getS().hp,g.getS().maxHp);assert.equal(g.getS().beerTotal,1);
for(const d of Object.values(g.ROOMS))assert(!(d.props||[]).some(p=>p.style==='phone'));
// Cancelling or timing out a marathon restores the selected owned mount.
g.setS(g.newSave(0));g.G.dead=0;g.loadRoom('puertoOctay',19,68);g.G.enemies=[];g.G.eshots=[];g.G.aoes=[];g.getS().mounts=['mesa'];g.getS().mount='mesa';
g.startOctayRace();g.G.dialog.choices[0].fn();assert.equal(g.getS().mount,null);assert.equal(g.G.octayRace.mount,'mesa');
g.G.octayRace.t=20;g.startOctayRace();assert.equal(g.G.octayRace.t,20);
g.loadRoom('frutillar',115,84);assert(!g.G.octayRace);assert.equal(g.getS().mount,'mesa');
g.G.octayRace={next:0,t:2700,mount:'mesa'};g.getS().mount=null;g.G.roomId='puertoOctay';g.updateOctayRace();assert(!g.G.octayRace);assert.equal(g.getS().mount,'mesa');g.G.preview=false;
// Every dungeon staircase has room to turn and leave in each interior direction.
for(const realm of ['magic','pokemon'])for(const [dk,d]of Object.entries(g.DUNGEONS))for(let f=1;f<=d.floors+1;f++){
 g.setS(g.newSave(0));g.getS().realm=realm;g.G.preview=true;
 const room='D:'+dk+':'+f,def=g.getDef(room);
 for(let y=1;y<9;y++)for(let x=1;x<14;x++)if('UV'.includes(def.map[y][x])){
  g.goTo(room,def.map[y][x]);g.G.enemies=[];g.G.eshots=[];g.G.aoes=[];
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>0&&x+dx<14&&y+dy>0&&y+dy<9){
   assert(!g.blocked((x+dx)*16+3,(y+dy)*16+4,10,8),room+' narrow stairs '+x+','+y+' direction '+dx+','+dy);
   assert(!'lnqij'.includes(g.G.map[y+dy][x+dx]),room+' hazardous stair landing');
  }
  const position=[g.PL.x,g.PL.y];g.G.dialog=null;g.G.dead=0;g.updateWorld();assert.equal(g.G.roomId,room);assert.deepEqual([g.PL.x,g.PL.y],position);
 }
}
// Local temple opponents must have playable decks in every round, from strategy to replay.
for(const room of Object.keys(g.TEMPLE_IDENTITIES)){
 g.setS(g.newSave(0));g.G.preview=true;g.loadRoom(room,115,116);
 fullDeck('life');g.startTour('life',{rounds:4,diff:0,league:'curico'});
 for(let round=0;round<4;round++){
  const t=g.G.tour;t.round=round;t.phase='strategy';t.stage=0;t.strategyScore=0;t.decisions=[];
  assert(g.DECKS.some(d=>d.id===t.opps[round].deck),'Missing rival deck in '+room+' round '+round);
  g.drawTour();for(let choice=0;choice<3;choice++){t.sel=choice;g.prepRound();g.drawTour();}
  assert(t.ev.length>0);t.phase='duel';for(const event of t.ev){t.cur=event;t.lives=event.lives;g.drawTour();}
  t.phase='res';g.drawTour();
 }
 g.G.state='world';g.G.tour=null;
}
g.G.preview=false;
// Tempest's entrance must lead into the room, not just within speaking distance of its NPCs.
const tempestWalk=reachablePositions('salaTempest',115,116);assert(tempestWalk.some(([x,y])=>Math.abs(x-115)<8&&y<70),'Tempest entrance trapped');
// Regional leagues at level 50 are decided by visible points, regardless of extreme dice rolls.
for(const [key,cfg]of Object.entries(g.LEAGUES))for(const first of [0,1]){
 g.setS(g.newSave(0));g.G.preview=true;g.getS().lvl=50;g.loadRoom('salaTempest',115,116);fullDeck('life');g.startTour('life',{...cfg,league:key});
 for(let r=0;r<cfg.rounds;r++){
  const t=g.G.tour;t.round=r;t.opps[r].deck='landstill';t.intent='ctrl';t.stage=0;t.strategyScore=0;
  t.sel=1;g.prepRound();t.sel=1;g.prepRound();let dice=0;sandbox.Math.random=()=>dice++%2===(first===0?0:1)?.95:.05;t.sel=1;g.prepRound();
  assert(t.iwin,key+' should be easy at level 50');assert.equal(t.first,first);assert.equal(t.ev[0].who,first);assert(t.ev.every(e=>e.effect));assert(t.ev.at(-1).lives[1]<=0);
 }
}
g.setS(g.newSave(0));g.G.preview=true;g.getS().lvl=10;g.loadRoom('salaTempest',115,116);
for(let attempt=0;attempt<2;attempt++){fullDeck('life');g.startTour('life',{...g.LEAGUES.tempest,league:'tempest'});g.G.tour.wins=0;g.finishTour();}
fullDeck('life');g.startTour('life',{...g.LEAGUES.tempest,league:'tempest'});assert.equal(g.G.tour.retryBonus,2);g.G.tour.wins=5;g.G.tour.round=4;g.finishTour();assert.equal(g.getS().leagueRetries.tempest,0);
// Counters, healing and damage are narrated; the die cannot change a chosen strategy's result.
sandbox.Math.random=()=>.7;const counterReplay=g.genDuel('life','landstill',true,1);assert(counterReplay.some(e=>e.effect.includes('COUNTER')));assert(counterReplay.some(e=>e.effect.includes('VIDAS')));
g.setS(g.newSave(0));g.G.preview=true;g.loadRoom('pueblo',115,84);g.getS().lvl=99;g.addXP(5000);assert.equal(g.getS().lvl,100);assert.equal(g.levelCap(),100);g.addXP(5000);assert.equal(g.getS().lvl,100);
g.getS().lvl=106;g.getS().xp=123;const oldStats=JSON.stringify(g.getS().st);g.loadRoom('pueblo',115,84);assert.equal(g.getS().lvl,100);assert.equal(g.getS().beyondMagic.lvl,106);assert.equal(JSON.stringify(g.getS().st),oldStats);
g.switchRealm('pokemon');assert.equal(g.getS().lvl,106);assert.equal(g.getS().xp,123);assert.equal(g.levelCap(),200);g.getS().lvl=199;g.addXP(5000);assert.equal(g.getS().lvl,200);g.getS().xp=0;g.switchRealm('magic');assert.equal(g.getS().lvl,100);g.switchRealm('pokemon');assert.equal(g.getS().lvl,200);
g.setS(g.newSave(0));g.G.preview=true;g.getS().st.agi=300;g.loadRoom('valpo',115,84);const onFoot=g.speed();assert(onFoot<=1.8);let previous=onFoot;
for(const id of ['caballo','mesa','nightmare','charger','mammoth','shivan','crosis','darigaaz']){g.getS().mount=id;assert(g.speed()>previous);assert(g.speed()<=onFoot*1.36+.001);previous=g.speed();}
assert(g.MOUNTS.caballo.donkey);g.G.preview=false;
async function main(){
 const beforeIntro=g.getS();for(let ci=0;ci<19;ci++){g.setS(g.newSave(ci,ci===18?g.wizardDefaults():undefined));g.G.state='world';g.loadRoom('pueblo',195,134);const path=g.ashGuidePath();assert(path&&path.length>2,'Ash path for character '+ci);g.offerAshGuide();g.G.dialog=null;g.G.ashGuide.walking=true;for(let tick=0;tick<2000&&!g.getS().ashIntroDone;tick++){g.updateAshGuide();assert(!g.blocked(g.PL.x,g.PL.y,10,8));assert(!g.npcHit({x:g.PL.x,y:g.PL.y,w:10,h:8}));}assert(g.getS().ashIntroDone);assert.equal(g.PL.x,35);assert(g.G.dialog.choices.some(c=>c.t==='ENTRAR AL SAFARI'));g.G.dialog.choices[0].fn();assert.equal(g.G.roomId,'safari');assert.equal(g.getS().safariBalls,15);assert(!g.G.ashGuide);}
 for(const realm of ['magic','pokemon'])for(const region of g.SAFARI_REGIONS){const s=g.newSave(0);s.realm=realm;s.surf=false;g.setS(s);g.G.dialog=null;g.loadRoom(region.from,region.back[0]*16+3,region.back[1]*16+4);assert(!g.blocked(g.PL.x,g.PL.y,10,8));assert(!g.npcHit({x:g.PL.x,y:g.PL.y,w:10,h:8}));g.PL.x=region.gate[0]*16+3;g.PL.y=region.gate[1]*16+4;g.updateWorld();assert.equal(g.G.roomId,region.id);assert.equal(s.safariBalls,15);assert(g.G.wild.length>0);for(const wild of g.G.wild){if(realm==='pokemon'){assert(wild.magic);assert(g.MAGIC_SAFARI_POOLS[region.id].includes(wild.id));}else{assert(!wild.magic);assert(region.pool.some(n=>n.toUpperCase()===g.POKE[wild.id].n));}}g.drawWorld();g.PL.x=115;g.PL.y=132;g.updateWorld();assert.equal(g.G.roomId,region.from);g.updateWorld();assert.equal(g.G.roomId,region.from,'Exit must not enter safari again');}
 g.G.dialog=null;g.setS(beforeIntro);
 const previous=g.getS();const reflected=g.newSave(0);reflected.lvl=150;reflected.spellXp={bolt:1050};g.setS(reflected);assert.equal(g.spellLvl('bolt'),10);
 assert(!g.shopItems('magia').some(it=>g.REFLECT_SPELLS.some(s=>s[0]===it.id)));assert(!g.shopItems('armas').some(it=>g.ARMOR[it.id]?.realm==='pokemon'));
 reflected.realm='pokemon';assert.equal(g.shopItems('magia').filter(it=>g.SPELLS[it.id].realm==='pokemon').length,5);assert.equal(g.shopItems('armas').filter(it=>g.ARMOR[it.id]?.realm==='pokemon').length,5);
 reflected.lvl=80;assert.equal(g.shopItems('magia').filter(it=>g.SPELLS[it.id].realm==='pokemon').length,1);assert(g.itemLevel('armor',g.usableDrop('armor','escudoPsi'))<=80);
 reflected.lvl=150;const catalog=g.DECKS.map(d=>({name:g.deckLabel(d.id),cards:d.cards.map(id=>g.realmText(g.CARDS[id].n))}));
 if(process.argv.includes('--catalog')){fs.writeFileSync(require('path').join(__dirname,'../previews/mazos-pokemon.json'),JSON.stringify(catalog,null,2));fs.writeFileSync(require('path').join(__dirname,'../previews/pokemon-meta-references.json'),JSON.stringify({decks:g.POKEMON_META_DECKS,matchups:g.POKEMON_MATCHUPS},null,2));}
 let selected=null;const choices=g.deckChoices(g.DECKS,d=>selected=d.id,0);assert.equal(choices.filter(c=>c.deckId).length,6);assert(choices.some(c=>c.t.includes('2/2')));
 g.G.dialog={pages:[['MAZOS']],pi:0,ch:999,showChoices:true,choices,sel:0};g.drawDialog();assert(g.G.dialog.cbox.y>=4);{const c=g.G.dialog.cbox,b=g.G.dialog.box;assert(c.y+c.h<=160);assert(c.y>=b.y+b.h||c.y+c.h<=b.y,"las opciones tapan el dialogo");}choices[0].fn();assert.equal(selected,'burn');choices.find(c=>c.t.includes('2/2')).fn();assert(g.G.dialog.choices.some(c=>c.t.includes('ANTERIOR')));g.G.dialog.showChoices=true;g.G.dialog.ch=999;g.drawDialog();assert(g.G.dialog.cbox.y>=4);
 g.G.dialog=null;reflected.realm='magic';g.loadRoom('liga',115,116);fullDeck('burn');g.startTour('burn',{liga:true,rounds:5,name:'NACIONAL'});g.G.tour.wins=5;g.G.tour.round=4;g.G.tour.phase='end';g.finishTour();assert(g.G.tour.reward.ending);assert.equal(typeof g.G.tour.reward.coins,'number');g.drawTour();g.G.tour.t=50;g.K.a=1;g.updateTour();assert.equal(g.G.state,'ending');g.K.a=0;g.G.cardGet=null;g.step();g.G.t=600;emit(padButtons[4],'pointerdown',91);g.step();assert.equal(g.G.roomId,'santuarioPortal');emit(padButtons[4],'pointerup',91);g.step();g.setS(previous);

 const metaSave=g.newSave(0);metaSave.realm='pokemon';metaSave.lvl=100;g.setS(metaSave);g.G.dialog=null;
 assert.equal(g.activeDecks().length,20);assert.equal(g.POKEMON_META_DECKS.length,10);
 for(const d of g.POKEMON_META_DECKS){assert.equal(d.list.reduce((n,c)=>n+c.q,0),60);assert.equal(new Set(d.cards).size,12);assert(d.list.some(c=>c.n===d.star));for(const id of d.cards){assert.equal(g.CARDS[id].realm,'pokemon');assert(d.list.some(c=>c.n===g.CARDS[id].n));g.drawCardBig(id,0,0);g.addCard(id);}assert(metaSave.complete[d.id]);}
 for(const p of g.POKEMON_MATCHUPS){const a=g.pokemonMatchup(p.a,p.b),b=g.pokemonMatchup(p.b,p.a);assert.equal(a.bonus,-b.bonus);assert(Math.abs(a.bonus)<=1);if(p.n<20)assert.equal(a.bonus,0);}
 assert.equal(g.pokemonMatchup('pk_bolt','pk_gardevoir').bonus,-1);assert.equal(g.pokemonMatchup('pk_gardevoir','pk_bolt').bonus,1);assert.equal(g.pokemonMatchup('pk_lucario','pk_excadrill').bonus,1);assert.equal(g.pokemonMatchup('pk_gardevoir','pk_gardevoir').bonus,0);
 for(const a of g.POKEMON_META_DECKS)for(const b of g.POKEMON_META_DECKS){g.beginDuel({name:'META TEST',look:g.CHARS[0],deck:b.id,bonus:0,level:100},{id:a.id},0);g.G.duel.myT={agro:'ctrl',ctrl:'combo',combo:'agro'}[b.style];g.resolveDuel(g.G.duel);assert(Number.isFinite(g.G.duel.tot[0]));assert(g.G.duel.tot[0]>g.G.duel.tot[1],'At level 100, a correct tactic must beat each regular rival');g.drawDuel();}
 g.G.dialog=null;g.G.menu={tab:0,deck:null,sel:19};g.drawMenu();assert.equal(g.G.menu.deckScroll,11);g.menuClick({x:30,y:21});assert.equal(g.G.menu.sel,11);g.G.menu=null;
 for(const id of ['safari',...g.SAFARI_REGIONS.map(r=>r.id)]){g.G.dialog=null;g.loadRoom(id,115,116);for(const w of g.G.wild){assert(w.magic);assert(g.MAGIC_COMPANIONS[w.id]);}g.drawWorld();}
 g.G.wild=[{magic:true,id:'birds',x:90,y:80,t:0,st:100,hold:100}];g.G.balls=[{x:95,y:85,vx:0,vy:0,t:0}];const oldRandom=sandbox.Math.random;sandbox.Math.random=()=>0;g.updateSafari();sandbox.Math.random=oldRandom;assert(metaSave.magicDex.birds);assert.equal(metaSave.magicPet,'birds');assert.equal(Object.keys(metaSave.dex).length,0);g.chooseMagicPet();assert(g.G.dialog.choices.some(c=>c.t==='Birds of Paradise'));assert(!g.G.dialog.choices.some(c=>c.t==='Masticore'));g.G.dialog=null;
 metaSave.realm='magic';assert.equal(g.activeDecks().length,10);assert(g.realmCards().every(id=>g.CARDS[id].realm!=='pokemon'));assert(g.shopItems('liga').every(it=>g.CARDS[it.id]?.realm!=='pokemon'));g.setS(previous);
 const anytimeSave=g.newSave(0);anytimeSave.coins=1000000000;for(const id of g.DECKS[0].cards)anytimeSave.cards[id]=1;anytimeSave.leagues=Object.fromEntries(Object.keys(g.LEAGUES).map(key=>[key,true]));g.setS(anytimeSave);
 for(const realm of ['magic','pokemon'])for(const phase of ['dawn','day','dusk','night']){anytimeSave.realm=realm;g.G.forcePhase=phase;for(const zone of ['valpo','vina','pmontt','tolaria','tempest'])assert(g.leagueMapMarks(zone).every(mark=>mark.available),'League map must remain available at '+phase);if(realm==='magic'){for(const key of Object.keys(g.LEAGUES)){g.G.dialog=null;g.leagueTalk(key);assert(g.G.dialog.choices.some(c=>c.deckId),'Regional sign-up must open at '+phase);}g.loadRoom('liga',115,116);g.G.dialog=null;g.talkTo('ligaOrg',null,true);assert(g.G.dialog.choices.some(c=>c.deckId),'National sign-up must open at '+phase);}else{for(const room of Object.keys(g.POKEMON_GYMS)){g.loadRoom(room,115,116);g.G.dialog=null;g.pokemonGymTalk(g.G.def.gym.ids[0],g.G.npcs.find(n=>n.id===g.G.def.gym.ids[0]));assert(g.G.dialog.choices.some(c=>c.t==='DESAFIAR CON CARTAS'),'Gym challenge must open at '+phase);}}}
 g.G.forcePhase=null;g.G.dialog=null;g.setS(previous);
 // Real casts and impacts advance an existing level-five spell and persist before a level-up.
 const balance=g.newSave(0);balance.lvl=100;balance.realm='pokemon';balance.spells=['ice'];balance.spellXp={ice:'140'};balance.mp=100;g.setS(balance);g.G.preview=false;g.G.dead=0;g.loadRoom('bosque',115,84);g.G.shots=[];g.G.items=[];
 const originalRandom=sandbox.Math.random;sandbox.Math.random=()=>.99;
 assert.equal(g.spellLvl('ice'),5);const target=g.spawnEnemy('negator',100,60);
 for(let i=0;i<6;i++){g.castSpell(100,60);const shot=g.G.shots.at(-1);g.hitWithSpell(target,shot,false);const gained=balance.spellXp.ice;g.hitWithSpell(target,shot,true);assert.equal(balance.spellXp.ice,gained,'Splash must not multiply spell XP');}
 assert.equal(g.spellLvl('ice'),6);assert(g.spellProgress('ice')>0);assert.equal(g.loadSave(balance.slot||1).spellXp.ice,balance.spellXp.ice);
 balance.mp=0;const xpBefore=balance.spellXp.ice;g.castSpell();assert.equal(balance.spellXp.ice,xpBefore,'Failed cast grants no experience');g.drawHUD();
 // A champion meets durable enemies; full late-game gear cannot make every hit disappear.
 balance.st={fue:100,des:500,agi:100,int:100};for(const [slot] of g.GEAR_SLOTS)balance.gear[slot]='avance'+slot+'9';
 const foe=g.spawnEnemy('gob',100,60);assert(foe.hp>g.meleeDamage()*2,'Normal reflected enemy survives a champion critical');
 balance.maxHp=150;balance.hp=150;g.PL.inv=0;g.hurtPlayer(2,100,60,false);assert(balance.hp<=140,'Reflected enemy remains threatening through endgame armor');
 g.PL.inv=0;balance.hp=150;sandbox.Math.random=()=>.5;g.hurtPlayer(2,100,60,false);assert(balance.hp<150,'A high-defense shield must not guarantee blocking');
 assert(g.monsterCardChance()<=.24);const firstPool=new Set(g.reflectedDropCards());assert(firstPool.size<new Set(g.POKEMON_META_DECKS.flatMap(d=>d.cards)).size);
 g.G.items=[];g.dropLoot(foe);assert.equal(g.G.items.filter(i=>i.k==='card').length,0,'High dexterity cannot force every monster to drop a card');
 g.loadRoom('volcan',115,84);assert(g.reflectedDropCards().some(id=>!firstPool.has(id)),'Advanced regions offer new cards');
 balance.realm='magic';g.loadRoom('bosque',115,84);const magicFoe=g.spawnEnemy('gob',100,60);assert(magicFoe.hp<foe.hp);balance.realm='pokemon';balance.spellXp.ice=999999;g.gainSpellXp('ice',20);assert.equal(g.spellLvl('ice'),20);assert.equal(g.spellProgress('ice'),1);
 sandbox.Math.random=originalRandom;g.setS(previous);console.log('PASS: spell impacts/persistence, level-five ice progresses, champion combat and shield limits, regional card pools and bounded drops.');
 const rider=g.newSave(0);rider.realm='pokemon';rider.mounts=['shivan'];g.setS(rider);g.loadRoom('establo',115,100);g.G.dialog=null;g.talkTo('caballerizo',null,true);const mountChoice=g.G.dialog.choices.find(c=>c.t.startsWith('MONTAR '));assert(mountChoice);assert.equal(g.realmText(mountChoice.t),'MONTAR MEWTWO GIGANTE');mountChoice.fn();assert.equal(rider.mount,'shivan');assert(g.mounted(),'Selecting a mount must show it inside the stable');assert.equal(g.reflectedMount(rider.mount).id,149);
 let mountImages=0;drawing.drawImage=()=>mountImages++;g.drawMount('shivan',90,80,3,0,'back');g.drawMount('shivan',90,80,3,0,'front');assert.equal(mountImages,1,'Reflected mount must render its Pokemon sprite once');for(const id of Object.keys(g.MOUNTS)){assert(g.POKE[g.reflectedMount(id).id]);for(const dir of [0,1,2,3])g.drawMount(id,90,80,dir,0,'back');}delete drawing.drawImage;
 g.G.dialog=null;g.loadRoom('valpo',115,100);assert(g.mounted());g.saveGame();assert.equal(g.loadSave(rider.slot||1).mount,'shivan');g.loadRoom('casa',115,100);assert.equal(g.mounted(),null,'Mounts remain hidden in ordinary houses');rider.realm='magic';g.loadRoom('establo',115,100);assert.equal(g.mounted(),g.MOUNTS.shivan);g.drawMount('shivan',90,80,3,0,'back');g.setS(previous);
 // Walking advances the gait by actual distance and stops its pose when standing still.
 const gait=g.newSave(0);g.setS(gait);g.G.preview=true;g.G.state='world';g.loadRoom('pueblo',115,84);g.G.enemies=[];g.G.eshots=[];g.G.aoes=[];g.G.moveTarget=null;g.PL.atk=g.PL.kb=0;for(const key in g.K)g.K[key]=0;
 for(const mount of [null,'caballo']){gait.mount=mount;g.PL.x=115;g.PL.y=84;const start=g.PL.walk;g.K.right=1;g.updateWorld();assert(g.PL.moving);assert(g.PL.walk>start);g.drawRider(90,80,g.CHARS[0],3,Math.floor(g.PL.walk)%2);g.K.right=0;g.updateWorld();assert(!g.PL.moving);g.drawRider(90,80,g.CHARS[0],3,0);}
 // Automatic healing waits after damage and never restores health in nearby danger.
 const recovery=g.newSave(0);g.setS(recovery);g.G.preview=false;g.G.state='world';g.loadRoom('mercado',115,84);recovery.maxHp=100;recovery.hp=50;recovery.coins=20000;
 Object.assign(g.G,{dead:0,dialog:null,menu:null,shop:null,warp:null,cardGet:null,ashGuide:null,waking:0,enemies:[],eshots:[],aoes:[],lastHurtFrame:3000});
 g.setFrame(3420);g.recoverLife();assert.equal(recovery.hp,50,'Recent damage delays recovery');g.setFrame(3600);g.recoverLife();assert.equal(recovery.hp,51);
 g.G.enemies=[{x:g.PL.x,y:g.PL.y,dead:false}];g.setFrame(3780);g.recoverLife();assert.equal(recovery.hp,51,'Nearby live enemies block recovery');g.G.enemies=[];g.G.eshots=[{}];g.setFrame(3960);g.recoverLife();assert.equal(recovery.hp,51);g.G.eshots=[];g.G.aoes=[{}];g.recoverLife();assert.equal(recovery.hp,51);g.G.aoes=[];
 recovery.hp=99;g.setFrame(4140);g.recoverLife();assert.equal(recovery.hp,100);g.setFrame(4320);g.recoverLife();assert.equal(recovery.hp,100);recovery.hp=0;g.recoverLife();assert.equal(recovery.hp,0);recovery.hp=50;g.G.dead=1;g.recoverLife();assert.equal(recovery.hp,50);g.G.dead=0;
 // Buy/use/refill every potion; full health does not waste one. Saves retain their stock.
 g.G.shop={kind:'pociones',sel:0,scroll:0,items:g.shopItems('pociones')};assert.equal(g.G.shop.items.length,4);assert(g.shopItems('armas').some(i=>i.kind==='potion'));
 const basic=g.G.shop.items[0];g.buyItem(basic);assert.equal(recovery.coins,19500);assert.equal(recovery.potions.pocion,1);assert(g.usePotion('pocion'));assert.equal(recovery.hp,70);assert.equal(recovery.potions.pocion,0);assert(!g.usePotion('pocion'));
 recovery.coins=100000;for(const [id,p]of Object.entries(g.POTIONS)){g.G.shop.items=g.shopItems('pociones');g.buyItem(g.G.shop.items.find(i=>i.id===id));recovery.hp=1;assert(g.usePotion(id));assert.equal(recovery.hp,Math.min(100,1+p.heal));}
 g.buyItem(g.G.shop.items.find(i=>i.id==='pocion'));recovery.hp=100;const stock=recovery.potions.pocion;assert(!g.usePotion('pocion'));assert.equal(recovery.potions.pocion,stock);const saved=g.loadSave(1);assert.equal(saved.potions.pocion,stock);g.G.shop=null;g.openPotions();assert(g.G.dialog.choices.some(c=>c.t.includes('Pocion')));g.G.dialog=null;g.talkTo('mago',null,true);assert(g.G.dialog.choices.some(c=>c.t==='COMPRAR POCIONES'));g.G.dialog=null;
 // Deposited money persists, transfers conserve totals and death only halves pocket money.
 recovery.coins=40000;assert(g.bankTransfer(30000));assert.equal(recovery.coins,10000);assert.equal(recovery.bankCoins,30000);assert(!g.bankTransfer(-1));assert(!g.bankTransfer('bad'));assert(g.bankTransfer(9000,true));assert.equal(recovery.coins+recovery.bankCoins,40000);assert(g.bankTransfer(999999,true));assert.equal(recovery.bankCoins,0);assert.equal(recovery.coins,40000);g.bankTransfer(30000);
 assert.equal(g.loadSave(1).bankCoins,30000);g.G.state='world';g.G.dead=150;g.G.dialog=null;g.G.menu=null;g.step();assert.equal(recovery.coins,5000);assert.equal(recovery.bankCoins,30000);assert.equal(g.loadSave(1).bankCoins,30000);g.G.dialog=null;
 for(const realm of ['magic','pokemon']){recovery.realm=realm;g.loadRoom('bancoCondes',115,116);g.drawWorld();g.talkTo('banquero',null,true);assert(g.G.dialog.choices.some(c=>c.t==='DEPOSITAR'));g.G.dialog=null;g.bankTransfer(1,true);const total=recovery.coins+recovery.bankCoins;g.switchRealm(realm==='magic'?'pokemon':'magic');assert.equal(recovery.coins+recovery.bankCoins,total);}
 // A mission icon on the reflected village chronicler must open the actual quest.
 const questSave=g.newSave(0);questSave.realm='pokemon';g.setS(questSave);g.G.preview=true;g.loadRoom('pueblo',115,116);g.G.dialog=null;assert.equal(g.questMarker('cronista'),'!');g.talkTo('cronista',g.G.npcs.find(n=>n.id==='cronista'));const accept=g.G.dialog.choices.find(c=>c.t==='ACEPTAR');assert(accept);accept.fn();assert.equal(questSave.quests.q_mazo2.st,'active');assert.equal(g.questMarker('cronista'),null);
 questSave.found.q_mazo2=1;assert.equal(g.questMarker('cronista'),'?');g.talkTo('cronista',null);assert.equal(questSave.quests.q_mazo2.st,'done');g.G.dialog=null;
 for(const room of Object.keys(g.POKEMON_GYMS)){g.loadRoom(room,115,116);const leader=g.G.npcs.find(n=>n.id===g.G.def.gym.ids[3]);assert(leader.y<60,'Leader is at the back, away from the entrance');assert(g.G.def.props.some(p=>p.k==='gymThrone'));for(const n of g.G.npcs)assert.equal(g.questMarker(n.id),null,'Gym has a mission NPC '+n.id);for(const p of g.G.def.props.filter(p=>p.k==='standings'))assert.equal(p.y,0);}
 // No borrowed or incomplete league deck, while casual duels still offer borrowing.
 g.loadRoom('cartasCurico',115,116);g.G.tour=null;g.startTour('burn',{league:'curico',rounds:4});assert.equal(g.G.tour,null);g.G.dialog=null;g.G.duel=null;const challenge={key:'curico',index:0,npc:g.G.def.gym.ids[0]};g.beginDuel({name:'LEAGUE',look:g.CHARS[0],deck:'pk_bolt',gym:challenge},{id:'pk_dragapult',borrowed:true},0);assert.equal(g.G.duel,null);
 g.G.dialog=null;g.beginPokemonGymMatch(0);assert(!g.G.dialog.choices.some(c=>c.t.includes('PRESTADO')));g.G.dialog=null;g.loadRoom('pueblo',115,116);g.setupDuel({id:'fan1'});assert(g.G.dialog.pages.flat().some(s=>s.includes('presto uno')));g.G.dialog=null;
 // Original scans are exact set/number cards; Pokemon HP/prizes follow those references.
 const manifest=JSON.parse(fs.readFileSync(require('path').join(__dirname,'../assets/pokemon-cards/sources.json'),'utf8'));assert.equal(Object.keys(manifest).length,88);
 for(const [id,m]of Object.entries(manifest)){assert.equal(m.name,g.CARDS[id].n);const png=fs.readFileSync(require('path').join(__dirname,'../assets/pokemon-cards',id+'.png'));assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');if(g.CARDS[id].t==='POKEMON'){assert(m.hp>0);assert.equal(g.POKEMON_CARD_STATS[id].hp,m.hp);assert.equal(m.prizes,m.name.startsWith('Mega ')?3:/ ex$/.test(m.name)?2:1);}}
 // Knocking out normal/ex/Mega awards 1/2/3, brings up the bench, and stops at six.
 for(const prizes of [1,2,3]){const battle=g.newPokemonBattle('pk_dragapult','pk_gardevoir'),old=battle.active[1].id;Object.assign(battle.active[1],{hp:10,prizes});g.pokemonStrike(battle,0,10);assert.equal(battle.prizes[0],prizes);assert.notEqual(battle.active[1].id,old);assert.equal(battle.active[1].hp,battle.active[1].max);assert.equal(battle.bench[1].length,4);battle.prizes[0]=5;battle.active[1].hp=1;battle.active[1].prizes=3;g.pokemonStrike(battle,0,10);assert.equal(battle.prizes[0],6);assert.equal(battle.winner,0);const hp=battle.active[0].hp;g.pokemonStrike(battle,1,100);assert.equal(battle.active[0].hp,hp);}
 for(const a of g.POKEMON_META_DECKS)for(const b of g.POKEMON_META_DECKS)for(const win of [true,false]){const events=g.genPokemonReplay(a.id,b.id,win,1);assert(events.length>0&&events.length<100);const last=events.at(-1).pokemon;assert.equal(last.winner,win?0:1);assert.equal(last.prizes[win?0:1],6);assert(events.some(e=>e.pokemon.lastKO));assert(!events.some(e=>e.effect.includes('VIDAS')));}
 questSave.lvl=100;for(const a of g.POKEMON_META_DECKS){g.beginDuel({name:'TEST KO',look:g.CHARS[0],deck:'pk_gardevoir',level:100},{id:a.id},0);for(let turn=0;turn<40&&g.G.duel.pokemon.winner===null;turn++){g.G.duel.myT='combo';g.resolveDuel(g.G.duel);g.drawDuel();}assert.equal(g.G.duel.pokemon.winner,0);assert.equal(g.G.duel.pokemon.prizes[0],6);}
 for(const d of g.POKEMON_META_DECKS[0].cards)questSave.cards[d]=1;g.loadRoom('cartasCurico',115,116);g.startTour('pk_dragapult',{rounds:4,league:'curico'});for(let i=0;i<3;i++)g.prepRound();assert.deepEqual(Array.from(g.G.tour.lives),[6,6]);g.G.tour.phase='duel';for(const event of g.G.tour.ev){g.G.tour.cur=event;g.G.tour.pokemon=event.pokemon;g.drawTour();}g.G.tour.phase='res';g.drawTour();g.G.tour=null;g.G.duel=null;
 // All Grand Slam courts are selectable, affect the ball, and free Pong uses tennis too.
 for(let i=0;i<4;i++){g.startArcade('tenis');assert(g.G.arc.tennis.selectCourt);g.G.arc.tennis.court=i;g.drawArcade();g.K.a=1;g.updateArcade();g.K.a=0;assert(!g.G.arc.tennis.selectCourt);g.G.arc.t=101;g.K.a=1;g.updateArcade();g.K.a=0;assert.equal(g.G.arc.tennis.vy,-1.8*g.TENNIS_COURTS[i].speed);for(let point=0;point<12;point++)g.tennisPoint(g.G.arc,0);assert(g.G.arc.done&&g.G.arc.won);assert(g.G.arc.resultText.includes(g.TENNIS_COURTS[i].n));g.drawArcade();g.cancelArcade();}
 g.startFree('pong');assert(g.G.arc.tennis);g.drawArcade();g.requestArcadeExit();assert(g.G.arc.exitConfirm);g.cancelArcade();g.G.preview=false;g.setS(previous);
 console.log('PASS: slow safe recovery and damage delay, potion purchases/use/stock, bank transfers and death protection, reflected quest acceptance/turn-in, gym leaders and no borrowed league decks, 88 original card scans, 200 six-prize replays, active Pokemon/bench and four tennis courts.');
 const encoded=await g.encodeSave(custom), decoded=await g.decodeSave(encoded);
 assert.equal(decoded.customChar.n,'Mi personaje');assert.equal(g.characterOf(decoded).c.eye,'#1122ff');
console.log('PASS: portal reversible, sello de Urza y paz, seis gimnasios con cuatro rivales, reputacion, economia por nivel, botin utilizable, casa inicial y Oktoberfest; partidas antiguas y cinco espacios, personajes, misiones y patrullas, equipo avanzado, fases del dia, magia 20, exclusivos del reflejo, seleccion de mazos paginada, ceremonia nacional, mascotas, experiencia de ligas, Surf, peligros y pausa de tres minutos, buscaobjetos, siete arcades, vista Pokemon sin guardar; acceso a NPC y puertas en '+auditRooms.length+' mapas.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
