import { sketchPath } from './sketchPath'
import { sketchArray } from './sketchArray'
import { sketchPoint } from './sketchPoint'
import { sketchCircle } from './sketchCircle'
const {THREE} = window

const sketchFeatures = {
  path: sketchPath,
  point: sketchPoint,
  patharray: sketchArray,
  circle: sketchCircle
}

export default function (input) {
  const { ycad, feature } = input
  const { children = [] } = feature
  const { path, plane } = feature

  console.log(`Creating sketch on plane "${plane}"`)

  // COMPATIBILITY : Auto promote path to children
  if (!children && path) {
    children.push({type: 'path', path: path})
  }

  // Process sketch children
  const _children = children.map(child => {
    let {type} = child

    // DETECT : Auto promote path : path, pathsimpel, patharray
    if (type === 'path') {
      const {path} = child
      const [first] = path
      // console.log(first)
      type = (first.constructor === Array) ? 'patharray' : 'path'
    }

    // Skip suppress
    const {suppress} = child
    if (suppress) {
      return
    }

    const handler = sketchFeatures[type]
    if (!handler) {
      console.warn(`Unknown feature: "${type}"`)
      return
    }

    // Call sketch feature handler
    const resp = handler({ ycad, feature: child })
    const {mesh = {}} = resp
    return mesh
  })

  const object3d = new THREE.Object3D()
  object3d.children = _children.filter(elem => elem)
  return { mesh: object3d }
}
