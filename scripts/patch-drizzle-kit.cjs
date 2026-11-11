const fs = require('node:fs')
const path = require('node:path')
const file = require.resolve('drizzle-kit/api')
let source = fs.readFileSync(file, 'utf8')
const pattern = /query: async \(query, params\) => \{\s*const res = await drizzleInstance\.execute\(sql\.raw\(query\)\);\s*return res\.rows;\s*\}/g
const matches = [...source.matchAll(pattern)]
if (matches.length !== 1) throw new Error('Expected exactly one Drizzle Kit query adapter to patch, found ' + matches.length)
source = source.replace(pattern, 'query: async (query, params) => { const res = params?.length ? await drizzleInstance.$client.query(query, params) : await drizzleInstance.execute(sql.raw(query)); return res.rows; }')
fs.writeFileSync(file, source)
console.log('Patched drizzle-kit query parameter forwarding')
