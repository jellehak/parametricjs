export default {
  name: 'pattern',

  example: `{
    type: 'pattern',
    entities: ['extrude1'],
    times: 4,
    direction: [10, 0, 0]
}`,

  props: {
    entities: {
      title: 'Entities',
      type: Array,
      required: true
    },
    direction: {
      title: 'direction',
      default: [10, 0, 0]
    }
  },

  render ({ getFeatureById, feature, object3d }, previousState) {
    const { times, direction, entities } = this
    const [x, y, z] = direction

    // Get Feature
    const target = getFeatureById(entities[0])
    console.log('pattern', target)
    if (!target) {
      throw new Error(`[pattern] #${this.id} failed to find entities`)
    }

    const targetMesh = target._mesh
    if (!targetMesh) {
      throw new Error(`[pattern] #${this.id} failed to find mesh`)
    }

    // Clone
    for (let i = 0; i < times; i++) {
    // console.log("Creating copy")

      var newMesh = targetMesh.clone()
      newMesh.translateX(x * i)
      newMesh.translateY(y * i)
      newMesh.translateZ(z * i)

      previousState.add(newMesh)
    }

    // Debug
    // console.log(target)
    // console.log("Work in progress")

    // Attach mesh to feature
    feature._mesh = previousState
  }

}
