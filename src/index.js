import features from './autoload'
import Feature from './Feature'
import ThreeBSP from './helpers/threeCSG.js'
import { setup } from './setup'
import materials from './materials/index.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { compileParameters, computeMouseXY, getFeatureHandler, createObject } from './helpers'

// Re-export
export * from './setup'

const { THREE } = window

const clearThreeScene = (obj3d = {}) => {
  while (obj3d.children.length > 0) {
    obj3d.remove(obj3d.children[0])
  }
}

const SETTINGS = {
  el: 'parametric',
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
export class ParametricJs {
  constructor (settings = SETTINGS) {
    // Register basic features
    this.featureHandlers = Object.values(features)
    this.featureHandlersLookup = { ...features }

    // Eagerly init scene ?
    const { scene, camera, mouse, renderer, controls, element, raycast } = setup(settings)
    const orbit = controls

    // # TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.addEventListener('dragging-changed', function (event) {
      orbit.enabled = !event.value
    })

    // # Add parent for the model
    const model = new THREE.Object3D()
    model.name = 'model'
    scene.add(model)

    // # Keep track of the mouse
    const onTouchMove = e => {
      const mouse = computeMouseXY(renderer.domElement)(e)
      // console.log(mouse)
      this.mouse = mouse
    }
    renderer.domElement.addEventListener('mousemove', onTouchMove)
    renderer.domElement.addEventListener('touchmove', onTouchMove)

    // Set this
    Object.assign(this,
      {
        version: '0.0.2',
        ThreeBSP,
        mouse,
        scene,
        model,
        camera,
        controls,
        element,
        raycast,
        renderer,
        materials,
        transformControls,
        featureMeshLookup: [] // Set by render()
      })

    // State
    this.selection = []
    this.animations = []

    // ====================
    // Animate
    const animate = function () {
      requestAnimationFrame(animate)

      // Call all child animations

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update()

      renderer.render(scene, camera)
    }

    // Start animate
    animate()
  }

  // ===========
  // Feature
  getFeatureMeta (type = '') {
    return this.featureHandlers[type]
  }

  getAllFeatures () {
    return this.featureHandlers
  }

  // ===========
  // Interactions
  clear () {
    // Clear object3d

  }

  /**
   * Set a new model to the scene. Default it renders to this.model
   * @param {{}} what
   */
  set (what = {}, to = this.model) {
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

    // Remove from THREE
    clearThreeScene(to)

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

    const children = this.model.children

    children.map(elem => {
      console.log(elem)
    })
  }

  /**
   * Method to proces a singe features
   * @param {*} features
   * @param {*} feature
   * @param {*} previousState
   * @returns {Mesh} generate mesh of a single feature
   */
  async compileFeature (featureNode = {}, { livePart, features }) {
    const { type } = featureNode

    // Find handler according to feature name
    const featureHandler = getFeatureHandler(this.featureHandlersLookup)(featureNode.type)

    if (!featureHandler) {
      throw new Error(`No featureHandler found for feature: "${type}"`)
    }

    // Create new object from feature blueprint
    const component = new Feature(featureHandler, featureNode, this, features)

    // Get render Fn
    const renderFn = component.render

    // Call render fn
    // try {
    const mesh = await renderFn(livePart) || {}

    return {
      mesh,
      component
    }
    // } catch (err) {
    //   // console.warn(err)
    //   return {
    //     mesh: false,
    //     component,
    //     errors: err
    //   }
    // }
  }

  // Browser event handler alias
  on (event, cb = () => { }) {
    return this.element.addEventListener(event, cb)
  }

  /**
   * Convert the features to a THREE js mesh
   * @param {*} cadData
   */
  async compile (cadData = { features: [] }) {
    if (!cadData) {
      throw new Error('No CadData')
    }

    const logItems = []
    const log = msg => logItems.push(msg)

    // # Group all features in an Object3D
    const livePart = createObject({
      name: 'features'
    })

    // Compile global parameters (adds cadData._parameters)
    compileParameters(cadData)

    // # Process each feature
    const { features = [] } = cadData

    // # Clone features ( featureMeshLookup contains references to the scene )
    const featureMeshLookup = features.map(elem => ({ ...elem }))

    // Expose scene features
    this.featureMeshLookup = featureMeshLookup

    // Convert JSON to Features
    const featureCompilationPromises = features.map(async (feature, i) => {
      // Skip suppress features
      if (feature.suppress) {
        log(`Skipping suppressed feature ${i}`, { ...feature })
        return
      }

      log(`Compiling feature ${i}`, { ...feature })

      // Create feature placeholder
      const featurePlaceholderObject = createObject({
        name: `feature${i}`
      })
      livePart.add(featurePlaceholderObject)

      // Mutate featureMeshLookup
      featureMeshLookup[i]._mesh = featurePlaceholderObject

      // Run feature
      const compiledFeature = await this.compileFeature(
        feature,
        { featurePlaceholderObject, livePart, features }
      )

      // Destructure
      const { mesh, component } = compiledFeature

      // Add to the livePart, so upcoming feature can use the mesh
      if (mesh) {
        featurePlaceholderObject.add(mesh)
      }

      // Mutate featureMeshLookup
      featureMeshLookup[i]._handler = component

      return compiledFeature
    })

    // Await all
    const featureCompilation = await Promise.all(featureCompilationPromises)

    // Misuse Object3D for now
    livePart._featureMeshLookup = featureMeshLookup

    return {
      render () { return livePart },
      featureCompilation,
      log: logItems,
      livePart
    }
  }
}

export default ParametricJs
