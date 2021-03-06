import { Raycast } from './core/Raycast.js'

export function UI ({ scene, camera, renderer }) {
  const raycast = new Raycast({
    scene,
    camera,
    domElement: renderer.domElement // document.body //
  })

  let selectedObject = {}
  let highlightObject = {}
  let previousObject = {}

  raycast.on('raycastClick', (resp) => {
    const closest = resp[0]

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
    const closest = resp[0]

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
