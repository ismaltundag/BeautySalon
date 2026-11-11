import {randomBytes,createHash,scryptSync,timingSafeEqual} from 'node:crypto';
import {db} from '@/lib/db';
const cookie='maison_session';
const hashToken=(v:string)=>createHash('sha256').update(v).digest('hex');
export function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex')}
export function verifyPassword(password:string,stored:string){try{const [salt,hex]=stored.split(':');const expected=Buffer.from(hex,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual)}catch{return false}}
export async function currentUser(req:Request){const raw=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookie+'='))?.slice(cookie.length+1);if(!raw||!/^[a-f0-9]{64}$/.test(raw))return null;const sql=db();const rows=await sql`SELECT u.id,u.email,u.role FROM owner_sessions s JOIN owner_users u ON u.id=s.user_id WHERE s.token_hash=${hashToken(raw)} AND s.expires_at>now() LIMIT 1`;return rows[0]||null}
export async function ownerAuthenticated(req:Request){try{return Boolean(await currentUser(req))}catch{return false}}
export async function issueSession(userId:string){const raw=randomBytes(32).toString('hex');const sql=db();await sql`INSERT INTO owner_sessions(token_hash,user_id,expires_at) VALUES(${hashToken(raw)},${userId},now()+interval '8 hours')`;return cookie+'='+raw+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800'}
export async function revokeSession(req:Request){const raw=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookie+'='))?.slice(cookie.length+1);if(raw&&/^[a-f0-9]{64}$/.test(raw)){const sql=db();await sql`DELETE FROM owner_sessions WHERE token_hash=${hashToken(raw)}`}}
export function clearOwnerCookie(){return cookie+'=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'}
