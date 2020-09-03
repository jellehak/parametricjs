import { normal, red } from '../materials/mesh.js'

export default {
  name: 'cut',

  example: `{
    "type": "cut",
    "entities": ["cutsketch"],
    "amount": 10
  }`,

  props: {
    entities: {
      title: 'Entities',
      type: 'array'
    },
    amount: {
      title: 'Distance',
      type: 'Number',
      default: 10
    }
  },

  render (context = {}) {
    const { getFeatureById, THREE, PathToShape, ThreeBSP, previousState, feature } = context

    // TODO Find first type = mesh
    console.log(previousState)
    // const toBeCutted = previousState // this.entities
    const toBeCutted = previousState.children.find(elem => elem.type === 'Mesh') // object3d.children[0]

    // ==============
    // First create the extruded mesh
    // const { selectById, sketchId } = feature
    const target = getFeatureById(this.entities[0])
    if (!target) {
      throw new Error(`[cut] failed to get entities to be cutted`, feature)
    }

    // Use static sketch or parametric sketch?
    const { path, _path: pathCompiled } = target

    // const { mesh: meshExtrude } = extrude.render({
    //   ...context
    // })
    const shape = feature._shape || PathToShape(path || pathCompiled)
    console.log(shape)
    const geometry = new THREE.ExtrudeGeometry(shape, {
      amount: this.amount || 10,
      bevelEnabled: false
    })
    const meshExtrude = new THREE.Mesh(geometry, red)
    // ==============

    // console.log("Work in progress")
    console.log('Body to be cutted:', toBeCutted)
    console.log('Body to be extruded:', meshExtrude)

    // Convert to ThreeBSP
    var bspToKeep = new ThreeBSP(toBeCutted)
    var bspRemove = new ThreeBSP(meshExtrude)
    var subtractBsp = bspToKeep.subtract(bspRemove)
    var mesh = subtractBsp.toMesh(normal)
    mesh.geometry.computeVertexNormals()
    previousState.add(mesh)

    // previousState.add(meshExtrude) //The cut

    // Add edges ?
    // var edges = new THREE.EdgesGeometry(mesh.geometry)
    // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }))
    // scene.add(line)

    // Hide the previous
    toBeCutted.visible = false
  }

}
