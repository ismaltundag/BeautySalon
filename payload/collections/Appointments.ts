import type { CollectionConfig } from 'payload'
export const Appointments: CollectionConfig = {
 slug:'salon-appointments',labels:{singular:'Appointment Request',plural:'Appointment Requests'},
 admin:{group:'Bookings',useAsTitle:'name',defaultColumns:['name','email','status','createdAt']},
 access:{create:()=>true,read:({req})=>Boolean(req.user),update:({req})=>Boolean(req.user),delete:({req})=>Boolean(req.user)},
 fields:[{name:'name',type:'text',required:true},{name:'email',type:'email',required:true},
 {name:'phone',type:'text'},{name:'service',type:'text'},{name:'preferredDate',type:'date'},
 {name:'notes',type:'textarea'},{name:'status',type:'select',defaultValue:'new',
 options:[{label:'New',value:'new'},{label:'Contacted',value:'contacted'},{label:'Confirmed',value:'confirmed'},{label:'Closed',value:'closed'}]}],
}
