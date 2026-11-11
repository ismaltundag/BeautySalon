import {db,dbError} from '@/lib/db';
import {getPayload} from 'payload';
import config from '@payload-config';
export const runtime='nodejs';
export async function GET(){try{
 // Switch to the new CMS after the first successful legacy import.
 // Until then, the existing live content remains available unchanged.
 try {
  const payload=await getPayload({config});
  const [services,products,gallery,staff,settings]=await Promise.all([
   payload.find({collection:'salon-services',limit:200,where:{active:{equals:true}},sort:'sortOrder',overrideAccess:true}),
   payload.find({collection:'salon-products',limit:200,where:{active:{equals:true}},overrideAccess:true}),
   payload.find({collection:'salon-gallery',limit:100,where:{active:{equals:true}},sort:'sortOrder',overrideAccess:true}),
   payload.find({collection:'salon-team',limit:100,where:{active:{equals:true}},sort:'sortOrder',overrideAccess:true}),
   payload.findGlobal({slug:'site-settings',overrideAccess:true}),
  ]);
  if(services.totalDocs || products.totalDocs || gallery.totalDocs || staff.totalDocs){
   const mediaUrl=(x:any)=>typeof x==='object'&&x?.url?x.url:null;
   return Response.json({
    settings:{brand:settings.brand,headline:settings.headline,tagline:settings.tagline,
     accent:settings.accent||'#394438',announcement:settings.announcement,about:(settings as any).legacyAbout||'',
     membership_title:settings.membershipTitle,content:(settings as any).legacyContent||{},
     hero_image_url:mediaUrl(settings.heroImage)||(settings as any).legacyHeroImageUrl||null},
    services:services.docs.map((x:any)=>({id:x.legacyId||String(x.id),name:x.name,category:x.category,
     description:x.description,details:x.details,preparation:x.preparation,aftercare:x.aftercare,
     price_cents:Math.round((x.price||0)*100),duration_minutes:x.durationMinutes||0,
     image_url:mediaUrl(x.image)||x.legacyImageUrl})),
    products:products.docs.map((x:any)=>({id:x.legacyId||String(x.id),name:x.name,category:x.category,
     description:x.description,price_cents:Math.round((x.price||0)*100),inventory:x.inventory,
     image_url:mediaUrl(x.image)||x.legacyImageUrl})),
    gallery:gallery.docs.map((x:any)=>({id:x.legacyId||String(x.id),title:x.title,category:x.category,
     description:x.description,image_url:mediaUrl(x.image)||x.legacyImageUrl})),
    staff:staff.docs.map((x:any)=>({id:x.legacyId||String(x.id),name:x.name,bio:x.bio,
     specialty:x.specialty,image_url:mediaUrl(x.photo)||x.legacyImageUrl})),
    memberships:[],
   },{headers:{'Cache-Control':'no-store'}});
  }
 } catch(e){console.error('CMS catalog unavailable, serving original catalog',e)}
 const sql=db();const [settings,services,products,memberships,gallery,staff]=await Promise.all([
 sql`SELECT brand,headline,tagline,accent,announcement,about,membership_title,content,hero_image_url FROM site_settings WHERE id=1`,
 sql`SELECT id,name,category,description,price_cents,duration_minutes,image_url,description,details,preparation,aftercare FROM services WHERE active=true ORDER BY sort_order,name LIMIT 200`,
 sql`SELECT id,name,category,description,price_cents,inventory,image_url FROM products WHERE active=true ORDER BY name LIMIT 200`,
 sql`SELECT id,name,description,monthly_price_cents FROM memberships WHERE active=true ORDER BY monthly_price_cents LIMIT 50`,sql`SELECT id,title,category,image_url,description FROM gallery_items WHERE active=true ORDER BY sort_order,created_at LIMIT 100`,sql`SELECT id,name,bio,image_url,specialty FROM staff WHERE active=true ORDER BY sort_order,name LIMIT 100`
]);return Response.json({settings:settings[0]||null,services,products,memberships,gallery,staff},{headers:{'Cache-Control':'no-store'}})}catch(e){return dbError(e)}}
