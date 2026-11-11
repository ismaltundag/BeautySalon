import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { group: 'Settings', useAsTitle: 'email' },
  access: {
    create: async ({ req }) => req.user?.collection === 'users' || (await req.payload.count({ collection: 'users', overrideAccess: true })).totalDocs === 0,
    read: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [{ name: 'name', type: 'text' }],
}
