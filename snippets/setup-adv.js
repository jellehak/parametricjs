import 'three/examples/js/controls/OrbitControls.js'
// import 'three/examples/js/Detector.js'
const { THREE } = window

export default function buildAxesPos (size = 100, vector = {}) {
  const { x = 0, y = 0, z = 0 } = vector

  const axesHelper = new THREE.AxesHelper(size)
  axesHelper.position.set(x, y, z)
  return axesHelper
}

//   console.log('He')
// Setup THREEJS scene
// From https://github.com/jellehak/Y3D/blob/master/src/yellow3d.js
export function setup (config = {
  el: 'app'
}) {
  const clock = new THREE.Clock()
  const controllers = []
  let time = 0

  const createCamera = ({ fov, aspect, near, far, width, height, x, y, z }) => {
    const threeCamera = new THREE.PerspectiveCamera(fov || 60, aspect, near || 0.01, far || 1e10)
    threeCamera.position.set(x || 100, y || 100, z || 100)
    return threeCamera
  }

  const animate = () => {
    requestAnimationFrame(animate)
    update()
    controls.update()
    renderer.render(scene, camera)

    if (config.stats) stats.update()
  }

  // Run update loop on all controllers
  const update = () => {
    const deltaTime = clock.getDelta()

    // Call all controllers
    controllers.map((elem) => {
      // console.log(this)

      const { mesh, render } = elem
      const payload = Object.assign(self, { delta: deltaTime, camera, keyboard: self.keyboard, time: time, mesh: mesh })

      if (render) render(payload)
    })
    time += deltaTime
  }

  // Destructure config
  let {
    el = 'app',
    stats = false,
    autostart,
    background = 0x000000,
    size = { width: window.innerWidth, height: window.innerHeight }
    // camera = { x: 2, y: 2, z: 2 }
  } = config

  // // Default config
  // stats = stats || false
  // autostart = autostart || true
  // background = 'background' in config ? background : 0x000000
  // cameraSettings = cameraSettings || { x: 2, y: 2, z: 2 }
  // size = size || { width: window.innerWidth, height: window.innerHeight }

  // Render to existing element or create a new one?
  let container
  if (el) {
    console.log(`[parametricjs] Rendering scene to element: ${el}`)
    container = document.getElementById(config.el)
  } else {
    console.log(`[parametricjs] Rendering scene to added div`)
    // Full screen
    container = document.createElement('div')
    document.body.appendChild(container)
  }

  // Check container size
  if (container.offsetWidth && container.offsetHeight) {
    size = {
      width: container.offsetWidth,
      height: container.offsetHeight
    }
  } else {
    console.warn('Could not detect the div elements size defaulting to full screen (make sure the object is loaded)')
    size = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(background)

  // Camera
  const cameraConfig = {
    aspect: size.width / size.height,
    ...config.camera
  }
  console.log(cameraConfig)
  const camera = createCamera(cameraConfig)
  scene.add(camera)

  // Controls
  const controls = new THREE.OrbitControls(camera, container)
  controls.target.set(0, 0, 0)
  controls.update()
  // controls.rotateSpeed = 5.0
  // controls.zoomSpeed = 5
  // controls.noZoom = false
  // controls.noPan = false
  // controls.enableDamping = true
  // controls.dampingFactor = 0.25

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true

  // Document eventhandlers
  // window.addEventListener('mousemove', onMouseMove, false)

  // Renderer
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(size.width, size.height)
  // renderer.setClearColor(0xffffff, 1)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  container.appendChild(renderer.domElement)

  // // Stats
  // if (stats) {
  //   statistics = new Stats()
  //   container.appendChild(statistics.dom)
  // }

  // Add the TWEEN update routine
  // if (tween || true) {
  //   add({
  //     render: () => { TWEEN.update() }
  //   })
  // }

  // Resize handler
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

    if (controls.handleResize) controls.handleResize()
  }

  window.addEventListener('resize', onWindowResize, false)

  // And start animate loop
  if (autostart) animate()

  // Add to this
  //   this.renderer = renderer
  //   this.scene = scene
  //   this.camera = camera
  //   this.controls = controls

  // Add axis
  scene.add(buildAxesPos())

  return scene
}
