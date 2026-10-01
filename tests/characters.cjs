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
source=source.replace(/\}\)\(\);\s*$/, `globalThis.gameTest={CHARS,CUSTOM_CHAR,normalizeCustom,customCharacter,characterOf,newSave,loadSave,saveGame,slotKey,speed,defense,aquaticBonus,loadRoom,checkConnectivity,drawSelect,drawPerson,drawDuel,drawTour,beginDuel,updateDuel,oppPick,startTour,prepRound,updateItems,step,encodeSave,decodeSave,myState,remoteCharacter,FRIEND_LINES,FRIEND_DECK,FRIENDS_ON_MAP,getDef,SOLID,setSelectScroll,selectMaxScroll,revealSelected,selectAt,G,PL,wizardDefaults,setS(value){S=value;},getS(){return S;},setFrame(value){frame=value;}};})();`);
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
async function main(){
 const encoded=await g.encodeSave(custom), decoded=await g.decodeSave(encoded);
 assert.equal(decoded.customChar.n,'Mi personaje');assert.equal(g.characterOf(decoded).c.eye,'#1122ff');
 console.log('PASS: personajes anteriores, 6 amigos nuevos, límites, partidas independientes, exportación/importación, velocidad, monedas, defensa, peces, Rai, predicción y conectividad.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
