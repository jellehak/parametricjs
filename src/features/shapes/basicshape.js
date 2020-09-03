
export default {
  name: 'basicshape',

  props: {
    shape: {
      type: 'enum',
      label: 'Shape',
      items: [
        'california',
        'triangle',
        'roundedRect',
        'track',
        'square',
        'heart',
        'circle',
        'fish',
        'smiley',
        'arc',
        'spline'
      ],
      default: 'heart'
    }
  },

  render ({ THREE }) {
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html
    const generateShapes = () => {
      // California

      var californiaPts = []

      californiaPts.push(new THREE.Vector2(610, 320))
      californiaPts.push(new THREE.Vector2(450, 300))
      californiaPts.push(new THREE.Vector2(392, 392))
      californiaPts.push(new THREE.Vector2(266, 438))
      californiaPts.push(new THREE.Vector2(190, 570))
      californiaPts.push(new THREE.Vector2(190, 600))
      californiaPts.push(new THREE.Vector2(160, 620))
      californiaPts.push(new THREE.Vector2(160, 650))
      californiaPts.push(new THREE.Vector2(180, 640))
      californiaPts.push(new THREE.Vector2(165, 680))
      californiaPts.push(new THREE.Vector2(150, 670))
      californiaPts.push(new THREE.Vector2(90, 737))
      californiaPts.push(new THREE.Vector2(80, 795))
      californiaPts.push(new THREE.Vector2(50, 835))
      californiaPts.push(new THREE.Vector2(64, 870))
      californiaPts.push(new THREE.Vector2(60, 945))
      californiaPts.push(new THREE.Vector2(300, 945))
      californiaPts.push(new THREE.Vector2(300, 743))
      californiaPts.push(new THREE.Vector2(600, 473))
      californiaPts.push(new THREE.Vector2(626, 425))
      californiaPts.push(new THREE.Vector2(600, 370))
      californiaPts.push(new THREE.Vector2(610, 320))

      for (var i = 0; i < californiaPts.length; i++) californiaPts[i].multiplyScalar(0.25)

      var california = new THREE.Shape(californiaPts)

      // Triangle

      var triangle = new THREE.Shape()
        .moveTo(80, 20)
        .lineTo(40, 80)
        .lineTo(120, 80)
        .lineTo(80, 20) // close path

      // Heart

      var x = 0; var y = 0

      var heart = new THREE.Shape() // From http://blog.burlock.org/html5/130-paths
        .moveTo(x + 25, y + 25)
        .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
        .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
        .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
        .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
        .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
        .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25)

      // Square

      var sqLength = 80

      var square = new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, sqLength)
        .lineTo(sqLength, sqLength)
        .lineTo(sqLength, 0)
        .lineTo(0, 0)

      // Rounded rectangle

      var roundedRect = new THREE.Shape();

      (function roundedRect (ctx, x, y, width, height, radius) {
        ctx.moveTo(x, y + radius)
        ctx.lineTo(x, y + height - radius)
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
        ctx.lineTo(x + width - radius, y + height)
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        ctx.lineTo(x + width, y + radius)
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
        ctx.lineTo(x + radius, y)
        ctx.quadraticCurveTo(x, y, x, y + radius)
      })(roundedRect, 0, 0, 50, 50, 20)

      // Track

      var track = new THREE.Shape()
        .moveTo(40, 40)
        .lineTo(40, 160)
        .absarc(60, 160, 20, Math.PI, 0, true)
        .lineTo(80, 40)
        .absarc(60, 40, 20, 2 * Math.PI, Math.PI, true)

      // Circle

      var circleRadius = 40
      var circle = new THREE.Shape()
        .moveTo(0, circleRadius)
        .quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0)
        .quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius)
        .quadraticCurveTo(-circleRadius, -circleRadius, -circleRadius, 0)
        .quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius)

      // Fish

      var x = 0
      y = 0

      var fish = new THREE.Shape()
        .moveTo(x, y)
        .quadraticCurveTo(x + 50, y - 80, x + 90, y - 10)
        .quadraticCurveTo(x + 100, y - 10, x + 115, y - 40)
        .quadraticCurveTo(x + 115, y, x + 115, y + 40)
        .quadraticCurveTo(x + 100, y + 10, x + 90, y + 10)
        .quadraticCurveTo(x + 50, y + 80, x, y)

      // Arc circle

      var arc = new THREE.Shape()
        .moveTo(50, 10)
        .absarc(10, 10, 40, 0, Math.PI * 2, false)

      var holePath = new THREE.Path()
        .moveTo(20, 10)
        .absarc(10, 10, 10, 0, Math.PI * 2, true)

      arc.holes.push(holePath)

      // Smiley

      var smiley = new THREE.Shape()
        .moveTo(80, 40)
        .absarc(40, 40, 40, 0, Math.PI * 2, false)

      var smileyEye1Path = new THREE.Path()
        .moveTo(35, 20)
        .absellipse(25, 20, 10, 10, 0, Math.PI * 2, true)

      var smileyEye2Path = new THREE.Path()
        .moveTo(65, 20)
        .absarc(55, 20, 10, 0, Math.PI * 2, true)

      var smileyMouthPath = new THREE.Path()
        .moveTo(20, 40)
        .quadraticCurveTo(40, 60, 60, 40)
        .bezierCurveTo(70, 45, 70, 50, 60, 60)
        .quadraticCurveTo(40, 80, 20, 60)
        .quadraticCurveTo(5, 50, 20, 40)

      smiley.holes.push(smileyEye1Path)
      smiley.holes.push(smileyEye2Path)
      smiley.holes.push(smileyMouthPath)

      // Spline shape

      var splinepts = []
      splinepts.push(new THREE.Vector2(70, 20))
      splinepts.push(new THREE.Vector2(80, 90))
      splinepts.push(new THREE.Vector2(-30, 70))
      splinepts.push(new THREE.Vector2(0, 0))

      var spline = new THREE.Shape()
        .moveTo(0, 0)
        .splineThru(splinepts)

      return {
        california,
        triangle,
        roundedRect,
        track,
        square,
        heart,
        circle,
        fish,
        smiley,
        arc,
        spline
      }
    }

    // Return THREE.Shape
    return generateShapes()[this.shape]
  }

}
