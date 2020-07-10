import extrude from './extrude'
import { normal } from './materials/mesh.js'
const { THREE } = window

export default function cut (input) {
  const { ycad, ThreeBSP, scene, feature, object3d } = input
  const { getFeatureById } = ycad
  const { selectById, sketchId } = feature

  // TODO Find first type = mesh
  const toBeCutted = object3d.children.filter(elem => elem.type === 'Mesh')[0] // object3d.children[0]

  // First create the extruded mesh (could be geom)
  const target = getFeatureById(selectById || sketchId)
  const { mesh: meshExtrude } = extrude(input)

  // return { mesh: meshExtrude }

  // console.log("Work in progress")
  console.log('Body to be cutted:', toBeCutted)
  console.log('Body to be extruded:', meshExtrude)

  // Convert to ThreeBSP
  var bspToKeep = new ThreeBSP(toBeCutted)
  var bspRemove = new ThreeBSP(meshExtrude)
  var subtractBsp = bspToKeep.subtract(bspRemove)
  var mesh = subtractBsp.toMesh(normal)
  mesh.geometry.computeVertexNormals()
  object3d.add(mesh)

  // object3d.add(meshExtrude) //The cut

  // Add edges ?
  // var edges = new THREE.EdgesGeometry(mesh.geometry)
  // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }))
  // scene.add(line)

  // Hide the previous
  toBeCutted.visible = false
}

// --------------
// Snippets
// --------------
// function exampleBSP () {
//   // var start_time = (new Date()).getTime();
//   var cube_geometry = new THREE.CubeGeometry(3, 3, 3)
//   var cube_mesh = new THREE.Mesh(cube_geometry)
//   cube_mesh.position.x = -7
//   var cube_bsp = new ThreeBSP(cube_mesh)
//   var sphere_geometry = new THREE.SphereGeometry(1.8, 32, 32)
//   var sphere_mesh = new THREE.Mesh(sphere_geometry)
//   sphere_mesh.position.x = -7
//   var sphere_bsp = new ThreeBSP(sphere_mesh)

//   var subtract_bsp = cube_bsp.subtract(sphere_bsp)
//   var result = subtract_bsp.toMesh(new THREE.MeshLambertMaterial({
//     shading: THREE.SmoothShading,
//     map: new THREE.TextureLoader().load('texture.png')
//   }))
//   result.geometry.computeVertexNormals()
//   scene.add(result)
//   // console.log('Example 1: ' + ((new Date()).getTime() - start_time) + 'ms');
// }

// function exampleMerge () {
//   // Merge example
//   var ballGeo = new THREE.SphereGeometry(10, 35, 35)
//   var material = new THREE.MeshPhongMaterial({ color: 0xF7FE2E })
//   var ball = new THREE.Mesh(ballGeo, material)

//   var pendulumGeo = new THREE.CylinderGeometry(1, 1, 50, 16)
//   ball.updateMatrix()
//   pendulumGeo.merge(ball.geometry, ball.matrix)

//   var pendulum = new THREE.Mesh(pendulumGeo, material)
//   scene.add(pendulum)
// }
