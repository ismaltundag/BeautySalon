import type { CollectionConfig } from 'payload'
export const Products: CollectionConfig = {
 slug:'salon-products', labels:{singular:'Product',plural:'Products'},
 admin:{group:'Salon Content',useAsTitle:'name'},
 access:{read:()=>true},
 fields:[
 {name:'name',type:'text',required:true},{name:'category',type:'text'},
 {name:'description',type:'textarea'},{name:'price',type:'number',min:0},
 {name:'inventory',type:'number',min:0},{name:'image',type:'upload',relationTo:'media'},
 {name:'active',type:'checkbox',defaultValue:true},{name:'sortOrder',type:'number',defaultValue:0}
 ],
}
