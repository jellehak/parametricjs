// -----------
// Raytrace
// -----------
const {y3d} = window
const {THREE} = window
const { camera } = y3d

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

function onMouseMove (event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // console.log(mouse)

  raycast(camera)
}

function raycast (camera) {
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children)

  // console.log(intersects)

  for (var i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000)
  }
}

window.addEventListener('mousemove', onMouseMove, false)
