// https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
// https://threejs.org/examples/?q=cube#webgl_interactive_cubes

export default {
  name: 'indicator',

  props: {

  },

  async render ({ destroy, rootScene, addEventListener, getMouse, camera, THREE, getEntities, raycaster }, previousState) {
    // ==========
    // State
    // ==========
    var intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3()
    }
    var intersects = []
    var mouseHelper
    var line

    // ==========
    // Helpers
    // ==========
    function checkIntersection () {
      // console.log('getMouse', getMouse())
      const mouse = getMouse()
      // console.log(mouse, mesh)

      raycaster.setFromCamera(mouse, camera)
      raycaster.intersectObject(rootScene, true, intersects)

      if (intersects.length > 0) {
        var p = intersects[0].point
        mouseHelper.position.copy(p)
        intersection.point.copy(p)

        var n = intersects[0].face.normal.clone()
        n.transformDirection(mesh.matrixWorld)
        n.multiplyScalar(10)
        n.add(intersects[0].point)

        intersection.normal.copy(intersects[0].face.normal)
        mouseHelper.lookAt(n)

        var positions = line.geometry.attributes.position
        positions.setXYZ(0, p.x, p.y, p.z)
        positions.setXYZ(1, n.x, n.y, n.z)
        positions.needsUpdate = true

        intersection.intersects = true

        intersects.length = 0
      } else {
        intersection.intersects = false
      }
    }

    // ==========
    // Setup
    // ==========
    // # Events
    addEventListener('mousemove', checkIntersection)
    addEventListener('click', checkIntersection)

    destroy(() => {
      removeEventListener('click', checkIntersection)
    })

    // Create Group
    const group = new THREE.Object3D()

    // Line
    var geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    group.add(line)

    mouseHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 10), new THREE.MeshNormalMaterial())
    mouseHelper.visible = true
    group.add(mouseHelper)

    return group
  }

}
