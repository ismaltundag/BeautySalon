import { neon } from '@neondatabase/serverless';
export function db(){const url=process.env.DATABASE_URL;if(!url)throw new Error('DATABASE_URL is not configured');return neon(url)}
export function dbError(e:unknown){console.error('Database operation failed',e instanceof Error?e.message:'Unknown error');return Response.json({error:'Database unavailable or not initialized'},{status:503})}
