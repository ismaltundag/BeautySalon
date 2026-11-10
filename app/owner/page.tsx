'use client';
import {useEffect,useState} from 'react';
type Item={id?:string;name?:string;title?:string;category?:string;description?:string;bio?:string;specialty?:string;price_cents?:number;price?:number;duration_minutes?:number;inventory?:number;image_url?:string|null;active?:boolean;sort_order?:number;details?:string;preparation?:string;aftercare?:string};
type Settings={brand:string;headline:string;tagline:string;accent:string;announcement:string;about:string;membership_title:string;hero_image_url:string|null;content:Record<string,string>};
type Data={settings:Settings;services:Item[];products:Item[];gallery:Item[];staff:Item[]};
type Tab='settings'|'service'|'product'|'gallery'|'staff';
const fields:Record<Exclude<Tab,'settings'>,string[][]>={
service:[['name','Service name'],['category','Category'],['description','Short description'],['details','What to expect'],['preparation','Before your visit'],['aftercare','Aftercare'],['price','Price (USD)'],['duration_minutes','Duration in minutes'],['image_url','Image URL']],
product:[['name','Product name'],['category','Category'],['description','Description'],['price','Price (USD)'],['inventory','Inventory'],['image_url','Image URL']],
gallery:[['title','Photo title'],['category','Category'],['description','Caption'],['sort_order','Display order'],['image_url','Image URL']],
staff:[['name','Artist name'],['specialty','Specialty'],['bio','Biography'],['image_url','Image URL']]
};
const contentFields=[['introTitle','Introduction heading'],['servicesTitle','Services heading'],['servicesDescription','Services description'],['featureTitle','Experience heading'],['featureDescription','Experience description'],['shopTitle','Shop heading'],['shopDescription','Shop description'],['membershipDescription','Membership description'],['closingTitle','Closing heading'],['footerTagline','Footer tagline'],['footerContact','Footer contact'],['reviewTitle','Reviews heading'],['reviewDescription','Reviews description'],['galleryTitle','Gallery heading'],['galleryDescription','Gallery description'],['teamTitle','Team heading'],['teamDescription','Team description'],['faqTitle','FAQ heading'],['visitTitle','Visit heading'],['visitDescription','Visit description'],['visitAddress','Salon address'],['visitHours','Opening hours'],['visitPhone','Phone'],['visitEmail','Email'],['visitMapsUrl','Google Maps URL'],['visitParking','Parking'],['instagramUrl','Instagram URL'],['promoTitle','Promotion heading'],['promoDescription','Promotion description'],['promoCode','Promotion code'],['promoExpiry','Promotion expiry'],['promoEnabled','Show promotion (true or false)'],...Array.from({length:6},(_,i)=>[['faqQ'+(i+1),'FAQ '+(i+1)+' question'],['faqA'+(i+1),'FAQ '+(i+1)+' answer']]).flat()];
export default function OwnerPage(){
 const [auth,setAuth]=useState(false),[configured,setConfigured]=useState(true),[password,setPassword]=useState(''),[data,setData]=useState<Data|null>(null),[tab,setTab]=useState<Tab>('settings'),[draft,setDraft]=useState<Item|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function load(){const r=await fetch('/api/owner/content',{cache:'no-store'});if(r.ok){setData(await r.json());setAuth(true)}else setAuth(false)}
 useEffect(()=>{fetch('/api/owner/session').then(r=>r.json()).then(x=>{setConfigured(x.configured);if(x.authenticated)void load()}).catch(()=>{})},[]);
 async function request(method:string,body:unknown,url='/api/owner/content'){setBusy(true);setMessage('');try{const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await r.json();if(!r.ok)throw Error(result.error||'Request failed');return true}catch(e){setMessage(e instanceof Error?e.message:'Request failed');return false}finally{setBusy(false)}}
 function setSetting(key:string,value:string){setData(d=>d?{...d,settings:{...d.settings,[key]:value}}:d)}
 function setContent(key:string,value:string){setData(d=>d?{...d,settings:{...d.settings,content:{...d.settings.content,[key]:value}}}:d)}
 function setField(key:string,value:string|number|boolean){setDraft(d=>d?{...d,[key]:value}:d)}
 async function upload(file:File,field:'hero_image_url'|'image_url'){setBusy(true);setMessage('Uploading...');try{const form=new FormData();form.set('file',file);const r=await fetch('/api/owner/upload',{method:'POST',body:form});const result=await r.json();if(!r.ok)throw Error(result.error||'Upload failed');if(field==='hero_image_url')setSetting(field,result.url);else setField(field,result.url);setMessage('Uploaded. Save to publish.')}catch(e){setMessage(e instanceof Error?e.message:'Upload failed')}finally{setBusy(false)}}
 async function save(){if(!data)return;const payload=tab==='settings'?{type:'settings',...data.settings}:{type:tab,...draft,price:Number(draft?.price??0)};if(await request('POST',payload)){setDraft(null);await load();setMessage('Saved and published.')}}
 function openEdit(item:Item){setDraft({...item,price:item.price_cents!==undefined?item.price_cents/100:item.price??0})}
 function switchTab(next:Tab){setTab(next);setDraft(null);setMessage('')}
 const items=tab==='service'?data?.services:tab==='product'?data?.products:tab==='gallery'?data?.gallery:tab==='staff'?data?.staff:[];
 const order=['about','services','feature','shop','reviews','membership','closing','premium'];
 const arranged=data?.settings.content?.sectionOrder?.split(',').filter(x=>order.includes(x))||order;
 return <main className="owner">
  <header><a href="/">← View website</a><h1>Maison Belle <em>Studio</em></h1><p>Manage your salon website</p></header>
  {!auth?<section className="owner-panel"><h2>Owner sign in</h2>{!configured?<p>Set OWNER_PASSWORD (12+ characters) in Vercel and redeploy to enable sign in.</p>:<><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy} onClick={async()=>{if(await request('POST',{password},'/api/owner/session')){setPassword('');await load()}}}>Sign in</button></>}{message&&<p role="alert">{message}</p>}</section>:<>
   <nav className="owner-tabs">{([['settings','Website'],['service','Services'],['product','Products'],['gallery','Gallery'],['staff','Artists']] as [Tab,string][]).map(([key,label])=><button key={key} onClick={()=>switchTab(key)}>{label}</button>)}<button onClick={async()=>{await fetch('/api/owner/session',{method:'DELETE'});setAuth(false);setData(null)}}>Sign out</button></nav>
   {data&&<section className="owner-panel">
    {tab==='settings'?<>
     <h2>Website content</h2>
     {([['brand','Salon name'],['headline','Main headline'],['tagline','Hero description'],['announcement','Announcement'],['about','About'],['membership_title','Membership heading'],['accent','Accent color (#RRGGBB)']] as const).map(([key,label])=><label key={key}>{label}<textarea rows={2} value={data.settings[key]} onChange={e=>setSetting(key,e.target.value)}/></label>)}
     <h3>Hero image</h3>{data.settings.hero_image_url&&<img className="owner-image-preview" src={data.settings.hero_image_url} alt="Hero preview"/>}
     <label>Hero image URL<input value={data.settings.hero_image_url||''} onChange={e=>setSetting('hero_image_url',e.target.value)}/></label>
     <label>Upload hero image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file,'hero_image_url')}}/></label>
     <h3>Page layout</h3><p>Drag sections to reorder. The hero remains first.</p>
     <div className="owner-sort-list">{arranged.map(id=><div key={id} draggable className="owner-sort-item" onDragStart={e=>e.dataTransfer.setData('text/plain',id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const from=e.dataTransfer.getData('text/plain');if(!arranged.includes(from)||from===id)return;const next=arranged.filter(x=>x!==from);next.splice(next.indexOf(id),0,from);setContent('sectionOrder',next.join(','))}}>☰ {id}</div>)}</div>
     <h3>Page copy, FAQ, promotions and contact</h3>
     {contentFields.map(([key,label])=><label key={key}>{label}<textarea rows={2} value={data.settings.content?.[key]||''} onChange={e=>setContent(key,e.target.value)}/></label>)}
     <button disabled={busy} onClick={save}>Publish changes</button>
    </>:<>
     <h2>{tab==='service'?'Services':tab==='product'?'Products':tab==='gallery'?'Our Work gallery':'Artists'}</h2>
     {!draft?<><button onClick={()=>setDraft({name:'',title:'',category:'',description:'',price:0,duration_minutes:60,inventory:0,active:true,image_url:'',sort_order:0})}>+ Add new</button>{items?.map(item=><div className="owner-item" key={item.id}><div><strong>{item.name||item.title}</strong><small>{(tab==='service'||tab==='product')?' · $'+((item.price_cents||0)/100):''} · {item.active?'Visible':'Hidden'}</small></div><button onClick={()=>openEdit(item)}>Edit</button></div>)}</>:<>
      <h3>{draft.id?'Edit':'New'} {tab}</h3>
      {fields[tab as Exclude<Tab,'settings'>].map(([key,label])=><label key={key}>{label}<input type={['price','duration_minutes','inventory','sort_order'].includes(key)?'number':'text'} step={key==='price'?'0.01':undefined} value={String((draft as Record<string,unknown>)[key]??'')} onChange={e=>setField(key,['price','duration_minutes','inventory','sort_order'].includes(key)?Number(e.target.value):e.target.value)}/></label>)}
      {draft.image_url&&<img className="owner-image-preview" src={draft.image_url} alt="Image preview"/>}
      <label>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file,'image_url')}}/></label>
      <label><input type="checkbox" checked={draft.active!==false} onChange={e=>setField('active',e.target.checked)}/> Visible on website</label>
      <div className="owner-buttons"><button disabled={busy} onClick={save}>Save & publish</button><button onClick={()=>setDraft(null)}>Cancel</button>{draft.id&&<button disabled={busy} onClick={async()=>{if(!confirm('Hide this item from the website?'))return;if(await request('DELETE',{type:tab,id:draft.id})){setDraft(null);await load()}}}>Remove</button>}</div>
     </>}
    </>}
    {message&&<p role="status">{message}</p>}
   </section>}
  </>}
 </main>
}
