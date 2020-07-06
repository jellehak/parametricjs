import 'three/examples/js/controls/OrbitControls.js'
// import 'three/examples/js/Detector.js'
const { THREE } = window

export default function buildAxesPos (size = 100, vector = {}) {
  const { x = 0, y = 0, z = 0 } = vector

  const axesHelper = new THREE.AxesHelper(size)
  axesHelper.position.set(x, y, z)
  return axesHelper
}

const DEFAULT_CONFIG = {
  el: 'app',
  camera: {
    x: 100,
    y: 100,
    z: 100
  },
  background: 0xffffff,
  store: localStorage
}

//   console.log('He')
// Setup THREEJS scene
// From https://github.com/jellehak/Y3D/blob/master/src/yellow3d.js
export function setup (_config = DEFAULT_CONFIG) {
  const config = {
    ...DEFAULT_CONFIG,
    ..._config
  }

  // Render to existing element or create a new one?
  let container
  if (config.el) {
    console.log(`[parametricjs] Rendering scene to element: ${config.el}`)
    container = document.getElementById(config.el)
  } else {
    console.log(`[parametricjs] Rendering scene to added div`)
    // Full screen
    container = document.createElement('div')
    document.body.appendChild(container)
  }

  //   const aspect = window.innerWidth / window.innerHeight
  const aspect = container.offsetWidth / container.offsetHeight

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.set(config.camera.x, config.camera.y, config.camera.z)

  var renderer = new THREE.WebGLRenderer()
  //   renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  //   document.body.appendChild(renderer.domElement)
  container.appendChild(renderer.domElement)

  // Controls
  const controls = new THREE.OrbitControls(camera, container)
  controls.target.set(0, 0, 0)
  controls.update()
  //   controls.addEventListener('end', (e) => {
  //     // Update localStorage?
  //     console.log('Cam change', e)
  //     config.store.camera = JSON.stringify(camera.position)
  //   })

  // Set background
  scene.background = new THREE.Color(config.background)

  // Add axis
  scene.add(buildAxesPos())

  // Add cube
  //   var geometry = new THREE.BoxGeometry()
  //   var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  //   var cube = new THREE.Mesh(geometry, material)
  //   scene.add(cube)

  camera.position.z = 5

  var animate = function () {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update()

    renderer.render(scene, camera)
  }

  animate()

  return { scene, controls, camera }
}
