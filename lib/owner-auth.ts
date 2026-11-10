import {createHmac,timingSafeEqual} from 'node:crypto';
const cookieName='maison_owner';
function sign(value:string){return createHmac('sha256',process.env.ADMIN_API_KEY||'unconfigured').update(value).digest('hex')}
export function ownerAuthenticated(req:Request){const token=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!token||!process.env.ADMIN_API_KEY||process.env.ADMIN_API_KEY.length<32)return false;const [expiry,signature]=token.split('.');if(!expiry||!signature||!/^\d+$/.test(expiry)||Number(expiry)<Date.now())return false;const expected=sign(expiry),a=Buffer.from(expected),b=Buffer.from(signature);return a.length===b.length&&timingSafeEqual(a,b)}
export function issueOwnerCookie(){const expiry=String(Date.now()+8*60*60*1000);return cookieName+'='+expiry+'.'+sign(expiry)+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800'}
export function clearOwnerCookie(){return cookieName+'=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'}
export function validOwnerPassword(value:unknown){const secret=process.env.OWNER_PASSWORD;if(!secret||secret.length<12||typeof value!=='string')return false;const a=Buffer.from(secret),b=Buffer.from(value);return a.length===b.length&&timingSafeEqual(a,b)}
