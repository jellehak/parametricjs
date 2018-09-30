import cad from '../../../models/sketch.js'
import { MouseSelectionControls } from './MouseSelectionControls.js'
// import { DrawSketch } from './DrawSketch.js'
// import { ContextMenu } from './ContextMenu.js'
import { KeyboardHandlers } from './KeyboardHandlers.js'
// import { TransformControls } from './TransformControl.js'

const {Vue} = window
const {Parametric} = window
const {y3d} = window

Vue.component('viewer', {
  template: `
      <div id='viewer'>
        <div id="scene"></div>
      </div>
      `,
  data: () => ({
    selected: {},
    highlighted: {}
  }),
  created,
  watch: {
    selected () { console.log('selected') }
  }
})

function created () {
  const y3dConfig = {
    // elementId: 'scene',
    camera: {
      x: 10,
      y: 10,
      z: 10
    },
    size: '1 unit = 1 mm',
    background: '#fff'
  }

  const {scene, add} = y3d.setup(y3dConfig)

  add({
    type: 'axis'
  })

  let part = Parametric.create({ cad: JSON.parse(JSON.stringify(cad)), scene })
  scene.add(part.render())

  MouseSelectionControls()
  // new DrawSketch()
  // new ContextMenu()
  KeyboardHandlers({scene})
  // TransformControls()

  // Attach to window for easy console debug
  window.scene = scene
  window.part = part
}
