export default {
  name: 'cubes',

  props: {
    entities: {
      title: 'Entities to chamfer',
      type: 'Array'
    },
    distance: {
      title: 'Distance',
      type: 'Number'
    }
  },

  render ({ THREE, scene, raycaster, onFrame }) {
    var geometry = new THREE.BoxBufferGeometry(20, 20, 20)

    for (var i = 0; i < 2000; i++) {
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))

      object.position.x = Math.random() * 800 - 400
      object.position.y = Math.random() * 800 - 400
      object.position.z = Math.random() * 800 - 400

      object.rotation.x = Math.random() * 2 * Math.PI
      object.rotation.y = Math.random() * 2 * Math.PI
      object.rotation.z = Math.random() * 2 * Math.PI

      object.scale.x = Math.random() + 0.5
      object.scale.y = Math.random() + 0.5
      object.scale.z = Math.random() + 0.5

      scene.add(object)
    }

    onFrame(({ mouse, camera }) => {
      console.log('frame')

      // find intersections

      raycaster.setFromCamera(mouse, camera)

      var intersects = raycaster.intersectObjects(scene.children)

      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

          INTERSECTED = intersects[0].object
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.material.emissive.setHex(0xff0000)
        }
      } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

        INTERSECTED = null
      }
    })
  }

}
