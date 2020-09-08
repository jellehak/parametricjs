import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
    x: 10,
    y: 10,
    z: 10
  },
  background: 'white' // 0xffffff,
}

export function setup (_config = DEFAULT_CONFIG) {
  // Merge config
  const config = {
    ...DEFAULT_CONFIG,
    ..._config
  }

  // Render to existing element
  const element = typeof config.el === 'string'
    ? document.getElementById(config.el)
    : config.el

  // else {
  //   console.log(`[parametricjs] Rendering scene to added div`)
  //   // Full screen
  //   element = document.createElement('div')
  //   document.body.appendChild(element)
  // }

  // Create scene and set camera
  //   const aspect = window.innerWidth / window.innerHeight
  const aspect = element.offsetWidth / element.offsetHeight
  var scene = new THREE.Scene()
  // var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  var camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000)
  camera.position.set(config.camera.x, config.camera.y, config.camera.z)

  // Lights
  // =====
  var light
  // light = new THREE.PointLight(0xff0000, 1, 100)
  // light.position.set(50, 50, 50)
  // scene.add(light)
  // // soft white light
  // scene.add(new THREE.AmbientLight(0x404040))

  scene.add(new THREE.AmbientLight(0x443333))
  light = new THREE.DirectionalLight(0xffddcc, 1)
  light.position.set(1, 0.75, 0.5)
  scene.add(light)
  light = new THREE.DirectionalLight(0xccccff, 1)
  light.position.set(-1, 0.75, -0.5)
  scene.add(light)

  // Mount WebGLRenderer to DOM
  // =====
  var renderer =
    new THREE.WebGL1Renderer({
    // new THREE.WebGLRenderer({
      antialias: true
    })

  //   renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  //   document.body.appendChild(renderer.domElement)
  element.innerHTML = '' // Clear element first
  element.appendChild(renderer.domElement)
  // TODO ?
  // document.replaceChild(element, renderer.domElement)

  // Controls
  const controls = new OrbitControls(camera, element)
  // controls.target.set(0, 0, 0)
  // camera.position.set(0, 100, 100)
  controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.1
  // camera.position.set(400, 200, 100)
  controls.update()
  // orbit.addEventListener( 'change', render );
  // controls.addEventListener('end', (e) => {
  //   // Update localStorage?
  //   console.log('Cam change', e)
  //   config.store.camera = JSON.stringify(camera.position)
  // })

  // Set background
  scene.background = new THREE.Color(config.background)

  // // Add axis
  // scene.add(buildAxesPos())

  // Add cube
  //   var geometry = new THREE.BoxGeometry()
  //   var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  //   var cube = new THREE.Mesh(geometry, material)
  //   scene.add(cube)

  camera.position.z = 5

  // Expose
  return {
    scene,
    controls,
    camera,
    renderer,
    element
  }
}
