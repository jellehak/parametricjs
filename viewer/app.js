import cad from '../models/sketch.js'
import './node_modules/ace-builds/src-min/ace.js'
import './node_modules/ace-builds/src-min/theme-twilight.js'
import './node_modules/ace-builds/src-min/mode-json.js'
// import { timeoutPromise } from './helpers/timeoutPromise.js'
import {UI} from './ui.js'

const {ace, Split} = window
const {y3d} = window
const {Parametric} = window

const y3dConfig = {
  elementId: 'scene',
  camera: {
    x: 100,
    y: 100,
    z: 100
  },
  size: '1 unit = 1 mm',
  background: '#fff'
}

const {scene, add} = y3d.setup(y3dConfig)

add({
  type: 'axis'
})

// Init UI
UI({scene})

// Handle resize
window.addEventListener('resize', onWindowResize, false)

function onWindowResize () {
  const {camera, renderer} = y3d
  const element = document.getElementById(y3dConfig.elementId)
  const [width, height] = [element.offsetWidth, element.offsetHeight]

  // Inform THREE
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

let part = Parametric.create({ cad: JSON.parse(JSON.stringify(cad)), scene })
// scene.add(part.render())

// Attach to window for easy console debug
window.scene = scene
window.part = part

// Split screen
Split(['#editor', '#scene'], {
  sizes: [25, 75],
  onDragEnd: onWindowResize
})

// Editor
var editor = ace.edit('editor')
editor.setTheme('ace/theme/twilight')
editor.getSession().on('change', update)
editor.session.setMode('ace/mode/json')
editor.setValue(JSON.stringify(cad, null, '\t'))

async function update (e) {
  try {
    // Remove
    scene.remove(scene.getObjectByName('simple-box'))

    // Simulated wait
    // await timeoutPromise(1000)

    // Add new object
    const newCadData = JSON.parse(editor.getValue())
    const obj3d = part.render(newCadData)
    scene.add(obj3d)
  } catch (err) {
    console.warn(`JSON is not valid`)
    // Remove
    // scene.remove(scene.getObjectByName('simple-box'))
  }
}
