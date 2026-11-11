import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Payload CMS database schema initialized')
  await payload.db.destroy?.()
}

main().then(() => process.exit(0)).catch((error) => {
  console.error('Payload database initialization failed:', error)
  process.exit(1)
})
