import path from './sketch/path'
import patharray from './sketch/array'
import point from './sketch/point'
import circle from './sketch/circle'

const sketchFeatures = {
  path,
  point,
  patharray,
  circle
}

export default {
  name: 'sketch',

  props: {
    plane: {
      title: 'Plane'
      // type: Array
    }
  },

  render ({ THREE, feature } = {}) {
    const { children = [] } = feature
    const { path, plane } = feature

    console.log(`Creating sketch on plane "${plane}"`)

    // COMPATIBILITY : Auto promote path to children
    if (!children && path) {
      children.push({ type: 'path', path: path })
    }

    // Process sketch children
    const meshes = children.map(child => {
      let { type } = child

      // DETECT : Auto promote path : path, pathsimpel, patharray
      if (type === 'path') {
        const { path } = child
        const [first] = path
        // console.log(first)
        type = (first.constructor === Array) ? 'patharray' : 'path'
      }

      // Skip suppress
      const { suppress } = child
      if (suppress) {
        return
      }

      // Get sketch feature handler
      const handler = sketchFeatures[type]
      if (!handler) {
        throw new Error(`Unknown sketch feature: "${type}"`)
      }

      // Call sketch feature handler
      const resp = handler({
        // TODO
        feature: child
      })
      const { mesh = {} } = resp
      return mesh
    })

    const object3d = new THREE.Object3D()
    object3d.children = meshes.filter(elem => elem)
    return { mesh: object3d }
  }
}
