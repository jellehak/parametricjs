var raycaster = new THREE.Raycaster()

const onMouseDown = (event) => {
  const container = this.domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
  const { left, top, width, bottom } = container
  const { clientX, clientY } = event

  const x = ((clientX - left) / (width - left)) * 2 - 1
  const y = -((clientY - top) / (bottom - top)) * 2 + 1

  const intersects = this.testRaycast({ x, y })
//   if (intersects.length) { this.emit('raycastClick', intersects) }
}

window.addEventListener('mousemove', onMouseDown, false)
