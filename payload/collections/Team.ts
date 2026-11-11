import type { CollectionConfig } from 'payload'
export const Team: CollectionConfig = {
 slug:'salon-team',labels:{singular:'Team Member',plural:'Team'},
 admin:{group:'Salon Content',useAsTitle:'name'},access:{read:()=>true},
 fields:[{name:'name',type:'text',required:true},{name:'specialty',type:'text'},
 {name:'bio',type:'textarea'},{name:'photo',type:'upload',relationTo:'media'},
 {name:'active',type:'checkbox',defaultValue:true},{name:'sortOrder',type:'number',defaultValue:0}],
}
