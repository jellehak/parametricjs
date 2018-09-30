import cadData from '../models/cut.js'
const {y3d} = window
const {THREE} = window
const {ThreeBSP} = window
const {Parametric} = window

// Setup scene
const { add, scene } = y3d.setup({
  camera: {
    x: 100,
    y: 100,
    z: 100
  },
  size: '1 unit = 1 mm',
  background: '#fff'
})

// Debug the scene in the console
window.scene = scene

add({
  type: 'light',
  position: {
    x: 100,
    y: 100,
    z: 100
  }
})

add({
  type: 'axis',
  size: 100,
  position: [0, 0, 0]
})

// -----------
// UI
// -----------
const keyHandlers = [{
  key: 'h',
  description: 'Toggle mesh visibility',
  handler: () => {
    // console.log(mesh.children)
    mesh.children.map((elem) => { elem.visible = !elem.visible })
  }
}]

document.addEventListener('keypress', ({ key }) => {
  // console.log('keypress event\n\n' + 'key: ' + key)
  // if (keyHandlers[key]) keyHandlers[key]()
  keyHandlers.map((elem) => { if (elem.key === key) elem.handler() })
})

// On EnterFrame
add({
  render: ({ keyboard }) => {
    if (keyboard.pressed('shift+A')) {
      console.log('Help')
    }
  }
})

// -----------
// ThreeBSP Cut
// -----------
// ncCut()

function ncCut () {
// var start_time = (new Date()).getTime();
  var cubeGeometry = new THREE.CubeGeometry(3, 3, 3)
  var cubeMesh = new THREE.Mesh(cubeGeometry)
  cubeMesh.position.x = -7
  console.log(cubeMesh)
  var cubeBsp = new ThreeBSP(cubeMesh)
  var sphereGeometry = new THREE.SphereGeometry(1.8, 32, 32)
  var sphereMesh = new THREE.Mesh(sphereGeometry)
  sphereMesh.position.x = -7
  var sphereBsp = new ThreeBSP(sphereMesh)

  var subtractBsp = cubeBsp.subtract(sphereBsp)
  var result = subtractBsp.toMesh(new THREE.MeshLambertMaterial({
    shading: THREE.SmoothShading,
    map: new THREE.TextureLoader().load('texture.png')
  }))
  result.geometry.computeVertexNormals()
  scene.add(result)
// console.log('Example 1: ' + ((new Date()).getTime() - start_time) + 'ms');
}

// -----------
// YCAD Cut
// -----------
const part = Parametric.create({ cad: cadData, scene: scene })
const mesh = part.render()

// console.log(mesh)

scene.add(mesh)
