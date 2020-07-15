import features from './autoload'
import Feature from './Feature'
// import * as features from './features'
import ThreeBSP from './helpers/threeCSG.js'
import { setup } from './setup'
import materials from './materials/index.js'
import PathToShape from './helpers/PathToShape'
// Re-export some parts from THREE
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { compileParameters, parseEntity, computeMouseXY, getFeatureHandler, getFeatureById, getFeatureHandlerById, createObject } from './helpers'
export * from './setup'

const { THREE } = window

const clearThreeScene = (obj3d = {}) => {
  while (obj3d.children.length > 0) {
    obj3d.remove(obj3d.children[0])
  }
}

/**
 * Class: ParametricJs
 */
export class ParametricJs {
  constructor (options = {}) {
    const { debug = true } = options
    // Debug
    if (debug) {
      console.log('materials', materials)
      console.log('features', features)
    }

    // Set version
    this.version = '0.0.1'

    // Register basic features
    this.featureHandlers = Object.values(features)
    this.featureHandlersLookup = { ...features }

    // Eagerly init scene ?
    const { scene, camera, mouse, renderer, controls, element, raycast } = setup(options)
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

    // # Expose
    Object.assign(this,
      {
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
  }

  // ===========
  // Feature
  getFeatureMeta (feature = '') {
    return this.featureHandlers[feature]
  }

  // ===========
  // Interactions
  clear () {
    // Clear object3d

  }

  /**
   * Set a new model to the scene. It renders to a child of the root scene
   * @param {{}} what
   */
  set (what = {}) {
    // The Object3D to use
    const to = this.model

    // # Clear process (TODO move to clear())
    // Call all destroy handlers (TODO use flattened feature tree)
    this.featureMeshLookup.map(feature => {
      console.log(feature)
    })
    // Remove from THREE
    clearThreeScene(to)

    // Add to scene
    to.add(what)
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
  async createFeature (featureNode = {}, { livePart, features }) {
    const { type } = featureNode

    // Find handler according to feature name
    const featureHandler = getFeatureHandler(this.featureHandlersLookup)(featureNode.type)

    if (!featureHandler) {
      throw new Error(`No featureHandler found for feature: "${type}"`)
    }

    // Create new object from feature blueprint
    const component = new Feature(featureHandler, featureNode)

    // The context for a feature
    const payload = {
      ...this,

      // Register LifeCycle hook
      destroy: (cb) => {
        // TODO
        this.destroy = cb
      },
      addEventListener: this.renderer.domElement.addEventListener,
      // Mock scene
      scene: new THREE.Object3D(),
      rootScene: this.scene,
      feature: featureNode, // Deprecate ?
      THREE,
      // Returns the scene meshes from features
      parseEntities: (entities = []) => {
        return entities.map(parseEntity({
          livePart,
          featureMeshLookup: this.featureMeshLookup // HACKY
        }))
      // createParseEntities(livePart),
      },
      createModelLoader: loader => (url) => {
        return new Promise((resolve, reject) => {
          loader.load(url, data => resolve(data), null, reject)
        })
      },
      previousState: livePart, // TODO DEPRECATE in favor for `livePart`
      livePart,
      PathToShape,
      mouse: this.mouse,
      getMouse: () => {
        return this.mouse
      },
      raycaster: new THREE.Raycaster(),
      getFeatureHandlerById: getFeatureHandlerById(features),
      compile: () => {
        // TODO
      },
      getMaterial: (name = '') => {
        // const found = this.materials.find(elem => elem.name === name)
        const found = this.materials[name]
        if (!found) {
          console.warn(this.materials)
          throw new Error(`Material not found: ${name}`)
        }
        return found
      },
      getFeatureById
    }

    // Get render Fn
    const renderFn = component.render

    // Call render fn
    const mesh = await renderFn(payload, livePart) || {}
    // mesh.name = mesh.name || type
    return mesh || false
  }

  // Browser event handler alias
  on (event, cb = () => { }) {
    return this.element.addEventListener(event, cb)
  }

  /**
   * Convert the features to a THREE js mesh
   * @param {*} cadData
   */
  async render (cadData = { features: [] }) {
    if (!cadData) {
      throw new Error('No CadData')
    }

    // # Group all features in an Object3D
    const livePart = createObject({
      name: 'features'
    })
    // console.log('livePart', livePart)

    // Compile global parameters (adds cadData._parameters)
    compileParameters(cadData)

    // # Process each feature
    const { features = [] } = cadData

    // Clone features ( featureMeshLookup contains references to the scene )
    const featureMeshLookup = features.map(elem => ({ ...elem }))

    features.map(async (feature, i) => {
      // Skip suppress features
      if (feature.suppress) {
        console.log(`Skipping suppressed feature ${i}`, { ...feature })
        return
      }

      console.log(`Compiling feature ${i}`, { ...feature })

      // Create feature placeholder
      const featurePlaceholderObject = createObject({
        name: `feature${i}`
      })
      livePart.add(featurePlaceholderObject)

      // Run feature
      const mesh = await this.processFeature(
        feature,
        { featurePlaceholderObject, livePart, features })

      // Add to the livePart, so upcoming feature can use the mesh
      if (mesh) {
        featurePlaceholderObject.add(mesh)
      }

      // Mutate featureMeshLookup
      featureMeshLookup[i]._mesh = featurePlaceholderObject
      featureMeshLookup[i]._handler = featurePlaceholderObject
    })

    // Expose scene features
    this.featureMeshLookup = featureMeshLookup

    return livePart
  }
}

// Factory function
export function create (args) {
  return new ParametricJs(args)
}

// Expose to window
// window.ParametricJs = ParametricJs

export default ParametricJs
