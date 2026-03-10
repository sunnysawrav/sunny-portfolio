 export default {
  name: 'achievement',
  title: 'Achievements',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'desc', title: 'Description', type: 'text' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}
