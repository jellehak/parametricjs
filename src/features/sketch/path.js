import isString from '../../helpers/isString'
import PathToShape from '../../helpers/PathToShape'

export default {
  name: 'sketch-path',

  props: {
    material: {
      default: () => new THREE.LineBasicMaterial({ color: 0x000000 })
    },

    values: {
      type: Array,
      default: () => (
        [{
          x: 0,
          y: 0
        }, {
          x: 4,
          y: 0
        }, {
          x: 4,
          y: 4
        }, {
          x: 0,
          y: 4
        }, {
          x: 0,
          y: 0
        }]
      )
    }
  },

  render ({ compile, THREE } = {}) {
    const { values } = this

    // Create rendered sketch
    const _path = [] // Create a compiled version
    values.map((point) => {
      const { x, y } = point
      _path.push({
        x: isString(x) ? compile(x) : x,
        y: isString(y) ? compile(y) : y
      })
    })

    // TODO Mutate feature => Not such a good idea
    const shape = PathToShape(values)
    // feature._path = _path
    // feature._shape = shape

    // # Collect points
    // var points = shape.getPoints()
    // TEST
    var points = []
    points.push(new THREE.Vector3(-10, 0, 0))
    points.push(new THREE.Vector3(0, 10, 0))
    points.push(new THREE.Vector3(10, 0, 0))

    // # Create mesh
    console.log(points)
    var geometry = new THREE.BufferGeometry().setFromPoints(points)

    var lines = new THREE.Line(geometry, this.materials)
    lines.name = 'lines'

    // Return THREE Object: Line
    return lines
  }
}
