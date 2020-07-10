// https://threejs.org/docs/scenes/geometry-browser.html#PlaneGeometry

export default {
  name: 'point',

  props: {
    on: {
      title: 'On',
      default: 'front',
      required: true
    },
    distance: {
      title: 'Distance',
      type: Number
    },
    color: {
      title: 'Color',
      type: String,
      default: 'red'
    }
  },

  selected () {

  },

  render ({ THREE, scene }) {
    // https://2pha.com/blog/threejs-easy-round-circular-particles/
    const createCircleTexture = (color, size) => {
      var matCanvas = document.createElement('canvas')
      matCanvas.width = matCanvas.height = size
      var matContext = matCanvas.getContext('2d')
      // create texture object from canvas.
      var texture = new THREE.Texture(matCanvas)
      // Draw a circle
      var center = size / 2
      matContext.beginPath()
      matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false)
      matContext.closePath()
      matContext.fillStyle = color
      matContext.fill()
      // need to set needsUpdate
      texture.needsUpdate = true
      // return a texture made from the canvas
      return texture
    }

    // var sprite = new THREE.TextureLoader().load('/textures/sprites/disc.png')

    // const geometry = new THREE.BufferGeometry()
    // const material = new THREE.PointsMaterial({ size: 35, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true })
    // material.color.setHSL(1.0, 0.3, 0.7)

    // var particles = new THREE.Points(geometry, material)
    // scene.add(particles)

    var pointMaterial = new THREE.PointsMaterial({
      size: 1,
      map: createCircleTexture('#00ff00', 256),
      transparent: true,
      depthWrite: false
    })

    var pointGeometry = new THREE.Geometry()
    pointGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0)
      // new THREE.Vector3(0, 2, 0),
    )
    // var pointMaterial = new THREE.PointsMaterial({
    //   color: 0x888888,
    //   size: 1
    // })

    const point = new THREE.Points(pointGeometry, pointMaterial)
    point.name = 'point'
    scene.add(point)
  }

}
