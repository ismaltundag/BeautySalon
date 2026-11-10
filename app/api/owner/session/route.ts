import {ownerAuthenticated,issueOwnerCookie,clearOwnerCookie,validOwnerPassword} from '@/lib/owner-auth';
export const runtime='nodejs';
export async function GET(req:Request){return Response.json({authenticated:ownerAuthenticated(req),configured:Boolean(process.env.OWNER_PASSWORD&&process.env.OWNER_PASSWORD.length>=12)},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){let body:any;try{body=await req.json()}catch{return Response.json({error:'Invalid request'},{status:400})}if(!validOwnerPassword(body?.password))return Response.json({error:'Invalid credentials or owner login not configured'},{status:401});return Response.json({authenticated:true},{headers:{'Set-Cookie':issueOwnerCookie(),'Cache-Control':'no-store'}})}
export async function DELETE(){return Response.json({authenticated:false},{headers:{'Set-Cookie':clearOwnerCookie(),'Cache-Control':'no-store'}})}
