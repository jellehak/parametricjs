/*
https://threejs.org/docs/#api/extras/core/Shape
https://threejs.org/docs/#api/geometries/ShapeGeometry
{
    id: 'heart',
    type: 'sketcharray',
    path: [
        ['moveTo', 25, 25],
        ['bezierCurveTo', 25, 25, 20, 0, 0, 0],
        ['bezierCurveTo', 30, 0, 30, 35, 30, 35],
        ['bezierCurveTo', 30, 55, 10, 77, 25, 95],
        ['bezierCurveTo', 60, 77, 80, 55, 80, 35],
        ['bezierCurveTo', 80, 35, 80, 0, 50, 0],
        ['bezierCurveTo', 35, 0, 25, 25, 25, 25]
    ]
}
*/

export default {
  name: 'sketch-array',

  props: {
    // entities: {
    //   title: 'Entities',
    //   type: Array
    // },
    // distance: {
    //   title: 'Distance',
    //   type: Number
    // }
  },

  render ({ feature, THREE } = {}) {
    const { path } = feature

    // console.log(`Creating sketch on plane "${plane}"`)
    // console.log(path)

    var shape = new THREE.Shape()

    path.map((elem) => {
      // console.log(elem)
      const [type, ...points] = elem
      shape[type](...points)
    })

    var geometry = new THREE.ShapeGeometry(shape)
    var material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
  }
}
