export const TILE=3;
export function cellPosition(x,y){return {x:(x-7)*TILE,z:(y-4.5)*TILE};}
export function canWalk(room,solid,x,z,radius=.36){for(const dx of [-radius,radius])for(const dz of [-radius,radius]){const tx=Math.floor((x+dx)/TILE+7.5),ty=Math.floor((z+dz)/TILE+5);if(tx<0||tx>=15||ty<0||ty>=10||solid.includes(room.map[ty][tx])||room.blocked?.includes(`${tx},${ty}`))return false;}return true;}
export function movePlayer(room,solid,position,dx,dz){const x=position.x+dx,z=position.z+dz;if(canWalk(room,solid,x,position.z))position.x=x;if(canWalk(room,solid,position.x,z))position.z=z;return position;}
