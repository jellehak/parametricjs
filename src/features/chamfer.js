export default {
  name: 'chamfer',

  props: {
    entities: {
      title: 'Entities to chamfer',
      type: 'Array'
    },
    distance: {
      title: 'Distance',
      type: 'Number'
    }
  },

  created () {
    // return standardChamfer(context, id, definition)
  }
}
