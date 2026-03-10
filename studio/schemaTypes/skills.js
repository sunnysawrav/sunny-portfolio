 export default {
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    { name: 'category', title: 'Category', type: 'string' },
    {
      name: 'tags',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}
