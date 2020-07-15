// https://threejs.org/docs/scenes/geometry-browser.html#PlaneGeometry
export default {
  name: 'grid',

  props: {
    distance: {
      title: 'Distance',
      type: Number,
      default: 10
    },
    segments: {
      title: 'Segments',
      type: Number,
      default: 10
    }
  },

  selected () {
    console.log('Highlight')
  },

  render ({ THREE, scene }) {
    return new THREE.GridHelper(this.distance, this.segments)
  }

}
