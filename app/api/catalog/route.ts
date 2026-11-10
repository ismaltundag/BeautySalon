import {db,dbError} from '@/lib/db';
export const runtime='nodejs';
export async function GET(){try{const sql=db();const [settings,services,products,memberships,gallery,staff]=await Promise.all([
 sql`SELECT brand,headline,tagline,accent,announcement,about,membership_title,content,hero_image_url FROM site_settings WHERE id=1`,
 sql`SELECT id,name,category,description,price_cents,duration_minutes,image_url,description,details,preparation,aftercare FROM services WHERE active=true ORDER BY sort_order,name LIMIT 200`,
 sql`SELECT id,name,category,description,price_cents,inventory,image_url FROM products WHERE active=true ORDER BY name LIMIT 200`,
 sql`SELECT id,name,description,monthly_price_cents FROM memberships WHERE active=true ORDER BY monthly_price_cents LIMIT 50`,sql`SELECT id,title,category,image_url,description FROM gallery_items WHERE active=true ORDER BY sort_order,created_at LIMIT 100`,sql`SELECT id,name,bio,image_url,specialty FROM staff WHERE active=true ORDER BY sort_order,name LIMIT 100`
]);return Response.json({settings:settings[0]||null,services,products,memberships,gallery,staff},{headers:{'Cache-Control':'no-store'}})}catch(e){return dbError(e)}}
