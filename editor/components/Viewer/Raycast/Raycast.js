// TODO? import { Observable } from "./lib/Observable.js"
import { EventEmitter } from './lib/EventEmitter.js'
const {THREE} = window

export class Raycast extends EventEmitter {
  constructor ({ intersectWith, camera, domElement } = {}) {
    super()

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false)

    this.domElement = domElement
    this.camera = camera
    this.intersectWith = intersectWith
    this.raycaster = new THREE.Raycaster()
  }

  onMouseMove (event) {
    const container = this.domElement.getBoundingClientRect()
    const {left, top, width, bottom} = container
    const {clientX, clientY} = event

    const x = ((clientX - left) / (width - left)) * 2 - 1
    const y = -((clientY - top) / (bottom - top)) * 2 + 1

    const intersects = this.testRaycast({ x, y })
    this.emit('move', intersects)
    // if (intersects.length) { this.emit('move', intersects) }
  }

  onMouseDown (event) {
    const container = this.domElement.getBoundingClientRect()
    const {left, top, width, bottom} = container
    const {clientX, clientY} = event

    const x = ((clientX - left) / (width - left)) * 2 - 1
    const y = -((clientY - top) / (bottom - top)) * 2 + 1

    const intersects = this.testRaycast({ x, y })
    this.emit('click', intersects)
  }

  testRaycast ({ x, y }) {
    this.raycaster.setFromCamera({ x, y }, this.camera)

    var intersects = this.raycaster.intersectObjects(this.intersectWith, true)

    return intersects
  }
}

// onMouseDownTest (event) {
//   console.log(this.domElement)
//   // const width = window.innerWidth
//   // const height = window.innerHeight
//   const container = this.domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
//   const {left, top, width, height, bottom} = container
//   // const x = ((event.clientX - left) / (width - left)) * 2 - 1
//   // const y = -((event.clientY - top) / (bottom - top)) * 2 + 1
//   const {clientX, clientY} = event

//   const x = ((clientX - left))
//   const y = -((clientY - top))

//   console.log({clientX, clientY})
//   // console.log(width, height)
//   // console.log(container, event)
//   // console.log({ x, y })
//   this.testRaycast({ x, y })
// }
