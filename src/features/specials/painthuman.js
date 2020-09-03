// https://github.com/mrdoob/three.js/blob/master/examples/webgl_decals.html
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

export default {
  name: 'decals',

  props: {
    direction: {
      title: 'direction',
      default: [10, 0, 0]
    }
  },

  async render ({ getMouse, camera, THREE, raycaster }, previousState) {
    // ==========
    // State
    // ==========
    var mesh
    const server = 'https://threejs.org/examples'
    var intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3()
    }
    var intersects = []
    var position = new THREE.Vector3()
    var orientation = new THREE.Euler()
    var size = new THREE.Vector3(10, 10, 10)
    var params = {
      minScale: 10,
      maxScale: 20,
      rotate: true,
      clear: function () {
        removeDecals()
      }
    }
    var mouseHelper
    var line

    // ==========
    // Helpers
    // ==========
    const modelLoader = loader => (url) => {
      return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject)
      })
    }

    async function loadLeePerrySmith () {
      const gltf = await modelLoader(new GLTFLoader())(`${server}/models/gltf/LeePerrySmith/LeePerrySmith.glb`)
      const mesh = gltf.scene.children[0]
      mesh.material = new THREE.MeshPhongMaterial({
        specular: 0x111111,
        map: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Map-COL.jpg`),
        specularMap: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Map-SPEC.jpg`),
        normalMap: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg`),
        shininess: 25
      })
      mesh.scale.set(10, 10, 10)
      return mesh
    }

    function shoot () {
      position.copy(intersection.point)
      orientation.copy(mouseHelper.rotation)

      if (params.rotate) orientation.z = Math.random() * 2 * Math.PI

      var scale = params.minScale + Math.random() * (params.maxScale - params.minScale)
      size.set(scale, scale, scale)

      var material = decalMaterial.clone()
      material.color.setHex(Math.random() * 0xffffff)

      var m = new THREE.Mesh(new DecalGeometry(mesh, position, orientation, size), material)

      decals.push(m)
      group.add(m)
    }

    function removeDecals () {
      decals.forEach(function (d) {
        group.remove(d)
      })

      decals = []
    }

    function checkIntersection () {
      if (!mesh) return

      // console.log('getMouse', getMouse())
      const mouse = getMouse()
      console.log(mouse, camera, mesh)

      raycaster.setFromCamera(mouse, camera)
      raycaster.intersectObject(mesh, false, intersects)

      if (intersects.length > 0) {
        var p = intersects[0].point
        mouseHelper.position.copy(p)
        intersection.point.copy(p)

        var n = intersects[0].face.normal.clone()
        n.transformDirection(mesh.matrixWorld)
        n.multiplyScalar(10)
        n.add(intersects[0].point)

        intersection.normal.copy(intersects[0].face.normal)
        mouseHelper.lookAt(n)

        var positions = line.geometry.attributes.position
        positions.setXYZ(0, p.x, p.y, p.z)
        positions.setXYZ(1, n.x, n.y, n.z)
        positions.needsUpdate = true

        intersection.intersects = true

        intersects.length = 0
      } else {
        intersection.intersects = false
      }
    }

    // ==========
    // Setup
    // ==========
    window.addEventListener('mouseup', function () {
      checkIntersection()
      // if (!moved && intersection.intersects)
      shoot()
    })

    const textureLoader = new THREE.TextureLoader()
    var decalDiffuse = textureLoader.load(`${server}/textures/decal/decal-diffuse.png`)
    var decalNormal = textureLoader.load(`${server}/textures/decal/decal-normal.jpg`)
    var decalMaterial = new THREE.MeshPhongMaterial({
      specular: 0x444444,
      map: decalDiffuse,
      normalMap: decalNormal,
      normalScale: new THREE.Vector2(1, 1),
      shininess: 30,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      wireframe: false
    })

    var decals = []

    // Group meshes
    const group = new THREE.Object3D()

    // Line
    var geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    group.add(line)

    mesh = await loadLeePerrySmith()
    group.add(mesh)

    mouseHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 10), new THREE.MeshNormalMaterial())
    mouseHelper.visible = false
    group.add(mouseHelper)

    return group
  }

}
