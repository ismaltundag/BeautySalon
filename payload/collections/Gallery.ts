import type { CollectionConfig } from 'payload'
export const Gallery: CollectionConfig = {
 slug:'salon-gallery',labels:{singular:'Gallery Photo',plural:'Gallery'},
 admin:{group:'Salon Content',useAsTitle:'title'},
 access:{read:()=>true},
 fields:[{name:'title',type:'text',required:true},{name:'category',type:'text'},
 {name:'description',type:'textarea'},{name:'image',type:'upload',relationTo:'media',required:true},
 {name:'sortOrder',type:'number',defaultValue:0},{name:'active',type:'checkbox',defaultValue:true}],
}
