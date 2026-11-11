import type { CollectionConfig } from 'payload'
export const Reviews: CollectionConfig = {
 slug:'salon-reviews',labels:{singular:'Review',plural:'Reviews'},
 admin:{group:'Salon Content',useAsTitle:'author'},access:{read:()=>true,create:({req})=>Boolean(req.user?.collection==='users'),update:({req})=>Boolean(req.user?.collection==='users'),delete:({req})=>Boolean(req.user?.collection==='users')},
 fields:[{name:'author',type:'text',required:true},{name:'quote',type:'textarea',required:true},
 {name:'rating',type:'number',min:1,max:5},{name:'source',type:'text',defaultValue:'Google'},
 {name:'visible',type:'checkbox',defaultValue:true}],
}
