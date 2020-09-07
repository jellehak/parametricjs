export default {
  props: {

  },

  render ({ THREE, scene }) {
    console.log('Hello from grass')
    // return standardChamfer(context, id, definition)
    // ground
    var loader = new THREE.TextureLoader()

    var groundTexture = loader.load('textures/terrain/grasslight-big.jpg')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 16
    groundTexture.encoding = THREE.sRGBEncoding

    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial)
    mesh.position.y = -250
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    scene.add(mesh)
  }
}
