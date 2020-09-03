/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
 */

export default () => {
  // ================
  // Raycaster, for Selection / Hovers
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
    const element = renderer.domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
    const { left, top, width, bottom } = element
    const { clientX, clientY } = e
    return {
      x: ((clientX - left) / (width - left)) * 2 - 1,
      y: -((clientY - top) / (bottom - top)) * 2 + 1
    }
  }

  /**
   * Raycast helper
   * @param {*} e
   */
  const raycast = (e) => {
    // 1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse = computeMouseXY(e)

    // 2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera)

    // 3. compute intersections
    var intersects = raycaster.intersectObjects(scene.children, true)
    return intersects
    //   /*
    //         An intersection has the following properties :
    //             - object : intersected object (THREE.Mesh)
    //             - distance : distance from camera to intersection (number)
    //             - face : intersected face (THREE.Face3)
    //             - index : intersected face index (number)
    //             - point : intersection point (THREE.Vector3)
    //             - uv : intersection point in the object's UV coordinates (THREE.Vector2)
    //     */
  }

  // ============
  // Events
  // ============
  // element.addEventListener('created', function (event) {
  //   // (1)
  //   alert('Hello from ')
  // })
  // Dispatch custom Event
  element.dispatchEvent(
    new Event('created')
  )

  const detectSelection = (e) => {
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

    // Tell feature..
    handleIntesect(intersects[0])

    // Tell parent
    element.dispatchEvent(
      new CustomEvent('click:intersect', {
        detail: intersects[0]
      })
    )
  }

  const detectHover = (e) => {
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

    // Tell feature..
    handleIntesect(intersects[0])

    // Tell parent
    element.dispatchEvent(
      new CustomEvent('hover', {
        detail: intersects[0]
      })
    )
  }

  const onTouchMove = e => {
    mouse = computeMouseXY(e)
    console.log(mouse)
  }

  // Handle UI Interactions
  // Click Event
  renderer.domElement.addEventListener('click', detectSelection)
  // Hover Event
  // renderer.domElement.addEventListener('mousemove', detectHover)
  renderer.domElement.addEventListener('mousemove', onTouchMove)
  renderer.domElement.addEventListener('touchmove', onTouchMove)
}
