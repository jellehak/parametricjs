import isString from '../../helpers/isString'
import PathToShape from '../../helpers/PathToShape'
import { normal } from '../../materials/lines.js'

export default {
  name: 'sketch-path',

  props: {
    // entities: {
    //   title: 'Entities',
    //   type: Array
    // },
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

  render ({ compile, THREE, feature } = {}) {
    const material = normal
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

    // Finalize
    const shape = PathToShape(values) // TODO --speed || pathCompiled)
    feature._path = _path
    feature._shape = shape

    // Draw sketch
    var points = shape.getPoints()
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var lines = new THREE.Line(geometry, material)

    // Place the sketch
    // lines.rotateX(THREE.Math.degToRad(90))
    // mesh.rotateY(0)
    // mesh.rotateZ(0)

    // Fill shape
    // if (sketchFill) {
    //   var geometry2 = new THREE.ShapeGeometry(shape)
    //   var material2 = new THREE.MeshPhongMaterial({
    //     color: Math.random() * 0xffffff,
    //     emissive: 0x072534,
    //     side: THREE.DoubleSide,
    //     flatShading: true
    //   })
    //   var mesh = new THREE.Mesh(geometry2, material2)
    //   scene.add(mesh)
    // }

    // scene.add(lines)
    return lines
  }
}
