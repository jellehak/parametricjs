import '/node_modules/three/examples/js/controls/TransformControls.js'
import { Raycast } from './Raycast/Raycast.js'
const {y3d} = window
const {THREE} = window

export function MouseSelectionControls () {
  const {scene, camera, renderer} = y3d

  const state = {
    selected: {},
    selectedPrevious: {},
    hightlighted: {},
    hightlightedPrevious: {}
  }

  const raycast = new Raycast({
    intersectWith: y3d.scene.children,
    camera: y3d.camera,
    domElement: y3d.renderer.domElement // document.body //
  })

  // TransformControl
  const control = new THREE.TransformControls(camera, renderer.domElement)
  scene.add(control)

  // Click
  raycast.on('click', (hits) => {
    if (!hits.length) {
      return run('OUTSIDE_CLICK')
    }

    const closest = hits[0]
    const {object} = closest

    run('NEW_SELECTED', object)
  })

  // Mouse move
  raycast.on('move', (hits) => {
    // No hit ?
    if (hits.length === 0 && state.hightlighted) {
      run('CLEAR_HIGHLIGHTED')
    }

    // console.log(hits.length)

    const closest = hits[0] || {}
    const {object} = closest

    // New Object ?
    if (object && object !== state.hightlightedPrevious) {
      run('NEW_HIGHLIGHTED', object)
    }
  })

  // Trigger action
  function run (action, payload) {
    console.log(action)
    // console.log(action, payload)

    switch (action) {
      case 'NEW_SELECTED':
        state.selected = payload
        setColor(state.selected, 'red')
        setColor(state.selectedPrevious, 'black')
        changeFillTo(payload)

        // TODO Extrude?
        control.detach()
        control.attach(payload)

        state.selectedPrevious = state.selected
        break
      case 'NEW_HIGHLIGHTED':
        state.hightlighted = payload
        setColor(state.hightlighted, 'blue')
        setColor(state.hightlightedPrevious, 'black')
        setColor(state.selected, 'red')
        state.hightlightedPrevious = state.hightlighted
        break
      case 'CLEAR_HIGHLIGHTED':
        setColor(state.hightlighted, 'black')
        setColor(state.hightlightedPrevious, 'black')
        setColor(state.selected, 'red')
        state.hightlighted = false
        state.hightlightedPrevious = false
        break
      case 'OUTSIDE_CLICK':
        control.detach()
        // control.visible = false
        setColor(state.selected, 'black')
        setColor(state.selectedPrevious, 'black')
        setFill(prev, false)
        state.selected = false
        break
    }
  }
}

var prev = false
function changeFillTo (obj) {
  try {
    setFill(prev, false)
    setFill(obj, true)
    prev = obj
  } catch (err) {
    console.warn(err)
  }
}

function setFill (obj, bool) {
  if (!obj) return

  const fill = obj.parent.children
    .filter(elem => elem.name === 'fill')[0]

  if (fill) fill.visible = bool
}

function setColor (object, color = 'black') {
  if (!object) return

  try {
    // console.log(`Setting color of ${object.name || object.uuid} : ${color}`)
    object.material.color.setHex(color)
    object.material.color = new THREE.Color(color)
  } catch (err) {
    // console.warn(err)
  }
}

function pullTool () {
  var arrowGeometry = new THREE.Geometry()
  var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false))
  mesh.position.y = 0.5
  mesh.updateMatrix()
  arrowGeometry.merge(mesh.geometry, mesh.matrix)
  var lineXGeometry = new THREE.BufferGeometry()
  lineXGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3))
  const material = new THREE.MeshBasicMaterial({color: new THREE.Color('red')})
  const arrow = new THREE.Mesh(arrowGeometry, material)
  const line = new THREE.Line(lineXGeometry, material)
  const pullTool = new THREE.Object3D()
  pullTool.add(arrow)
  pullTool.add(line)
  scene.add(pullTool)
  pullTool.visible = false
}
