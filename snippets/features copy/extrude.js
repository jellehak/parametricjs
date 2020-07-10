import PathToShape from '../helpers/PathToShape'
import { red } from './materials/mesh.js'
const { THREE } = window

export default {
  name: 'extrude',

  props: {
    entities: {
      title: 'Entities',
      type: Array
    },
    distance: {
      title: 'Distance',
      type: Number
    }
  },

  created (context) {
    const { compile, getFeatureById, feature } = context

    // Destructure feature
    const { id, amount, selectById, sketchId } = feature

    // Create copy of settings
    const _data = Object.create(feature)

    // Compile Extrude settings?
    _data.amount = compile(amount)

    const target = getFeatureById(selectById || sketchId)

    if (!target) {
      console.warn(`[extrude] couldnt find suitable path to extrude`, feature)
      return
    }

    // Use static sketch or parametric sketch?
    const { path, _path: pathCompiled } = target

    // Get Shape
    const shape = feature._shape || PathToShape(path || pathCompiled)

    // Debug
    // console.log(`Extruding with ${amount}`)

    // Extrude
    // const extrudeSettingsMerged = Object.assign(extrudeSettings, { amount: 8, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1 })
    const material = red
    const geometry = new THREE.ExtrudeGeometry(shape, { amount, bevelEnabled: false })
    const mesh = new THREE.Mesh(geometry, material)

    // Attach mesh to the feature
    mesh.name = `[extrude]${id}`
    feature._mesh = mesh

    return { mesh }
  }
}
