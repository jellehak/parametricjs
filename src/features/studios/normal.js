export default {
  render ({ THREE, scene }) {
    scene.add(new THREE.AmbientLight(0x443333))

    var light = new THREE.DirectionalLight(0xffddcc, 1)
    light.position.set(1, 0.75, 0.5)
    scene.add(light)

    light = new THREE.DirectionalLight(0xccccff, 1)
    light.position.set(-1, 0.75, -0.5)
    scene.add(light)

    return scene
  }
}
