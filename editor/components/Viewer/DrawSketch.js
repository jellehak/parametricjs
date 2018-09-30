const {THREE} = window
const {scene} = window

var line
var MAX_POINTS = 500
var drawCount
var splineArray = []

export class DrawSketch {
  constructor () {
    // geometry
    var geometry = new THREE.BufferGeometry()

    // attributes
    var positions = new Float32Array(MAX_POINTS * 3) // 3 vertices per point
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))

    // drawcalls
    drawCount = 2 // draw the first 2 points, only
    geometry.setDrawRange(0, drawCount)

    // material
    var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })

    // line
    line = new THREE.Line(geometry, material)
    scene.add(line)

    // update positions
    updatePositions()

    document.addEventListener('mousedown', this.onMouseDown.bind(this), false)
  }

  onMouseDown (evt) {
    if (evt.which === 3) return

    var x = (event.clientX / window.innerWidth) * 2 - 1
    var y = -(event.clientY / window.innerHeight) * 2 + 1

    // do not register if right mouse button is pressed.

    var vNow = new THREE.Vector3(x, y, 0)
    vNow.unproject(camera)
    console.log(vNow.x + ' ' + vNow.y + ' ' + vNow.z)
    splineArray.push(vNow)

    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener('mouseup', onMouseUp, false)
  }
}
