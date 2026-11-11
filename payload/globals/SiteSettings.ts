import type { GlobalConfig } from 'payload'
export const SiteSettings: GlobalConfig = {
 slug:'site-settings',label:'Website Content',admin:{group:'Settings'},access:{read:()=>true,update:({req})=>Boolean(req.user?.collection==='users')},
 fields:[
 {name:'brand',type:'text'},{name:'headline',type:'text'},
 {name:'tagline',type:'textarea'},{name:'announcement',type:'text'},
 {name:'about',type:'richText'},{name:'heroImage',type:'upload',relationTo:'media'},
 {name:'membershipTitle',type:'text'},{name:'membershipDescription',type:'textarea'},
 {name:'contactEmail',type:'email'},{name:'phone',type:'text'},
 {name:'address',type:'textarea'},{name:'hours',type:'textarea'},
 {name:'instagramUrl',type:'text'},{name:'promotionEnabled',type:'checkbox',defaultValue:false},
 {name:'promotionTitle',type:'text'},{name:'promotionDescription',type:'textarea'},
 {name:'sections',type:'array',fields:[{name:'key',type:'text',required:true},{name:'title',type:'text'},{name:'description',type:'textarea'}]},
 ],
}
