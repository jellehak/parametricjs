import features, { featuresLookup } from './features'
import Feature from './Feature'
import ThreeBSP from './helpers/threeCSG.js'
import { setup } from './setup'
import materials from './materials/index.js'
import Part from './Part.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { compileParameters, computeMouseXY, getFeatureHandler, clearThreeScene, createObject } from './helpers/helpers'

const { THREE } = window

const SETTINGS = {
  el: '',
  camera: {
    x: 10,
    y: 10,
    z: 10
  },
  sketchFill: false
}

/**
 * Class: ParametricJs
 */
export default class Parametric {
  constructor (settings = SETTINGS) {
    // Eagerly create scene
    if (settings.el) {
      this.$mount(settings)
    }

    Object.assign(this, {
      version: '0.0.2',
      features: features,
      events: [],
      featuresLookup: featuresLookup
    })
    return this
  }

  /**
   * Mount to DOM
   * @param {*} settings
   */
  $mount (settings = SETTINGS) {
    const { scene, camera, mouse, renderer, controls, element, raycast } = setup(settings)
    const orbit = controls

    // # TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.addEventListener('dragging-changed', function (event) {
      orbit.enabled = !event.value
    })

    // # Add container object for the model
    const model = new THREE.Object3D()
    model.name = 'model'
    scene.add(model)

    // # Keep track of the mouse
    // const onTouchMove = e => {
    //   const mouse = computeMouseXY(renderer.domElement)(e)
    //   // console.log(mouse)
    //   this.mouse = mouse
    // }
    // renderer.domElement.addEventListener('mousemove', onTouchMove)
    // renderer.domElement.addEventListener('touchmove', onTouchMove)

    controls.addEventListener('end', (e) => {
    // Update localStorage?
      // console.log('Cam change', e)
      // config.store.camera = JSON.stringify(camera.position)
      // Emit custom event
      this.dispatchEvent('update:camera', e)
    })

    // Set this
    Object.assign(this,
      {
        ThreeBSP,
        mouse,
        scene,
        model,
        camera,
        controls,
        element,
        // Alias
        container: renderer.domElement,
        raycast,
        renderer,
        materials,
        transformControls
      })

    // State
    this.selection = []
    this.animations = []

    // ====================
    // Animate
    const animate = function () {
      requestAnimationFrame(animate)

      // TODO Call child animate functions

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update()

      renderer.render(scene, camera)
    }

    // Start animate
    animate()
  }

  getFeatureMeta (type = '') {
    return this.features[type]
  }

  getAllFeatures () {
    return this.features
  }

  clear (to = this.model) {
    clearThreeScene(to)
  }

  /**
   * Set a new model to the scene. Default it renders to this.model
   * @param {{}} what
   */
  set (what = THREE.Object3D, to = this.model) {
    // # The Object3D to use
    // const to = this.model

    // # Clear first
    // Call all destroy handlers (TODO use flattened feature tree)
    // console.log('Cleaning up', to)
    const cleanupJob = to && to.children[0] && to.children[0]._featureMeshLookup
    if (cleanupJob) {
      cleanupJob.map(feature => {
        // console.log('Call destroy lifecycle of', feature)
        feature._handler && feature._handler.destroy()
      })
    }

    // # Clear scene
    this.clear(to)

    // # Add to scene
    to.add(what)

    return what
  }

  add (what) {
    this.scene.add(what)
  }

  /**
   * Select part
   * @param {*} what
   */
  clearSelection () {

  }

  select (object) {
    // Clear previous selection
    this.clearSelection()

    // Highlight
    if (object.type === 'LineSegments') {
      console.log(object)
      object.material.color = new THREE.Color(0x607d8b)
    }
    // this.selection = object
  }

  setViewStyle (type = 'shaded') {
    console.log(`New view style ${type}`)
  }

  /**
   * Proxy for this.element events
   * @param {*} event
   * @param {*} cb
   */
  on (event, cb = () => { }) {
    return this.element.addEventListener(event, cb)
  }

  dispatchEvent (name = '', args) {
    const event = new CustomEvent(name, { detail: args })

    // Dispatch the event.
    this.element.dispatchEvent(event)
  }

  /**
   * feature factory
   * @param {*} type
   */
  createFeature (type = '', settings = {}) {
    // Find handler according to feature name
    const handler = this.featuresLookup[type]

    if (!handler) {
      throw new Error(`No handler found for feature: "${type}"`)
    }

    // Create Feature
    return new Feature({
      ...handler,
      ...settings,
      $root: this
    })
  }

  /**
   * feature factory (alias of createFeature)
   * @param {*} type
   */
  feature (settings = {
    type: ''
    // ...
  }) {
    const { type } = settings
    return this.createFeature(type, settings)
  }

  /**
   * Convert the features to a THREE js mesh
   * @param {*} cadData
   */
  compile (_features = []) {
    // Convert to Feature Objects
    const features = _features.map(this.feature.bind(this))

    // Wrap in Part object
    const part = new Part(features)

    return part
  }
}
