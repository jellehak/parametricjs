const { THREE } = window

export default (context = {}) => {
  const { x = 0, y = 0, r = 0.1 } = context.feature

  const geometry = new THREE.CircleGeometry(r, 32)

  // Remove center vertex
  geometry.vertices.shift()

  geometry.vertices.push(new THREE.Vector3(0.1, 0, 0))
  geometry.vertices.push(new THREE.Vector3(-0.1, 0, 0))
  geometry.vertices.push(new THREE.Vector3(0, 0.1, 0))
  geometry.vertices.push(new THREE.Vector3(0, -0.1, 0))

  const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const mesh = new THREE.LineLoop(geometry, material)
  mesh.position.x = x
  mesh.position.y = y

  // const mesh = new THREE.LineSegments(
  //   new THREE.Geometry(),
  //   new THREE.LineBasicMaterial({
  //     color: 0x000fff,
  //     transparent: true,
  //     opacity: 0.5
  //   })
  // )

  return mesh
}
