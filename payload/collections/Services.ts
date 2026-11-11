import type { CollectionConfig } from 'payload'
export const Services: CollectionConfig = {
 slug: 'salon-services', labels: { singular: 'Service', plural: 'Services & Pricing' },
 admin: { group: 'Salon Content', useAsTitle: 'name', defaultColumns: ['name','category','price','active'] },
 access:{read:()=>true,create:({req})=>Boolean(req.user?.collection==='users'),update:({req})=>Boolean(req.user?.collection==='users'),delete:({req})=>Boolean(req.user?.collection==='users')},
 fields: [{name:'legacyId',type:'text',unique:true,admin:{readOnly:true}},{name:'legacyImageUrl',type:'text'},
  { name:'name', type:'text', required:true },
  { name:'category', type:'text' },
  { name:'description', type:'textarea' },
  { name:'details', type:'richText' },
  { name:'preparation', type:'textarea' },
  { name:'aftercare', type:'textarea' },
  { name:'price', type:'number', min:0 },
  { name:'durationMinutes', type:'number', min:0 },
  { name:'image', type:'upload', relationTo:'media' },
  { name:'active', type:'checkbox', defaultValue:true },
  { name:'sortOrder', type:'number', defaultValue:0 },
 ],
}
