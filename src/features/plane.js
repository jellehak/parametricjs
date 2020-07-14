// https://threejs.org/docs/scenes/geometry-browser.html#PlaneGeometry
export default {
  name: 'plane',

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
    console.log('Highlight')
  },

  render ({ THREE, scene }) {
    // console.log(`Create plane on ${this.on}`)

    // ============
    // Text (https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html)
    // const text = 'front'
    // const geo = new THREE.TextGeometry(text, {

    // })
    // scene.add(geo)

    // create a canvas element (view-source:https://stemkoski.github.io/Three.js/Texture-From-Canvas.html)
    // var canvas1 = document.createElement('canvas')
    // var context1 = canvas1.getContext('2d')
    // context1.font = 'Bold 20px Arial'
    // context1.fillStyle = 'rgba(255,0,0,0.95)'
    // context1.fillText('front', 0, 50)

    // // canvas contents will be used for a texture
    // var texture1 = new THREE.Texture(canvas1)
    // texture1.needsUpdate = true
    // var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide })
    // material1.transparent = true

    // var mesh1 = new THREE.Mesh(
    //   new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    //   material1
    // )
    // mesh1.position.set(0, 0, 0)
    // scene.add(mesh1)
    // ============

    // Create Root element
    const group = new THREE.Object3D()
    group.name = 'planegroup'
    // scene.add(group)

    // Custom handler
    group.selection = (e) => {
      console.log('Selection')
    }

    const materials = {
      normal: new THREE.MeshBasicMaterial({
        color: this.color || 0x156289,
        // emissive: 0x072534,
        side: THREE.DoubleSide,
        // flatShading: true,
        transparent: true,
        opacity: 0.1
      }),
      highlight: new THREE.MeshBasicMaterial({
        color: 0x156289,
        // emissive: 0x072534,
        side: THREE.DoubleSide,
        // flatShading: true,
        transparent: true,
        opacity: 0.3
      }),
      outline: new THREE.LineBasicMaterial({ color: 0x66A4C0 }),
      outline_SELECTED: new THREE.LineBasicMaterial({ color: 'orange' })
    }

    // Plane
    const geometry = new THREE.PlaneGeometry(10, 10)
    const plane = new THREE.Mesh(geometry, materials.normal)
    plane.renderOrder = 1
    plane.name = 'plane'
    group.add(plane)

    // Outline
    var edges = new THREE.EdgesGeometry(geometry)
    var line = new THREE.LineSegments(edges, materials.outline)
    line.name = 'outline'
    group.add(line)

    // Handle events
    const select = (e) => {
      // Toggle visible
      plane.material = materials.highlight
      plane.material.needsUpdate = true
    }

    const deselect = (e) => {
      // Toggle visible
      plane.material = materials.normal
      plane.material.needsUpdate = true
    }

    const hover = (e) => {
      line.material = materials.outline_SELECTED
      line.material.needsUpdate = true
    }
    const mouseout = (e) => {
      line.material = materials.outline
      line.material.needsUpdate = true
    }

    // Events
    plane.deselect = deselect
    plane.select = select
    plane.hover = hover
    plane.mouseout = mouseout
    line.select = select
    line.deselect = deselect
    line.hover = hover
    line.mouseout = mouseout

    // Handle group orientation
    const DEFAULTS_POSITIONS = {
      right: (plane) => {
        plane.rotation.y = Math.PI / 2
      },
      top: (plane) => {
        plane.rotation.x = Math.PI / 2
      },
      front: (plane) => {
        // plane.rotation.x = Math.PI / 2
      }
    }

    // Set position
    DEFAULTS_POSITIONS[this.on](group)

    return group
  }

}
