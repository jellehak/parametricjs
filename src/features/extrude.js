import PathToShape from '../helpers/PathToShape'
import { red } from '@/materials/mesh.js'

export default {
  name: 'extrude',

  props: {
    entities: {
      title: 'Entities',
      type: Array,
      required: true
    },
    distance: {
      title: 'Distance',
      type: Number
    }
  },

  render ({ compile, getFeatureById, feature, THREE } = {}) {
    // Destructure feature
    const { id, amount } = this

    // Create copy of settings
    // const _data = Object.create(feature)
    // Compile Extrude settings?
    // _data.amount = compile(amount)

    // TODO allow multiple entities
    const target = getFeatureById(this.entities[0])

    if (!target) {
      console.warn(target, this.entities, feature)
      throw new Error(`[extrude] couldnt find suitable path to extrude`)
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
