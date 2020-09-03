// https://threejs.org/examples/#webgl_decals
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_decals.html
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

export default {
  name: 'paint',

  props: {
    entities: {
      type: 'Entities',
      title: 'entities',
      default: () => ([])
      // default: () => (['$previous']) // FIX
    },
    color: {
      title: 'color',
      default: 'red'
    }
  },

  async render ({ destroy, addEventListener, getMouse, camera, THREE, parseEntities, raycaster }, previousState) {
    // const parsedEntities = parseEntities(this.entities)

    // ==========
    // State
    // ==========
    // var mesh = parsedEntities[0]
    // var mesh = parsedEntities[0].children[0] // TEST
    console.log('Paint to these mesh(es)', this.entities)

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
    var decals = []

    // ==========
    // Helpers
    // ==========
    const getMesh = () => {
      const parsedEntities = parseEntities(this.entities)

      // console.log(this.entities, parsedEntities)
      // return parsedEntities[0]
      return parsedEntities[0].children[0] // TEMP fix
    }

    const shoot = () => {
      position.copy(intersection.point)
      orientation.copy(mouseHelper.rotation)

      if (params.rotate) orientation.z = Math.random() * 2 * Math.PI

      const scale = params.minScale + Math.random() * (params.maxScale - params.minScale)
      size.set(scale, scale, scale)

      const material = decalMaterial.clone()
      // material.color.setHex(Math.random() * 0xffffff) // Random
      material.color = new THREE.Color(this.color)

      const decal = new DecalGeometry(getMesh(), position, orientation, size)
      const m = new THREE.Mesh(decal, material)

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
      const mesh = getMesh()
      if (!mesh) return

      // console.log('getMouse', getMouse())
      const mouse = getMouse()
      console.log(mouse, mesh)

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

    const handleClick = () => {
      // Do only when scope is set
      if (!this.entities || this.entities.length === 0) {
        console.warn('No entities set', this.entities, this)
        return
      } else {
        console.warn('Painting', this.entities)
      }
      // window.addEventListener('mouseup', function () {
      checkIntersection()
      // if (!moved && intersection.intersects)
      shoot()
    }

    // ==========
    // Setup
    // ==========
    // # Events
    addEventListener('click', handleClick)

    destroy(() => {
      removeEventListener('click', handleClick)
    })

    var textureLoader = new THREE.TextureLoader()
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

    // Create Group
    const group = new THREE.Object3D()

    // Line
    var geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    group.add(line)

    mouseHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 10), new THREE.MeshNormalMaterial())
    mouseHelper.visible = true
    group.add(mouseHelper)

    return group
  }

}
