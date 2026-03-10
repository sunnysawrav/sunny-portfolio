export default {
  name: 'featured',
  title: 'Featured Projects',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'desc', title: 'Description', type: 'text' },
    { name: 'embed', title: 'YouTube Embed URL', type: 'string' },
    { name: 'vid', title: 'YouTube Video ID', type: 'string' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'award', title: 'Award / Recognition', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}