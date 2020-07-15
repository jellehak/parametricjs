// https://threejs.org/docs/#api/geometries/CircleGeometry

const { THREE } = window

export default (context = {}) => {
  const { feature } = context
  const { name } = feature
  const { x = 0, y = 0, r = 1 } = feature

  // Create new material
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const blue = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
  })

  // Geo
  const geometry = new THREE.CircleGeometry(r, 32)
  const geometry2 = new THREE.CircleGeometry(r, 32)

  // const mesh = new THREE.LineLoop(geometry, material)

  const mesh = new THREE.Object3D()

  const fill = new THREE.Mesh(geometry, blue)
  fill.name = 'fill'
  fill.visible = false
  mesh.add(fill)

  // Remove center vertex
  geometry2.vertices.shift()
  const lines = new THREE.LineLoop(geometry2, material)
  lines.name = 'lines'
  mesh.add(lines)

  // Pos
  mesh.position.x = x
  mesh.position.y = y
  mesh.name = name || 'circle'
  return mesh
}

// var geometry = new THREE.CircleGeometry(5, 32)
// var material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// var circle = new THREE.Mesh(geometry, material)
// scene.add(circle)

// mesh.add(new THREE.LineSegments(
//   geometry,
//   new THREE.LineBasicMaterial({
//     color: 0xffffff,
//     transparent: true,
//     opacity: 0.5
//   })
// ))

// mesh.add(new THREE.Mesh(
//   geometry,
//   new THREE.MeshPhongMaterial({
//     color: 0x156289,
//     emissive: 0x072534,
//     side: THREE.DoubleSide,
//     flatShading: true
//   })
// ))
