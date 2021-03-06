function pathToShape (path = []) {
  const shape = new THREE.Shape()
  const start = path[0]
  shape.moveTo(start.x, start.y)
  for (const k in path) {
    const p = path[k]
    shape.lineTo(p.x, p.y)
  }
  shape.lineTo(path[0].x, path[0].y) // Close
  return shape
}

export default {
  name: 'extrude',

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

  render ({ getMaterial, getPathFromFeature, getFeatureById, feature, THREE } = {}) {
    // Destructure feature
    const { id, distance = 10, entities = [] } = this

    console.log('EXTRUDE', entities, distance)

    // TODO allow multiple entities
    const target = getFeatureById(entities[0])
    console.log('target', target)

    if (!target) {
      console.warn(`[extrude] couldnt find suitable path to extrude`, target, this.entities, feature)
      throw new Error(`[extrude] couldnt find suitable path to extrude`)
    }

    // Use static sketch or parametric sketch?
    // TODO use `this.entities`
    // const { path, _path: pathCompiled } = target
    const path = getPathFromFeature(target)

    // Convert Path to THREE.Shape
    const shape = pathToShape(path)
    // var shape = new THREE.Shape()
    // var length = 12; var width = 8
    // shape.moveTo(0, 0)
    // shape.lineTo(0, width)
    // shape.lineTo(length, width)
    // shape.lineTo(length, 0)
    // shape.lineTo(0, 0)

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
