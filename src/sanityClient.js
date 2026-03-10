import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4w7o9e2n',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export default client