// view-source:https://threejs.org/examples/misc_controls_transform.html
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default {
  name: 'transformcontrol',

  props: {
    mesh: {
      type: 'Mesh'
    }
  },

  mounted ({ scene, camera, renderer }) {
    const control = new TransformControls(camera, renderer.domElement)
    // control.addEventListener('change', render)

    // control.addEventListener('dragging-changed', function (event) {
    //   orbit.enabled = !event.value
    // })

    control.attach(this.mesh)
    scene.add(control)
  },

  render (context = {}) {

  }

}
