export default {
  name: 'gallery',
  title: 'Personal Gallery',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image (Upload)',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'imageUrl',
      title: 'Image URL (External Link)',
      type: 'url',
      description: 'Use this if you want to link to an external image instead of uploading'
    },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}