export default {
  name: 'sweep',

  props: {
    entities: {
      title: 'Entities',
      type: 'path',
      required: true
    },
    distance: {
      title: 'Distance',
      type: 'number',
      default: 1
    },
    material: {
      title: 'Material',
      type: 'Material',
      default: 'blue'
    }
  },

  render ({ getMaterial, getFeatureById, THREE } = {}) {
    // Destructure props
    const { id, distance = 10, entities = [] } = this

    // console.log('EXTRUDE', entities, distance)
    console.warn('[extrude] TODO allow multiple entities to be extruded')
    const target = getFeatureById(entities[0])
    // console.log('target', target)

    // Validation
    if (!target) {
      throw new Error(`[extrude] couldnt find suitable path to extrude`)
    }

    // Get Shape from target
    const shape = target.getShape()

    // Extrude
    const settings = {
      // distance: 8, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1
      depth: distance,
      bevelEnabled: false
    }
    const geometry = new THREE.ExtrudeGeometry(shape, settings)

    // Create Feature group
    const group = new THREE.Object3D()
    group.name = `[extrude]${id}`

    const material = getMaterial(this.material)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = `[extrude/mesh]${id}`
    group.add(mesh)

    // Edges
    var edges = new THREE.EdgesGeometry(geometry)
    var line = new THREE.Line(edges, new THREE.LineBasicMaterial({ color: 'black' }))
    // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 'black' }))
    group.name = `[extrude/lines]${id}`
    group.add(line)

    // TEST Highlight edge
    // line.material.color = new THREE.Color('red')
    // line.material.needsUpdate = true

    return group
  }
}
