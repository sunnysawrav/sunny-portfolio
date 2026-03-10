 export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'desc', title: 'Description', type: 'text' },
    { name: 'award', title: 'Achievement', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}
