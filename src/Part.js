import { createObject } from './helpers/helpers'
const { THREE } = window

const processRender = (mixed = {}) => {
  // THREE doesn't use Classes but a type key
  // const type = typeof mixed
  const type = mixed.type

  // console.log(feature)
  // console.log('Response:', mixed)
  // console.log(type)

  const convertShapeToLines = (shape) => {
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html
    shape.autoClose = true
    var points = shape.getPoints()

    // # Convert to Lines
    const material = new THREE.LineBasicMaterial({ color: 0x000000 })
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var lines = new THREE.Line(geometry, material)
    lines.name = 'lines'
    geometry.computeBoundingBox()

    // Handle holes?
    const hasHoles = shape.holes && shape.holes.length
    // console.log('Holes found', shape.holes)
    if (hasHoles) {
      hasHoles.forEach(hole => {
        const holeLines = convertShapeToLines(hole)
        console.log(holeLines)
        lines.add(holeLines)
      })
    }

    return lines
  }

  // Handle various responses of Feature render function
  const wrappers = {
    Object3D: obj => obj,

    // Sketch
    'Shape' (shape = {}) {
      // # Convert to Lines
      var lines = convertShapeToLines(shape)
      return lines
    },

    GridHelper: obj => obj,

    'default' () {
      console.warn(`Unknown response type "${type}" from feature render function`, mixed)
      return mixed || new THREE.Object3D()
    }
  }

  const fn = wrappers[type] || wrappers['default']
  const processed = fn(mixed)

  return processed
}

export default class Part {
  constructor (children = []) {
    this.name = 'Unknown Part'
    this.children = children
  }

  renderChildren () {
    return this.children.map((feature, i) => {
      // Name it
      const name = `feature${i + 1}-${feature.type}`

      if (feature.suppress) {
        // Skip
        return
      }

      // TODO inject with proper previousFeature not all
      // Call feature render function
      const mixed = feature.callRender(this.children)

      // Streamline render function returns
      const processed = processRender(mixed)

      // Name it
      processed.name = name

      // Add to Object3D
      // object.add(processed)
      return processed
    })
  }

  getAllShapes () {
    // Fetch all usefull shapes
    const shapes = this.children.map(child => child.getShapes())
    const shapesFlat = shapes.flat()
    return shapesFlat
  }

  /**
 * Render
 */
  render () {
    const objects = this.renderChildren()

    // TEST
    // this.fetchAllShapes()

    // Create Object3D
    const object = createObject({
      name: 'features'
    })

    // Add all geometry
    objects.forEach(item => object.add(item))

    return object
  }
}
