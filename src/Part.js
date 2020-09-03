import { createObject } from './helpers/helpers'
const { THREE } = window

const processRender = (mixed = {}) => {
  // THREE doesn't use Classes but a type key
  // const type = typeof mixed
  const type = mixed.type

  // console.log(feature)
  // console.log('Response:', mixed)
  // console.log(type)

  // Handle various responses of Feature render function
  const wrappers = {
    Object3D: obj => obj,

    // Sketch
    'Shape' (shape = {}) {
      // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html
      shape.autoClose = true
      var points = shape.getPoints()

      // # Convert to Lines
      const material = new THREE.LineBasicMaterial({ color: 0x000000 })
      var geometry = new THREE.BufferGeometry().setFromPoints(points)
      var lines = new THREE.Line(geometry, material)
      lines.name = 'lines'
      geometry.computeBoundingBox()

      // Holes?
      // addLineShape( arcShape.holes[ 0 ], 0x804000, 150, 0, 0, 0, 0, 0, 1 );
      // 	for ( var i = 0; i < smileyShape.holes.length; i += 1 ) {
      // 		addLineShape( smileyShape.holes[ i ], 0xf000f0, - 200, 250, 0, 0, 0, Math.PI, 1 );
      // 	}
      console.log('Holes found', shape.holes)

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
    this.children = children
  }

  renderChildren () {
    return this.children.map((feature, i) => {
      const name = `feature${i + 1}-${feature.type}`

      if (feature.suppress) {
        // Skip
        return
      }

      // TODO inject with proper previousFeature not all
      // Call feature render function
      const mixed = feature.render(this.children)

      // Streamline render function returns
      const processed = processRender(mixed)

      // Name it
      processed.name = name

      // Add to Object3D
      // object.add(processed)
      return processed
    })
  }

  /**
 * Render
 */
  render () {
    const objects = this.renderChildren()

    const object = createObject({
      name: 'features'
    })
    objects.forEach(item => object.add(item))

    return object
  }
}
