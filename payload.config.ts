import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './payload/collections/Users'
import { Services } from './payload/collections/Services'
import { Products } from './payload/collections/Products'
import { Gallery } from './payload/collections/Gallery'
import { Team } from './payload/collections/Team'
import { Reviews } from './payload/collections/Reviews'
import { Appointments } from './payload/collections/Appointments'
import { Media } from './payload/collections/Media'
import { SiteSettings } from './payload/globals/SiteSettings'

export default buildConfig({
  admin: { user: 'users' },
  collections: [Users, Services, Products, Gallery, Team, Reviews, Appointments, Media],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: './payload-types.ts' },
})
