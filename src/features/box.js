export default {
  name: 'box',

  props: {
    entities: {
      title: 'Entities',
      type: Array
    },
    width: {
      type: Number,
      default: 10
    },
    height: {
      type: Number,
      default: 10
    },
    depth: {
      type: Number,
      default: 10
    },
    color: {
      type: 'String',
      default: 'blue'
    }
  },

  render ({ THREE } = {}) {
    var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)
    var material = new THREE.MeshBasicMaterial({ color: this.color })
    var cube = new THREE.Mesh(geometry, material)
    return cube
  }
}
