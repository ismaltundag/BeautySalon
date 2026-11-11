import type { CollectionConfig } from 'payload'
export const Media: CollectionConfig = {
 slug:'media',admin:{group:'Site Assets',useAsTitle:'alt'},access:{read:()=>true,create:({req})=>Boolean(req.user?.collection==='users'),update:({req})=>Boolean(req.user?.collection==='users'),delete:({req})=>Boolean(req.user?.collection==='users')},
 fields:[{name:'alt',type:'text',required:true},{name:'caption',type:'textarea'}],
 upload:{staticDir:'public/media',mimeTypes:['image/*']},
}
