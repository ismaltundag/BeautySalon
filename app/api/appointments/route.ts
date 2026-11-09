import {db,dbError} from '@/lib/db';
import {badRequest,json,text,uuid} from '@/lib/security';
export const runtime='nodejs';
export async function POST(req:Request){
 const body=await json(req);if(!body||typeof body!=='object')return badRequest();
 const name=text(body.name,120),email=text(body.email,254),serviceId=body.serviceId,staffId=body.staffId||null,notes=body.notes===undefined?'':text(body.notes,1000);
 const start=typeof body.preferredStart==='string'?new Date(body.preferredStart):new Date(NaN);
 if(!name||!email||!/^\S+@\S+\.\S+$/.test(email)||!uuid(serviceId)||(staffId&&!uuid(staffId))||notes===null||!Number.isFinite(start.getTime())||start.getTime()<Date.now()+3600000||start.getTime()>Date.now()+180*86400000)return badRequest('Invalid appointment request');
 try{const sql=db();
 const svc=await sql`SELECT id FROM services WHERE id=${serviceId} AND active=true`;if(!svc.length)return badRequest('Service not found');
 if(staffId){const st=await sql`SELECT 1 FROM staff_services ss JOIN staff s ON s.id=ss.staff_id WHERE ss.staff_id=${staffId} AND ss.service_id=${serviceId} AND s.active=true`;if(!st.length)return badRequest('Staff member does not offer this service')}
 const result=await sql`WITH customer AS (
 INSERT INTO customers(name,email) VALUES(${name},${email}) RETURNING id
 ) INSERT INTO appointment_requests(customer_id,service_id,staff_id,preferred_start,notes)
 SELECT id,${serviceId},${staffId},${start.toISOString()},${notes} FROM customer
 RETURNING id,status,created_at`;
 return Response.json({request:result[0],message:'Request received; appointment is not confirmed.'},{status:201,headers:{'Cache-Control':'no-store'}})
 }catch(e){return dbError(e)}
}
