import { getPayload } from 'payload'
import config from '../payload.config'

// Run schema initialization before Next.js builds in production.
// Payload's Postgres adapter only pushes schemas in development mode.
const payload = await getPayload({ config })
payload.logger.info('Payload CMS database schema initialized')
await payload.db.destroy?.()
process.exit(0)
