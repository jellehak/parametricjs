// https://threejs.org/docs/scenes/geometry-browser.html#PlaneGeometry

export default {
  name: 'origin',

  props: {
    color: {
      title: 'Color',
      type: String,
      default: 'black'
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

    var pointMaterial = new THREE.PointsMaterial({
      size: 1,
      map: createCircleTexture(this.color, 256),
      transparent: true,
      depthWrite: false
    })

    var pointGeometry = new THREE.Geometry()
    pointGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0)
    )

    const point = new THREE.Points(pointGeometry, pointMaterial)
    point.name = 'origin'
    return point
  }

}
