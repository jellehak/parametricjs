import { Raycast } from './core/Raycast.js'
const {y3d} = window

export function UI ({scene}) {
  const raycast = new Raycast({
    scene,
    camera: y3d.camera,
    domElement: y3d.renderer.domElement // document.body //
  })

  let selectedObject = {}
  let highlightObject = {}
  let previousObject = {}

  raycast.on('raycastClick', (resp) => {
    let closest = resp[0]

    selectedObject = closest.object

    console.log('click')
    selectedObject.selected = true

    // New Object ?
    if (selectedObject !== previousObject) {
      // Has color change?
      try {
        selectedObject.material.color.setHex(0xfff000)
        if (previousObject) {
          previousObject.material.color.setHex(0x000000)
        }
      } catch (err) {

      }
    }

    previousObject = selectedObject
  })

  // Mouse hover
  raycast.on('raycast', (resp) => {
    let closest = resp[0]

    // Hightlight
    // var box = new THREE.BoxHelper(closest.object, 0xffff00)
    //     //box.scale = 1.1
    // scene.add(box)

    highlightObject = closest.object

    // New Object ?
    if (highlightObject !== previousObject) {
      // Has color change?
      try {
        // highlightObject.material.color.setHex(0x000fff)

        if (previousObject) {
          previousObject.material.color.setHex(0x000000)
        }
      } catch (err) {

      }
    }

    previousObject = highlightObject
  })
}
