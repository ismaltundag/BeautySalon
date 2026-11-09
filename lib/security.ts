import {timingSafeEqual} from 'node:crypto';
export function isAdmin(req:Request){const expected=process.env.ADMIN_API_KEY;const supplied=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'')||'';if(!expected||expected.length<32||!supplied)return false;const a=Buffer.from(expected),b=Buffer.from(supplied);return a.length===b.length&&timingSafeEqual(a,b)}
export function unauthorized(){return Response.json({error:'Unauthorized'},{status:401})}
export function badRequest(message='Invalid request'){return Response.json({error:message},{status:400})}
export function text(v:unknown,max=250){return typeof v==='string'&&v.trim().length>0&&v.trim().length<=max?v.trim():null}
export function positiveInt(v:unknown){return typeof v==='number'&&Number.isSafeInteger(v)&&v>=0?v:null}
export function uuid(v:unknown){return typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)}
export async function json(req:Request){try{return await req.json()}catch{return null}}
