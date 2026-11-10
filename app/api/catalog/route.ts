import {db,dbError} from '@/lib/db';
export const runtime='nodejs';
export async function GET(){try{const sql=db();const [settings,services,products,memberships]=await Promise.all([
 sql`SELECT brand,headline,tagline,accent,announcement,about,membership_title,content,hero_image_url FROM site_settings WHERE id=1`,
 sql`SELECT id,name,category,description,price_cents,duration_minutes,image_url FROM services WHERE active=true ORDER BY sort_order,name LIMIT 200`,
 sql`SELECT id,name,category,description,price_cents,inventory,image_url FROM products WHERE active=true ORDER BY name LIMIT 200`,
 sql`SELECT id,name,description,monthly_price_cents FROM memberships WHERE active=true ORDER BY monthly_price_cents LIMIT 50`
]);return Response.json({settings:settings[0]||null,services,products,memberships},{headers:{'Cache-Control':'no-store'}})}catch(e){return dbError(e)}}
