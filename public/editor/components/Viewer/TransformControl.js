import '/node_modules/three/examples/js/controls/TransformControls.js'

const {THREE} = window
const {y3d} = window

export function TransformControls () {
  // Test
  const {scene, camera, renderer} = y3d

  var geometry = new THREE.BoxGeometry(200, 200, 200)
  var material = new THREE.MeshLambertMaterial()

  var mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Code

  const control = new THREE.TransformControls(camera, renderer.domElement)
  // control.addEventListener('change', render)
  control.attach(mesh)
  scene.add(control)

  window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
      case 81: // Q
        control.setSpace(control.space === 'local' ? 'world' : 'local')
        break

      case 17: // Ctrl
        control.setTranslationSnap(100)
        control.setRotationSnap(THREE.Math.degToRad(15))
        break

      case 87: // W
        control.setMode('translate')
        break

      case 69: // E
        control.setMode('rotate')
        break

      case 82: // R
        control.setMode('scale')
        break

      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1)
        break

      case 189:
      case 109: // -, _, num-
        control.setSize(Math.max(control.size - 0.1, 0.1))
        break
    }
  })

  window.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
      case 17: // Ctrl
        control.setTranslationSnap(null)
        control.setRotationSnap(null)
        break
    }
  })
}
