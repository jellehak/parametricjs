export default {
  name: 'colorbox',

  props: {

  },

  render ({ getFeatureById, feature, object3d }, previousState) {
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    console.log(geometry.faces.length) // 12 triangles
    geometry.faces[0].color = new THREE.Color(0x000000) // Right 1
    geometry.faces[1].color = new THREE.Color(0xFF0000) // Right 2
    geometry.faces[2].color = new THREE.Color(0xFF8C08) // Left 1
    geometry.faces[3].color = new THREE.Color(0xFFF702) // Left 2
    geometry.faces[4].color = new THREE.Color(0x00FF00) // Top 1
    geometry.faces[5].color = new THREE.Color(0x0000FF) // Top 2
    geometry.faces[6].color = new THREE.Color(0x6F00FF) // Bottom 1
    geometry.faces[7].color = new THREE.Color(0x530070) // Bottom 2
    geometry.faces[8].color = new THREE.Color(0x3F3F3F) // Front 1
    geometry.faces[9].color = new THREE.Color(0x6C6C6C) // Front 2
    geometry.faces[10].color = new THREE.Color(0xA7A7A7)// Rear 1
    geometry.faces[11].color = new THREE.Color(0xFFFFFF)// Rear 2

    const material = new THREE.MeshFaceMaterial()
    const mesh = new THREE.Mesh(geometry, material)
  }

}
