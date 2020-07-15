import path from './sketch/path'
import patharray from './sketch/array'
import point from './sketch/point'
import circle from './sketch/circle'
import line from './sketch/line'

import Feature from '../Feature'

const sketchFeatures = {
  path,
  point,
  patharray,
  circle,
  // Move to:
  'sketch-path': path,
  'sketch-line': line,
  'sketch-circle': circle
}

export default {
  name: 'sketch',

  example: ` {
  type: 'sketch',
  on: 'front',
  features: [
    {
      type: 'sketch-path',
      values: [{
        x: 0,
        y: 0
      }, {
        x: 4,
        y: 0
      }, {
        x: 4,
        y: 4
      }, {
        x: 0,
        y: 4
      }, {
        x: 0,
        y: 0
      }]
    }
  ]
}`,

  props: {
    on: {
      title: 'Plane',
      type: 'Plane'
    },
    outline: {
      private: true,
      default: true
    },
    features: {
      title: 'features',
      type: 'Children',
      // type: 'SketchFeatures',
      private: true,
      default: () => ([])
    }
  },

  render ({ THREE, feature, compile } = {}) {
    // Create materials
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

    const processSketchChild = child => {
      let { type } = child

      // DETECT : Auto promote path : path, pathsimpel, patharray
      if (type === 'path') {
        const { path } = child
        const [first] = path
        // console.log(first)
        type = (first.constructor === Array) ? 'patharray' : 'path'
      }

      // Skip suppress
      const { suppress } = child
      if (suppress) {
        return
      }

      // Get sketch feature handler
      const handler = sketchFeatures[type]
      if (!handler) {
        throw new Error(`Unknown sketch feature: "${type}"`)
      }

      // # Run sub features
      // Call sketch feature handler
      // const resp = handler.render({
      //   // TODO
      //   feature: child
      // })
      const feature = new Feature(handler, sketchFeatures)
      // const resp = processFeature()
      const resp = feature.render({ compile, THREE, feature })
      console.log(resp)
      return resp
    }

    // ==============
    const { features = [] } = feature
    const { on } = feature

    console.log(`Creating sketch on plane "${on}"`)

    // Group
    const group = new THREE.Object3D()
    group.name = 'sketch'

    // Plane
    const geometry = new THREE.PlaneGeometry(15, 15)
    const plane = new THREE.Mesh(geometry, materials.normal)
    plane.renderOrder = 1
    plane.name = 'plane'
    group.add(plane)

    if (this.outline) {
      var edges = new THREE.EdgesGeometry(geometry)
      var line = new THREE.LineSegments(edges, materials.outline)
      line.name = 'outline'
      group.add(line)
    }

    // # Add sketch features
    // Process sketch features
    const childGroup = new THREE.Object3D()
    childGroup.name = 'sketch-child-features'
    childGroup.children = features.map(processSketchChild)

    group.add('childGroup', childGroup)
    // console.log(group)
    return group
  }
}
