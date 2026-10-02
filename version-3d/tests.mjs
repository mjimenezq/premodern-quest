import fs from 'node:fs';
import assert from 'node:assert/strict';
import {cellPosition,canWalk,movePlayer} from './navigation.mjs';
const data=JSON.parse(fs.readFileSync(new URL('./world.json',import.meta.url)));
for(const [id,room] of Object.entries(data.rooms)){
 assert.equal(room.map.length,10);room.map.forEach(row=>assert.equal(row.length,15));
 const spawn=cellPosition(7,7);assert(canWalk(room,data.solid,spawn.x,spawn.z),id+' spawn accessible');
 const visited=new Set(['7,7']),queue=[[7,7]];
 while(queue.length){const [x,y]=queue.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`,p=cellPosition(nx,ny);if(!visited.has(key)&&canWalk(room,data.solid,p.x,p.z)){visited.add(key);queue.push([nx,ny]);}}}
 for(const door of Object.keys(room.doors||{}))assert(visited.has(door),id+' accessible door '+door);
 for(let y=0;y<10;y++)for(let x=0;x<15;x++)if(data.solid.includes(room.map[y][x])||room.blocked?.includes(`${x},${y}`)){const p=cellPosition(x,y);assert(!canWalk(room,data.solid,p.x,p.z));}
 const p={...spawn};movePlayer(room,data.solid,p,.1,0);assert.equal(p.x,spawn.x+.1);assert(!canWalk(room,data.solid,999,999));
}
const runtime=fs.readFileSync(new URL('./game.js',import.meta.url),'utf8');assert(!/localStorage|sessionStorage|pmq_save|\.\.\/index\.html/.test(runtime));
assert(fs.existsSync(new URL('./vendor/package/build/three.core.js',import.meta.url)));
console.log('3D: map boundaries, obstacles, accessible entrances, movement and save isolation passed.');
