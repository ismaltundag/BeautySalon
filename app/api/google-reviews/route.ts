import {NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(){
 const placeId=process.env.GOOGLE_PLACE_ID,apiKey=process.env.GOOGLE_PLACES_API_KEY;
 if(!placeId||!apiKey)return NextResponse.json({configured:false,reviews:[]},{headers:{'Cache-Control':'public, max-age=300'}});
 try{
 const response=await fetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(placeId),{
 headers:{'X-Goog-Api-Key':apiKey,'X-Goog-FieldMask':'displayName,rating,userRatingCount,reviews,googleMapsUri'},
 next:{revalidate:3600}});
 if(!response.ok)throw new Error('Google Places returned '+response.status);
 const data=await response.json();
 const reviews=Array.isArray(data.reviews)?data.reviews.slice(0,5).map((r:any)=>({
 name:r.authorAttribution?.displayName||'Google reviewer',
 authorUrl:r.authorAttribution?.uri||null,
 avatar:r.authorAttribution?.photoUri||null,
 rating:r.rating,
 text:r.text?.text||r.originalText?.text||'',
 relativeTime:r.relativePublishTimeDescription||'',
 publishedAt:r.publishTime||null
 })):[];
 return NextResponse.json({configured:true,name:data.displayName?.text||'',rating:data.rating||null,total:data.userRatingCount||0,url:data.googleMapsUri||null,reviews},{headers:{'Cache-Control':'public, s-maxage=3600, stale-while-revalidate=3600'}});
 }catch(e){console.error('Google reviews unavailable',e instanceof Error?e.message:'Unknown error');return NextResponse.json({configured:false,reviews:[],error:'Google reviews temporarily unavailable'},{status:503})}
}
