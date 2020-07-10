import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

  // Lights
  const light = new THREE.PointLight(0xff0000, 1, 100)
  light.position.set(50, 50, 50)
  scene.add(light)

  // soft white light
  scene.add(new THREE.AmbientLight(0x404040))

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  //   renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  //   document.body.appendChild(renderer.domElement)
  container.appendChild(renderer.domElement)

  // Controls
  const controls = new OrbitControls(camera, container)
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

  // ================
  // Raycaster
  // ================
  const raycaster = new THREE.Raycaster()

  // STATE
  let mouse = {} // new THREE.Vector2()
  const selections = []
  const hovers = []

  const clearSelection = () => {
    selections.map(elem => {
      // Call handler
      if (elem.deselect) {
        elem.deselect()
      }
    })
  }

  const clearHovers = () => {
    hovers.map(elem => {
      // Call handler
      if (elem.mouseout) {
        elem.mouseout()
      }
    })
  }

  const computeMouseXY = (e) => {
    // return {
    //   x: (e.clientX / window.innerWidth) * 2 - 1,
    //   y: -(e.clientY / window.innerHeight) * 2 + 1
    // }
    const container = renderer.domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
    const { left, top, width, bottom } = container
    const { clientX, clientY } = e
    return {
      x: ((clientX - left) / (width - left)) * 2 - 1,
      y: -((clientY - top) / (bottom - top)) * 2 + 1
    }
  }

  function raycast (e) {
    // 1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse = computeMouseXY(e)

    // 2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera)

    // 3. compute intersections
    var intersects = raycaster.intersectObjects(scene.children, true)
    // console.log(`Intersects with ${intersects.length} objects`)
    // console.dir(intersects.map(elem => ({
    //   ...elem,
    //   name: elem.object.name
    // })))

    // // All
    // for (var i = 0; i < intersects.length; i++) {
    //   // handleIntesect(intersects[i])
    //   /*
    //         An intersection has the following properties :
    //             - object : intersected object (THREE.Mesh)
    //             - distance : distance from camera to intersection (number)
    //             - face : intersected face (THREE.Face3)
    //             - faceIndex : intersected face index (number)
    //             - point : intersection point (THREE.Vector3)
    //             - uv : intersection point in the object's UV coordinates (THREE.Vector2)
    //     */
    // }
    return intersects
  }

  // Handle UI Interactions
  // Click Event
  renderer.domElement.addEventListener('click', (e) => {
    const intersects = raycast(e)
    clearSelection()

    const handleIntesect = ({ object } = {}) => {
      // Call custom handler of object
      if (object.click) {
        object.click()
      }
      // Call custom handler of object
      if (object.select) {
        object.select()
      }
      selections[0] = object
    }

    // Nothing...early return
    if (!intersects.length) {
      return
    }

    // First
    handleIntesect(intersects[0])
  })

  // Hover Event
  window.addEventListener('mousemove', (e) => {
    const intersects = raycast(e)
    clearHovers()

    const handleIntesect = ({ object } = {}) => {
      // console.log(object)

      // Call custom handler of object
      if (object.hover) {
        object.hover()
      }

      hovers[0] = object
    }

    // Nothing...early return
    if (!intersects.length) {
      return
    }

    // First
    handleIntesect(intersects[0])
  })

  // Animate
  const animate = function () {
    requestAnimationFrame(animate)

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update()

    renderer.render(scene, camera)
  }

  // Start animate
  animate()

  return { scene, controls, camera, mouse }
}
