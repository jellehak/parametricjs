export default {
  name: 'box',

  props: {
    width: {
      type: 'Number',
      default: 10
    },
    height: {
      type: 'Number',
      default: 10
    },
    depth: {
      type: 'Number',
      default: 10
    },
    color: {
      type: 'Color',
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
