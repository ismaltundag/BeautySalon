import { getPayload } from 'payload'
import config from '@payload-config'
import { db } from '@/lib/db'
export const runtime = 'nodejs'

// One-time, repeat-safe import. Requires an authenticated Payload administrator.
export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const auth = await payload.auth({ headers: req.headers })
    if (auth.user?.collection !== 'users') return Response.json({ error: 'Admin login required' }, { status: 401 })
    const sql = db()
    const [settings, services, products, gallery, staff] = await Promise.all([
      sql`SELECT * FROM site_settings WHERE id=1`,
      sql`SELECT * FROM services ORDER BY sort_order,name`,
      sql`SELECT * FROM products ORDER BY name`,
      sql`SELECT * FROM gallery_items ORDER BY sort_order,created_at`,
      sql`SELECT * FROM staff ORDER BY sort_order,name`,
    ])
    const summary: Record<string, number> = {}
    const migrate = async (collection: 'salon-services'|'salon-products'|'salon-gallery'|'salon-team', rows: Record<string, any>[], transform: (row:Record<string,any>)=>Record<string,any>) => {
      let imported=0
      for (const row of rows) {
        const legacyId=String(row.id)
        const existing=await payload.find({collection,where:{legacyId:{equals:legacyId}},limit:1,overrideAccess:true})
        if(existing.totalDocs)continue
        await payload.create({collection,data:{legacyId,...transform(row)} as any,overrideAccess:true})
        imported++
      }
      summary[collection]=imported
    }
    await migrate('salon-services',services as any[],r=>({
      name:r.name,category:r.category,description:r.description,price:r.price_cents/100,
      durationMinutes:r.duration_minutes,legacyImageUrl:r.image_url,active:r.active,
      sortOrder:r.sort_order,legacyDetails:r.details,preparation:r.preparation,aftercare:r.aftercare,
    }))
    await migrate('salon-products',products as any[],r=>({
      name:r.name,category:r.category,description:r.description,price:r.price_cents/100,
      inventory:r.inventory,legacyImageUrl:r.image_url,active:r.active,
    }))
    await migrate('salon-gallery',gallery as any[],r=>({
      title:r.title,category:r.category,description:r.description,legacyImageUrl:r.image_url,
      active:r.active,sortOrder:r.sort_order,
    }))
    await migrate('salon-team',staff as any[],r=>({
      name:r.name,specialty:r.specialty,bio:r.bio,legacyImageUrl:r.image_url,
      active:r.active,sortOrder:r.sort_order,
    }))
    if(settings[0]){
      const s=settings[0]
      await payload.updateGlobal({slug:'site-settings',overrideAccess:true,data:{
        brand:s.brand,accent:s.accent,headline:s.headline,tagline:s.tagline,announcement:s.announcement,
        legacyAbout:s.about,legacyHeroImageUrl:s.hero_image_url,
        membershipTitle:s.membership_title,legacyContent:s.content,
      } as any})
    }
    return Response.json({ok:true,imported:summary})
  } catch(e) {
    console.error('Payload legacy import failed',e)
    return Response.json({error:'Import failed; original data was not modified'},{status:500})
  }
}
