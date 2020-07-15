export default {
  name: 'extrude',

  props: {
    entities: {
      title: 'Entities',
      type: 'Array',
      required: true
    },
    distance: {
      title: 'Distance',
      type: 'Number',
      default: 1
    },
    material: {
      title: 'Material',
      type: 'Material',
      default: 'blue'
    }
  },

  render ({ compile, PathToShape, getMaterial, getFeatureById, feature, THREE } = {}) {
    // Destructure feature
    const { id, distance } = this

    // Create copy of settings
    // const _data = Object.create(feature)
    // Compile Extrude settings?
    // _data.distance = compile(distance)

    // TODO allow multiple entities
    const target = getFeatureById(this.entities[0])

    if (!target) {
      console.warn(target, this.entities, feature)
      throw new Error(`[extrude] couldnt find suitable path to extrude`)
    }

    // Use static sketch or parametric sketch?
    // TODO use `this.entities`
    const { path, _path: pathCompiled } = target

    // Get Shape
    const shape = feature._shape || PathToShape(path || pathCompiled)

    // Debug
    // console.log(`Extruding with ${distance}`)

    // Extrude
    // const material = red
    const geometry = new THREE.ExtrudeGeometry(shape,
      {
        // distance: 8, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1
        depth: distance,
        bevelEnabled: false
      }
    )

    const group = new THREE.Object3D()
    // Attach mesh to the feature
    group.name = `[extrude]${id}`
    // feature._mesh = mesh

    const mesh = new THREE.Mesh(geometry, getMaterial(this.material))
    mesh.name = `[extrude/mesh]${id}`
    group.add(mesh)

    // Edges
    var edges = new THREE.EdgesGeometry(geometry)
    var line = new THREE.Line(edges, new THREE.LineBasicMaterial({ color: 'black' }))
    // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 'black' }))
    group.name = `[extrude/lines]${id}`
    group.add(line)

    // TEST Highlight edge
    line.material.color = new THREE.Color('red')
    line.material.needsUpdate = true

    return group
  }
}
