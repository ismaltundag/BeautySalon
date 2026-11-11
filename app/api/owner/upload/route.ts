import {put} from '@vercel/blob';
import {ownerAuthenticated} from '@/lib/owner-auth';
export const runtime='nodejs';
export async function POST(req:Request){
 if(!(await ownerAuthenticated(req)))return Response.json({error:'Sign in required'},{status:401});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return Response.json({error:'Image storage is not configured'},{status:503});
 try{
 const form=await req.formData(),file=form.get('file');
 if(!(file instanceof File))return Response.json({error:'Choose an image'},{status:400});
 if(file.size>4*1024*1024||file.size===0)return Response.json({error:'Image must be under 4 MB'},{status:400});
 const types=['image/jpeg','image/png','image/webp','image/avif'];if(!types.includes(file.type))return Response.json({error:'Use JPG, PNG, WebP or AVIF'},{status:400});
 const extension=file.type==='image/jpeg'?'jpg':file.type.split('/')[1];const name='salon/'+crypto.randomUUID()+'.'+extension;
 const blob=await put(name,file,{access:'public',contentType:file.type,addRandomSuffix:false});
 return Response.json({url:blob.url});
 }catch(e){console.error('Image upload failed',e);return Response.json({error:'Upload failed'},{status:500})}
}
