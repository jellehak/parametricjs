export default {
  // name: 'shapeheart',

  props: {
    width: {
      type: 'number',
      default: 80
    }
  },

  render ({ THREE }) {
    var x = 0; var y = 0

    var heartShape = new THREE.Shape() // From http://blog.burlock.org/html5/130-paths
      .moveTo(x + 25, y + 25)
      .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
      .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
      .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
      .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
      .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
      .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25)

    // Group points in a THREE.Shape
    return heartShape
  }

}
