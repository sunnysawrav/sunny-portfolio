import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4w7o9e2n',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-03-19',
})

export default client