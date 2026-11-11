import {db} from '@/lib/db';
import {hashPassword,issueSession} from '@/lib/owner-auth';
import {timingSafeEqual} from 'node:crypto';
export const runtime='nodejs';
export async function POST(req:Request){let b:any;try{b=await req.json()}catch{return Response.json({error:'Invalid request'},{status:400})}
const email=String(b.email||'').trim().toLowerCase(),password=b.password,bootstrap=b.bootstrapPassword;
if(email!=='ismaltundag@gmail.com'||typeof password!=='string'||password.length<14||password.length>128||password==='TestingAdminDashboard123')return Response.json({error:'Use the designated admin email and a new password of at least 14 characters'},{status:400});
const secret=process.env.OWNER_PASSWORD;if(!secret||typeof bootstrap!=='string'||Buffer.byteLength(secret)!==Buffer.byteLength(bootstrap)||!timingSafeEqual(Buffer.from(secret),Buffer.from(bootstrap)))return Response.json({error:'Invalid setup authorization'},{status:403});
try{const sql=db();const [count]=await sql`SELECT count(*)::int AS n FROM owner_users`;if(count.n!==0)return Response.json({error:'Setup already completed'},{status:409});const hash=hashPassword(password);const [user]=await sql`INSERT INTO owner_users(email,password_hash,role) VALUES(${email},${hash},'admin') RETURNING id`;return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':await issueSession(user.id)}})}catch{return Response.json({error:'Setup failed'},{status:500})}}
